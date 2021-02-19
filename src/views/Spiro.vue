<template>
  <div>
    <h2>Spirograph Things</h2>
    <div>
      <svg>
        <circle cx="40.5" cy="25.5" r="8" fill="none" stroke="#000"></circle>
      </svg>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue } from "vue-property-decorator";

// https://mathworld.wolfram.com/Hypotrochoid.html
// http://sub.blue/

export default class Spiro extends Vue {}
</script>
