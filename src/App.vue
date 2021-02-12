<template>
  <div id="app">
    <div id="nav">
      <router-link to="/">Home</router-link> |
      <router-link to="/about">About</router-link> |
      <router-link to="/circles">Apollonius</router-link> |
      <router-link to="/drawing">Drawing Machine</router-link> |
      <router-link to="/grids">Grids</router-link> |
      <router-link to="/guilloche">Guilloche</router-link> |
      <router-link to="/penrose">Penrose</router-link> |
      <router-link to="/spiro">Spirograph</router-link> |
      <router-link to="/tessel">Tesselations</router-link> |
      <router-link to="/tiling">Tiling</router-link> |
      <router-link to="/testbed">Test Bed</router-link>
    </div>
    <router-view />
  </div>
</template>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
#nav {
  padding: 30px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}
</style>
