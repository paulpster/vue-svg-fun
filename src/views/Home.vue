<template>
  <div class="home">
    <!-- 200x200 -->
    <img alt="Vue logo" src="../assets/apoll.svg" />
    <HelloWorld msg="Welcome to My Vue.js App" />
  </div>
</template>

<script lang="ts">
// @ is an alias to /src
import { Vue, Component } from "vue-property-decorator";
import HelloWorld from "@/components/HelloWorld.vue";

@Component({ components: { HelloWorld } })
export default class Home extends Vue {}
</script>

<style scoped>
svg circle {
  fill: none;
  stroke: black;
}
</style>
