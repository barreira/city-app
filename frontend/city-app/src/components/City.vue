<template>
  <div>
    <p>{{ city.weather }}</p>
    <p>{{ city.weather.name }}</p>
    <p>{{ city.weather.weather[0].description.charAt(0).toUpperCase() + city.weather.weather[0].description.slice(1) }}</p>
    <p>{{ Math.round(city.weather.main.temp - 273.15) + '\xB0'}}</p>
  </div>
</template>

<script>
export default {
  props: ['city'],
  data() {
    return {

    }
  },
  methods: {
    
  }
}
</script>

<style>
p {
  margin-top: 70px;
}
</style>


