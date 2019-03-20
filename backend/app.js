const express = require('express');
const request = require('request');
const webPush = require('web-push');
const bodyParser = require('body-parser');

const publicVapidKey = 'BMqT0H3AHi6U8bXkMsthL0_gUfUI146wrBiTSxyXmN-9sNUlBcYC79aHvpU8lBrlrLeRK0LBIw3Gu2NOb8-2IA8';
const privateVapidKey = 'ohjtc9smmEvkuvMkK0QaAaWiI2kkOdSW0wx2QU0t0R4';
const apiKey = '02586c0ff71bf561560254084254f57f';

var app = express();

webPush.setVapidDetails('mailto:test@test.com', publicVapidKey, privateVapidKey);

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});
app.use(bodyParser.json());

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

app.post('/subscribe', (req, res) => {
  const subscription = req.body;
  const payload = JSON.stringify({
    title: 'Push Test'
  });

  res.status(201).json({});
  webPush.sendNotification(subscription, payload).catch(err => console.error(err));
});

app.listen(3000);
console.log('You are listening to port 3000');