<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'app'
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
@font-face {
  font-family: 'myfont';
    src:  url('fonts/myfont.ttf.woff') format('woff'),
    url('fonts/myfont.ttf.svg#Arial') format('svg'),
    url('fonts/myfont.ttf.eot');
    font-weight: normal;
    font-style: normal;
}
</style>
