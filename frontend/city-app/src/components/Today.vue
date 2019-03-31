<template>
  <div id="today">
    <label id="name">{{ today.name }}</label>
    <label id="today-label">{{ today.date }}</label>
    <label id="today-weather">{{ today.weather }}</label>
    <img v-bind:src="today.icon"/>
    <label id="temp">{{ today.temp }}</label>
    <div class="today-info">
      <label class="info">{{ today.humidity }}</label>
      <label class="info">{{ today.aqi }}</label>
      <label class="info">{{ today.uv }}</label>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    today: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
  
    }
  }
}
</script>

<style scoped>
#today {
  background: white;
  margin: 200px 20px 20px 20px;
  border-radius: 5px;
  padding: 20px;
  max-width: 1200px;
  margin: 200px auto 20px auto;
  box-sizing: border-box;
}

label {
  color: #333;
  display: block;
}

#name {
  font-weight: 600;
  font-size: 24px;
  display: block;
}

#today-label, #today-weather {
  font-size: 20px;
}

img {
  margin-top: 20px;
}

#temp {
  display: inline;
  margin: 0 20px;
  font-size: 50px;
}

.today-info {
  margin-top: 20px;
}

.info {
  font-size: 18px;
}
</style>

