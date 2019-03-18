const express = require('express');
const request = require('request');

const apiKey = '02586c0ff71bf561560254084254f57f';

var app = express();

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.get('/:city', function(req, res) {
  const weatherURL = `http://api.openweathermap.org/data/2.5/weather?q=${req.params.city}&appid=${apiKey}`

  request(weatherURL, function(err, response, body) {
    if (err) {
      console.log('error: ', err);
      throw new Error(err);
    } 
    
    const weather = JSON.parse(body);
      
    if (weather.cod !== '404') {
      const uvOptions = { 
        method: 'GET',
        url: 'https://api.openuv.io/api/v1/uv',
        qs: { 
          lat: weather.coord.lat, 
          lng: weather.coord.lon
        },
        headers: { 
          'content-type': 'application/json',
          'x-access-token': '6777d021fc69af21831b0374f689d540' 
        }
      };
    
      request(uvOptions, function (error, response, body) {
        if (error) {
          console.log(error);
          throw new Error(error);
        }

        const message = {
          weather,
          uv: body
        };

        res.send(message);
      });
    } else {
      res.send(weather);
    }
  });
});

app.listen(3000);

console.log('You are listening to port 3000');