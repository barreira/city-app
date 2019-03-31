<template>
  <div>
    <app-header v-on:handleSearch="handleSearch($event)"></app-header>
    <app-today v-bind:today="today"></app-today>
    <app-next v-bind:next="next"></app-next>
  </div>
</template>

<script>
import Header from './components/Header.vue';
import Today from './components/Today.vue';
import Next from './components/Next.vue';

export default {
  components: {
    'app-header': Header,
    'app-today': Today,
    'app-next': Next,
  },
  data () {
    return {
      today: {},
      next: []
    }
  },
  methods: {
    handleSearch: function(searchCity) {
      this.handleCall(searchCity);
      
      setInterval(function() {
          this.handleCall(searchCity)
      }.bind(this), 60 * 60 * 1000);
    },
    handleCall: function(searchCity) {
      this.$http.post('http://localhost:3000/' + searchCity, {
        subscription: window.subscription
      }).then(function(data) {
        this.test = data.body;
        const date = new Date(data.body.todayList[0].date * 1000);
        var cityData = {
          name: data.body.name,
          uv: "",
          aqi: "",
          weather: data.body.todayList[0].description,
          humidity: "Humidity: " + data.body.todayList[0].humidity,
          date: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"][date.getDay()] + ", " + date.getHours() + ":00",
          icon: '',
          temp: data.body.todayList[0].temp + "\xB0",
          todayList: [],
          nextList: []
        };
        var nextData = [];

        const auxWeather = cityData.weather.toLowerCase();

        if (auxWeather.includes('mist')) {
          cityData.icon = '../src/assets/mist.png';
        } else if (auxWeather.includes('shower')) {
          cityData.icon = '../src/assets/heavyRain.png';
        } else if (auxWeather.includes('rain')) {
          cityData.icon = '../src/assets/rain.png';
        } else if (auxWeather.includes('clear')) {
          cityData.icon = '../src/assets/sun.png';
        } else if (auxWeather.includes('snow')) {
          cityData.icon = '../src/assets/snow.png';
        } else if (auxWeather.includes('clouds')) {
          cityData.icon = '../src/assets/clouds.png';
        } else {
          cityData.icon = '../src/assets/hurricane.png';
        }

        if (data.body.aqi <= 50) {
          cityData.aqi = "Air Quality: " + data.body.aqi + " (Good)";
        } else if (data.body.aqi > 50 && data.body.aqi <= 100) {
          cityData.aqi = "Air Quality: " + data.body.aqi + " (Moderate)";
        } else if (data.body.aqi > 100 && data.body.aqi <= 150) {
          cityData.aqi = "Air Quality: " + data.body.aqi + " (Unhealthy for Senitive Groups)";
        } else if (data.body.aqi > 150 && data.body.aqi <= 200) {
          cityData.aqi = "Air Quality: " + data.body.aqi + " (Unhealthy)";
        } else if (data.body.aqi > 200 && data.body.aqi <= 300) {
          cityData.aqi = "Air Quality: " + data.body.aqi + " (Very Unhealthy)";
        } else if (data.body.aqi > 300) {
          cityData.aqi = "Air Quality: " + data.body.aqi + " (Hazardous)";
        }

        if (data.body.uvMax < 3) {
          cityData.uv = "UV Index: " + data.body.uvMax + " (Low)";
        } else if (data.body.uvMax >= 3 && data.body.uvMax < 6) {
          cityData.uv = "UV Index: " + data.body.uvMax + " (Moderate)";
        } else if (data.body.uvMax >= 6 && data.body.uvMax < 8) {
          cityData.uv = "UV Index: " + data.body.uvMax + " (High)";
        } else if (data.body.uvMax >= 8 && data.body.uvMax < 11) {
          cityData.uv = "UV Index: " + data.body.uvMax + " (Very High)";
        } else if (data.body.uvMax >= 11) {
          cityData.uv = "UV Index: " + data.body.uvMax + " (Extreme)";
        }

        for (var i = 0; i < data.body.nextList.length; i++) {
          const d = new Date(data.body.nextList[i].date * 1000);
          const w = data.body.nextList[i].weather.toLowerCase();

          window.console.log(d);

          var x = {
            date: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"][d.getDay()],
            max: "Max: " + data.body.nextList[i].maxTemp + "\xB0",
            min: "Min: " + data.body.nextList[i].minTemp + "\xB0",
            icon: ''
          };

          if (w.includes('mist')) {
            x.icon = '../src/assets/mist.png';
          } else if (w.includes('shower')) {
            x.icon = '../src/assets/heavyRain.png';
          } else if (w.includes('rain')) {
            x.icon = '../src/assets/rain.png';
          } else if (w.includes('clear')) {
            x.icon = '../src/assets/sun.png';
          } else if (w.includes('snow')) {
            x.icon = '../src/assets/snow.png';
          } else if (w.includes('clouds')) {
            x.icon = '../src/assets/clouds.png';
          } else {
            x.icon = '../src/assets/hurricane.png';
          }

          nextData.push(x);
        }

        this.today = cityData;
        this.next = nextData;
      });
    }
  }
}
</script>

<style>
body {
  width: 100%;
  height: 100%;
  margin: 0;
  background: #f4f4f4;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
}
</style>
