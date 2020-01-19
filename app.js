const fetch = require('node-fetch');
const apiKey = 'PepooszebntFrjLfNhGJzDYYRDqrObwm'

function main(year='', lat='', long='')
{
  getStationsForYear(2000, 41, -96).then(
    function(json){
      stationArray = getStationArray(json);
      getSizedArray(stationArray, 2000).then(function(sizedArrays){
        return [centToInch(averageArray(sizedArrays[0])), celcToF(averageArray(sizedArrays[0]))];
      });
    }).catch(function() {
      console.log("Uh oh spaghettios");
    });
}

async function getSizedArray(stationArray = '', year)
{
  let arrayP = await findArray('PRCP', year, stationArray[0]);
  let arrayT = await findArray('TAVG', year, stationArray[0]);
  var counter = 1;
  while(arrayT.includes(0) || arrayP.includes(0) || counter >= stationArray.length)
  {
    let newArrayT = await findArray('TAVG', year, stationArray[counter]);
    let newArrayP = await findArray('PRCP', year, stationArray[counter]);
    for(i = 0; i < 12; i++)
    {
      if(arrayT[i] == 0)
      {
        arrayT[i] == newArrayT[i];
      }
      if(arrayP[i] == 0)
      {
        arrayP[i] == newArrayP[i];
      }
    }
    counter++;
  }
  return [arrayP, arrayT];
}

function findArray(dataTypeId = '', year = '', stationId = '')
{
  var arr = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,];
  nextDataPromise = getData(year, dataTypeId, stationId).then(function(json){
    for(i = 0; i < json['results'].length; i++)
    {
      var month = parseInt(json['results'][i]['date'].split("-")[1]);
      arr[month - 1] = json['results'][i]['value'];
    }
    return arr;
  });
  return Promise.all([nextDataPromise]).then(function(values) {
    return values;
  });
}

function getStationArray(json)
{
  var arr = [];
  for(i = 0; i < json['results'].length; i++)
  {
    if(json['results'][i]['datacoverage'] > 0.85)
    {
      arr[arr.length] = json['results'][i]['id'];
    }
  }
  return arr;
}

function parseJSON(json)
{
  var arr = [];
  for(i = 0; i < json['results'].length; i++)
  {
    //console.log(json['results'][i]['value']);
    arr[arr.length] = json['results'][i]['value'];
  }
  return averageArray(arr);
}

function averageArray(option){
  var answer = 0;
  var len = option[0].length;
  for( i = 0; i<len; i++){
    //console.log(option[0][i]);
    answer+= option[0][i];
  }
  return (answer / len);
}

async function getStationsForYear(year = '', lat = '', long = '')
{
  url = 'https://www.ncdc.noaa.gov/cdo-web/api/v2/stations?datatypeid=PRCP&datatypeid=TAVG&datasetid=GSOM&limit=1000&startdate=' + year + '-01-01&enddate=' + year + '-12-31&extent=' + (lat - 0.5) + ',' + (long - 0.5) + ',' + (lat + 0.5) + ',' + (long + 0.5);
  // Default options are marked with *
  const response = await fetch(url, {
    method: 'GET', // *GET, POST, PUT, DELETE, etc.
    headers: {
      token: apiKey
    }
  });
  return await response.json(); // parses JSON response into native JavaScript objects
}

async function getData(yearBorn = '', dataType = '', stationId = '') {
  url = 'https://www.ncdc.noaa.gov/cdo-web/api/v2/data?limit=1000&datatypeid=' + dataType +'&datasetid=GSOM&stationid=' + stationId + "&startdate=" + yearBorn + "-01-01&enddate=" + yearBorn + "-12-31";
  // Default options are marked with *
  const response = await fetch(url, {
    method: 'GET', // *GET, POST, PUT, DELETE, etc.
    headers: {
      token: apiKey
    }
  });
  return await response.json(); // parses JSON response into native JavaScript objects
}

function centToInch(obj){
  return(obj /2.54);
}
function celcToF(obj){
  return(obj*(9/5)) + 32;
}

main();