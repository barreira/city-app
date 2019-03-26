<template>
  <div>
    <app-header v-on:handleSearch="handleSearch($event)"></app-header>
    <app-city v-bind:city="city"></app-city>
    <p>{{ test }}</p>
  </div>
</template>

<script>
import Header from './components/Header.vue';
import City from './components/City.vue';

export default {
  components: {
    'app-header': Header,
    'app-city': City
  },
  data () {
    return {
      city: '',
      test: '',
    }
  },
  methods: {
    handleSearch: function(searchCity) {
      window.console.log(searchCity);

      this.$http.post('http://localhost:3000/' + searchCity, {
        subscription: window.subscription
      }).then(function(data) {
        this.test = data.body;
        //window.console.log(data.body.weather);
      });
    }
    /*getWeather: function() {
      window.console.log(window.subscription);

      this.$http.post('http://localhost:3000/' + this.city).then(function(data) {
        this.weather = data.body;
      });
    }*/
  }
}
</script>

<style>
body {
  width: 100%;
  height: 100%;
  margin: 0;
  background: #f4f4f4;
}
</style>
