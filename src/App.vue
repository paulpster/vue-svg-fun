<template>
  <div id="app">
    <div id="nav">
      <div><router-link to="/">Home</router-link></div>
      <div><router-link to="/circles">Apollonius</router-link></div>
      <div><router-link to="/drawing">Drawing Machine</router-link></div>
      <div><router-link to="/grids">Grids</router-link></div>
      <div><router-link to="/guilloche">Guilloche</router-link></div>
      <div><router-link to="/penrose">Penrose</router-link></div>
      <div><router-link to="/spiro">Spirograph</router-link></div>
      <div><router-link to="/tessel">Tesselations</router-link></div>
      <div><router-link to="/tiling">Tiling</router-link></div>
      <div><router-link to="/about">About</router-link></div>
      <div><router-link to="/testbed">Test Bed</router-link></div>
    </div>
    <div id="content">
      <router-view />
    </div>
  </div>
</template>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  display: flex;
}
#nav {
  padding: 2rem;
}
#nav a {
  font-weight: bold;
  color: #2c3e50;
}
#nav a.router-link-exact-active {
  color: #42b983;
}
#content {
  margin: 1rem;
}
</style>
