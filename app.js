const fetch = require('node-fetch');
const apiKey = 'PepooszebntFrjLfNhGJzDYYRDqrObwm'

  // getData("https://www.ncdc.noaa.gov/cdo-web/api/v2/datasets?data").then(function(u){ return u.json();}
  // ).then(
  //   function(json){
  //     console.log(json);
  //   });

function main()
{
  //getAverageTempList(2018, );
  getData(2018, 61240).then(
    function(json){
         console.log(json['results']);
       });;
}

function getAverageTempList(yearBorn, zipcode)
{
  for(i = yearBorn; i < 2019; ++i)
  {
    var response = getData(i, zipcode);
  }
}

function getAveragePrecipList(yearBorn, zipcode)
{}
async function getData(yearBorn = '', zipcode = '') {
  url = 'https://www.ncdc.noaa.gov/cdo-web/api/v2/data?datatypeid=PRCP&datasetid=GSOM&locationid=ZIP:' + zipcode + "&startdate=" + yearBorn + "-01-01&enddate=" + yearBorn + "-12-31";
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