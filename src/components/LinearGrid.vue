<template>
  <div class="svgcont">
    <SVGComponent v-bind:param="svgparam">
      <def>
        <g v-bind:id="currentGrid.name()">
          <line
            v-for="(l, idx) in currentGrid.base()"
            v-bind:key="idx"
            v-bind:x1="l.x1"
            v-bind:y1="l.y1"
            v-bind:x2="l.x2"
            v-bind:y2="l.y2"
            v-bind:stroke-width="strokeWid"
          />
        </g>
      </def>
      <use
        v-for="(l, idx) in currentGrid.plot(SVGExtent)"
        v-bind:key="idx"
        v-bind:x="l.x"
        v-bind:y="l.y"
        v-bind:transform="l.trans"
        v-bind:href="l.href"
      />
      <!--<circle x="0" y="0" r=".1" v-bind:stroke-width="strokeWid" />-->
    </SVGComponent>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from "vue-property-decorator";
import SVGComponent, { SVGConfig } from "@/components/SVG.vue";
import { Grid, gridList, Extent } from "@/utils/GridBasics";

@Component({ components: { SVGComponent } })
export default class LinearGrid extends Vue {
  @Prop() svgparam!: SVGConfig;
  @Prop({ default: false }) readonly bZoom!: boolean;
  @Prop({ default: false }) readonly bPan!: boolean;
  @Prop() gridname!: keyof typeof gridList;

  // this will not work, this would work with an event onChange
  // I still want to find a typescript safe way to do this...
  currentGrid: Grid = gridList[this.gridname];

  // need to have some smarts with each cell definition so that
  //    each cell def knows something about how to draw itself
  @Watch("gridname")
  onGridChange(val: keyof typeof gridList /*, oldVal: string*/) {
    this.currentGrid = gridList[val];
  }

  get strokeWid() {
    return this.svgparam.vwWidth / this.svgparam.svgWid;
  }
  get SVGExtent(): Extent {
    return {
      left: this.svgparam.vwLeft,
      right: this.svgparam.vwLeft + this.svgparam.vwWidth,
      top: this.svgparam.vwTop + this.svgparam.vwHeight,
      bottom: this.svgparam.vwTop
    };
  }
}
</script>

<style scoped>
line {
  stroke: black;
  fill: none;
}
use {
  stroke: black;
}
</style>
