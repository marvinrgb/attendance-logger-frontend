<script setup>
import { RouterView } from 'vue-router';
</script>

<template>
  <div id="app-all">
    <RouterView></RouterView>

  </div>
</template>

<style scoped>
/* #app-result-message {
  height: 50px;
  width: 50px;
  border: 1px solid black;
} */
</style>

<style>
* {
  padding: 0;
  margin: 0;
  box-sizing: border-box;
}
#app-all {
  height: 100vh;
  width: 100vw;
  overflow-x: hidden;
}
</style>

<script>
export default {
  data() {
    return {
      devices: Array,
      messages: Object,
      data: Object
    }
  },
  mounted() {
  }
}
</script>