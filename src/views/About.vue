<template>
  <div class="about">
    <HelloWorld msg="My About Page" />
  </div>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import HelloWorld from "@/components/HelloWorld.vue";

@Component({ components: { HelloWorld } })
export default class About extends Vue {}
</script>
