<template>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    v-bind:width="param.svgWid"
    v-bind:height="param.svgHgt"
    v-bind:viewBox="vwBox"
  >
    <slot></slot>
  </svg>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";

export type SVGConfig = {
  svgWid: number;
  svgHgt: number;
  vwLeft: number;
  vwTop: number;
  vwWidth: number;
  vwHeight: number;
};

// this is pretty dumb at the moment.
// i would like to add panning and zooming abilites at some point

@Component({ components: {} })
export default class SVGComponent extends Vue {
  @Prop() param!: SVGConfig;

  //////////////////////////////////////////
  // lifecycle things....
  beforeMount() {
    console.log("SVGComponent::beforeMount");
  }
  mounted() {
    console.log("SVGComponent::mounted");
  }
  beforeDestroy() {
    console.log("SVGComponent::beforeDestroy");
  }

  /////////////////////////////
  // computed
  get vwBox(): string {
    return `${this.param.vwLeft} ${this.param.vwTop} ${this.param.vwWidth} ${this.param.vwHeight}`;
  }
}
</script>
