<template>
  <div class="about">
    <HelloWorld msg="My About Page" />
    <CirclesHelp />
  </div>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import HelloWorld from "@/components/HelloWorld.vue";
import CirclesHelp from "@/components/CirclesHelp.vue";

@Component({ components: { HelloWorld, CirclesHelp } })
export default class About extends Vue {}
</script>
