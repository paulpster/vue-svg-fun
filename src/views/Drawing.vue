<template>
  <div>
    <h2>Drawing machine</h2>
  </div>
</template>

<script lang="ts">
////////////////////////////////////////////////
// HTML5 drag and drop does not work with SVG //
////////////////////////////////////////////////
//  looking at:
// https://www.petercollingridge.co.uk/tutorials/svg/interactive/dragging/
// (x,y) , then it will have coordinates on screen of (ax+e,dy+f)
// screen to SVG (Sx-e)/a,(Sy-f)/d
//
// https://vuejsexamples.com/
//

import { Vue, Component } from "vue-property-decorator";

// i would like to have a resizeable SVG component
//  zoom and panning would be nice

@Component({ components: {} })
export default class DrawingMachine extends Vue {}
</script>

<style scoped></style>
