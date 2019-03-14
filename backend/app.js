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
  const url = `http://api.openweathermap.org/data/2.5/weather?q=${req.params.city}&appid=${apiKey}`

  request(url, function(err, response, body) {
    if (err) {
      console.log('error: ', err);
    } else {
      const weather = JSON.parse(body);
      const message = `It's ${weather.main.temp - 273.15} degrees in ${weather.name}!`;
      res.send(message);
    }
  });
});

app.listen(3000);

console.log('You are listening to port 3000');