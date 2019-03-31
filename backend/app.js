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

function sendNotifications(req, weather) {
  if (weather.aqi > 50 && weather.aqi <= 100) {
    sendNotification(req, "Moderate Air Quality", "Air quality is acceptable; however, for some pollutants there may be a moderate health concern for a very small number of people who are unusually sensitive to air pollution. Active children and adults, and people with respiratory disease, such as asthma, should limit prolonged outdoor exertion.");
  } else if (weather.aqi > 100 && weather.aqi <= 150) {
    sendNotification(req, "Air Quality Unhealthy for Sensitive Groups", "Members of sensitive groups may experience health effects. The general public is not likely to be affected. Active children and adults, and people with respiratory disease, such as asthma, should limit prolonged outdoor exertion.");
  } else if (weather.aqi > 150 && weather.aqi <= 200) {
    sendNotification(req, "Air Quality Unhealthy", "Everyone may begin to experience health effects; members of sensitive groups may experience more serious health effects. Active children and adults, and people with respiratory disease, such as asthma, should avoid prolonged outdoor exertion; everyone else, especially children, should limit prolonged outdoor exertion.");
  } else if (weather.aqi > 200 && weather.aqi <= 300) {
    sendNotification(req, "Air Quality Very Unhealthy", "Health warnings of emergency conditions. The entire population is more likely to be affected. Active children and adults, and people with respiratory disease, such as asthma, should avoid all outdoor exertion; everyone else, especially children, should limit outdoor exertion.");
  } else if (weather.aqi > 300) {
    sendNotification(req, "Air Quality Hazardous", "Health alert: everyone may experience more serious health effects. Everyone should avoid all outdoor exertion.");
  }

  if (weather.uvMax >= 3 && weather.uvMax < 6) {
    sendNotification(req, "Moderate UV Index", "A UV Index reading of 3 to 5 means moderate risk of harm from unprotected sun exposure. Stay in shade near midday when the sun is strongest. If outdoors, wear sun protective clothing, a wide-brimmed hat, and UV-blocking sunglasses. Generously apply broad spectrum SPF 30+ sunscreen every 2 hours, even on cloudy days, and after swimming or sweating. Bright surfaces, such as sand, water and snow, will increase UV exposure.");
  } else if (weather.uvMax >= 6 && weather.uvMax < 8) {
    sendNotification(req, "High UV Index", "A UV Index reading of 6 to 7 means high risk of harm from unprotected sun exposure. Protection against skin and eye damage is needed. Reduce time in the sun between 10 a.m. and 4 p.m. If outdoors, seek shade and wear sun protective clothing, a wide-brimmed hat, and UV-blocking sunglasses. Generously apply broad spectrum SPF 30+ sunscreen every 2 hours, even on cloudy days, and after swimming or sweating. Bright surfaces, such as sand, water and snow, will increase UV exposure.");
  } else if (weather.uvMax >= 8 && weather.uvMax < 11) {
    sendNotification(req, "Very High UV Index", "A UV Index reading of 8 to 10 means very high risk of harm from unprotected sun exposure. Take extra precautions because unprotected skin and eyes will be damaged and can burn quickly. Minimize sun exposure between 10 a.m. and 4 p.m. If outdoors, seek shade and wear sun protective clothing, a wide-brimmed hat, and UV-blocking sunglasses. Generously apply broad spectrum SPF 30+ sunscreen every 2 hours, even on cloudy days, and after swimming or sweating. Bright surfaces, such as sand, water and snow, will increase UV exposure.");
  } else if (weather.uvMax >= 11) {
    sendNotification(req, "Extreme UV Index", "A UV Index reading of 11 or more means extreme risk of harm from unprotected sun exposure. Take all precautions because unprotected skin and eyes can burn in minutes. Try to avoid sun exposure between 10 a.m. and 4 p.m. If outdoors, seek shade and wear sun protective clothing, a wide-brimmed hat, and UV-blocking sunglasses. Generously apply broad spectrum SPF 30+ sunscreen every 2 hours, even on cloudy days, and after swimming or sweating. Bright surfaces, such as sand, water and snow, will increase UV exposure.");
  }
}

function sendNotification(req, title, message) {
  const payload = JSON.stringify({
    title,
    message
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