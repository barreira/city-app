<template>
  <div id="next">
    <ul>
      <li v-for="(nextElement, index) in next" v-bind:key="index">
        <label>{{ nextElement.date }}</label>
        <img v-bind:src="nextElement.icon" />
        <label>{{ nextElement.max }}</label>
        <label>{{ nextElement.min }}</label>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  props: {
    next: {
      type: Array,
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
#next {
  width: 100%;
  max-width: 1200px;
  margin: 40px auto;
  padding: 0 20px;
  box-sizing: border-box;
}

label {
  color: #333;
  font-size: 18px;
  display: block;
  margin: 5px 0;
}

ul {
  display: flex;
  flex-wrap: wrap;
  list-style-type: none;
  padding: 0;
}

li {
  flex-grow: 1;
  flex-basis: 300px;
  text-align: center;
  padding: 30px;
  background: white;
  border-radius: 5px;
  margin: 20px;
}
</style>

