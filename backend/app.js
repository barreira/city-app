const express = require('express');
const request = require('request');
const requestPromise = require('request-promise');
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

app.post('/subscribe', (req, res) => {
  /*const subscription = req.body;
  const payload = JSON.stringify({
    title: 'Push Test'
  });

  res.status(201).json({});
  webPush.sendNotification(subscription, payload).catch(err => console.error(err));*/
});

app.post('/:city', function(req, res) {
  const weatherURL = `http://api.openweathermap.org/data/2.5/forecast?q=${req.params.city}&appid=${apiKey}`

  request(weatherURL, function(err, response, body) {
    if (err) {
      console.log('error: ', err);
      throw new Error(err);
    } 
    
    const receivedWeather = JSON.parse(body);

    if (receivedWeather.cod !== '404') {
      const weather = {
        name: receivedWeather.city.name,
        lat: receivedWeather.city.coord.lat,
        lon: receivedWeather.city.coord.lon,
        uv: 0,
        uvMax: 0,
        aqi: 0,
        list: []
      };

      const airURL = `http://api.airvisual.com/v2/nearest_city?lat=${weather.lat}&lon=${weather.lon}&key=2rn8uBbGCowXGyWPw`;

      request(airURL, function(err, response, body) {
        if (err) {
          console.log('error: ', err);
          throw new Error(err);
        }

        const airQuality = JSON.parse(body);
        
        weather.aqi = airQuality.data.current.pollution.aqius;

        getUVRequest(weather.lat, weather.lon).then(function(result) {
          const uvResult = JSON.parse(result);
          weather.uv = uvResult.result.uv;
          weather.uvMax = uvResult.result.uv_max;
        
          for (var element in receivedWeather.list) {
            const listElement = receivedWeather.list[element];
            const weatherElement = {
              date: listElement.dt,
              minTemp: Math.round(listElement.main.temp_min - 273.15),
              temp: Math.round(listElement.main.temp - 273.15),
              maxTemp: Math.round(listElement.main.temp_max - 273.15),
              humidity: listElement.main.humidity + '%',
              weather: listElement.weather[0].main,
              description: listElement.weather[0].description.charAt(0).toUpperCase() + listElement.weather[0].description.slice(1),
            };

            weather.list.push(weatherElement);
          }

          sendNotifications(req, weather);

          res.send(weather);
        });
      });
    }
  });
});

/*app.post('/:city', function(req, res) {
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
    
      request(uvOptions, function(error, response, body) {
        if (error) {
          console.log(error);
          throw new Error(error);
        }

        const uv = JSON.parse(body).result.uv_max;
        const message = {
          weather,
          uv: body
        };

        res.send(message);

        if (req.body.subscription && uv >= 6) {
          const payload = JSON.stringify({
            title: 'Índice UV alto!'
          });

          webPush.sendNotification(req.body.subscription, payload).catch(err => console.error(err));
        }
      });
    } else {
      res.send(weather);
    }
  });
});*/

/* Fazer um switch case gigante com notificações de acordo com o param weather */
function sendNotifications(req, weather) {
  const payload = JSON.stringify({
    title: 'Índice UV alto!'
  });

  webPush.sendNotification(req.body.subscription, payload).catch(err => console.error(err));
}

async function getUVRequest(lat, lng) {
  const uvOptions = { 
    method: 'GET',
    url: 'https://api.openuv.io/api/v1/uv',
    qs: { 
      lat, 
      lng
    },
    headers: { 
      'content-type': 'application/json',
      'x-access-token': '6777d021fc69af21831b0374f689d540' 
    }
  };

  try {
    var result = await requestPromise(uvOptions);
    return result;
  } catch (err) {
    console.error(err);
  }
}

app.listen(3000);
console.log('You are listening to port 3000');