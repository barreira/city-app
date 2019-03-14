<template>
  <div>
    <h1>{{ title }}</h1>
    <label>City:</label>
    <input type="text" name="city" v-model="city"/>
    <button v-on:click="test">Get Weather</button>
    <p>{{ weather }}</p>
  </div>
</template>

<script>
export default {
  data () {
    return {
      title: 'Weather App',
      weather: '',
      city: ""
    }
  },
  methods: {
    test: function() {
      this.$http.get('http://localhost:3000/' + this.city).then(function(data) {
        this.weather = data.body;
      });
    }
  }
}
</script>

<style>

</style>
