const fetch = require('node-fetch');
const apiKey = 'PepooszebntFrjLfNhGJzDYYRDqrObwm'

function main()
{
  getData(2018, 60508, 'PRCP').then(
    function(json){
      console.log(avg = parseJSON(json));
  });
  getData(2018, 61240, 'TAVG').then(
    function(json){
      console.log(avg = parseJSON(json));
  });
}

function parseJSON(json)
{
  var arr = [];
  for(i = 0; i < json['results'].length; i++)
  {
    arr[arr.length] = json['results'][i]['value'];
  }
  return averageArray(arr);
}

function averageArray(option){
  var answer = 0;
  var len = option.length;
  for( i = 0; i<len; i++){
    answer+= option[i];
  }
  return (answer / option.length);
}

async function getData(yearBorn = '', zipcode = '', dataType = '') {
  url = 'https://www.ncdc.noaa.gov/cdo-web/api/v2/data?limit=1000&datatypeid=' + dataType +'&datasetid=GSOM&locationid=ZIP:' + zipcode + "&startdate=" + yearBorn + "-01-01&enddate=" + yearBorn + "-12-31";
  // Default options are marked with *
  const response = await fetch(url, {
    method: 'GET', // *GET, POST, PUT, DELETE, etc.
    headers: {
      token: apiKey
    }
  });
  return await response.json(); // parses JSON response into native JavaScript objects
}

main();