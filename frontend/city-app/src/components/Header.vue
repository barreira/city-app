<template>
  <header>
    <h1>CityWeather</h1>
    <input type="text" placeholder="City..." v-model="city" v-on:keyup.enter="handleEnter">
  </header>
</template>

<script>
export default {
  data() {
    return {
      city: ""
    }
  },
  methods: {
    handleEnter: function() {
      this.$emit('handleSearch', this.city);
    }
  }
}
</script>

<style scoped>
header {
  width: 100%;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  background: white;
  position: fixed;
  left: 0;
  top: 0;
  height: 70px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, .15);
}

h1 {
  color: white;
  padding: 0 20px;
  background: #3CBC8D;
  line-height: 70px;
  vertical-align: top;
  margin: 0;
  display: inline-block;
  font-size: 24px;
}

input {
  box-sizing: border-box;
  line-height: 70px;
  height: 70px;
  padding: 0 10px;
  margin: 0;
  border-top: 0;
  border-bottom: 0;
  border-left: 0;
  border-right: 1px solid #eaeaea;
  vertical-align: top;
  font-size: 18px;
}

input:focus {
  outline: none;
}
</style>