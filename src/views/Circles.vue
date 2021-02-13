<template>
  <div>
    <h2>Apolonian Circle Packing</h2>
    <div style="display:flex;">
      <div>
        <svg
          id="mysvg"
          xmlns="http://www.w3.org/2000/svg"
          v-bind:width="svgWid"
          v-bind:height="svgHgt"
          v-bind:viewBox="vwBox"
        >
          <circle
            v-for="(c, idx) in arrCir"
            v-bind:key="idx"
            v-bind:cx="c.x"
            v-bind:cy="c.y"
            v-bind:r="Math.abs(1 / c.b)"
            v-bind:stroke-width="strokeWid"
          />
        </svg>
      </div>
      <div>
        <button v-on:click="onStep">Step</button>
        <button v-on:click="onAnimate">Animate</button>
        <button v-on:click="onAll">All</button>
        <button v-on:click="onReset">Reset</button>
        <button v-on:click="onPrint">Print?</button>
        <!--<div v-for="(c, idx) in arrCir" v-bind:key="idx">
          {{ idx }}: x:{{ fmt.format(c.x) }} y:{{ fmt.format(c.y) }} b:{{
            fmt.format(c.b)
          }}
        </div>-->
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { Work, Circle, getMoreWork } from "@/utils/apollonius";

@Component({ components: {} })
export default class Circles extends Vue {
  // I like things square (at least for now)
  svgWid = 700;
  svgHgt = 700;
  upLeft = -1.01;
  sqSize = -2 * this.upLeft;

  fmt = new Intl.NumberFormat("en-US", { maximumSignificantDigits: 5 });

  // classic circle packing start
  appClassic: Array<Circle> = [
    { x: 0, y: 0, b: -1 },
    { x: 0.5, y: 0, b: 2 },
    { x: -0.5, y: 0, b: 2 },
    { x: 0, y: 2 / 3, b: 3 },
    { x: 0, y: -2 / 3, b: 3 }
  ];
  classWork: Array<Work> = [
    { cir: 3, depth: 1, parents: [0, 1, 2] },
    { cir: 4, depth: 1, parents: [0, 1, 2] }
  ];

  // i need to generate coordinates and radii to place circles...
  // cx, cy, r, fill, stroke, stroke-width
  // this is a bootstrapped array
  arrCir: Array<Circle> = [
    { x: 0, y: 0, b: -1 },
    { x: 0.5, y: 0, b: 2 },
    { x: -0.5, y: 0, b: 2 },
    { x: 0, y: 2 / 3, b: 3 },
    { x: 0, y: -2 / 3, b: 3 }
  ];

  work: Array<Work> = [
    { cir: 3, depth: 1, parents: [0, 1, 2] },
    { cir: 4, depth: 1, parents: [0, 1, 2] }
  ];
  buffCir: Array<Circle> = [];

  onStep() {
    this.work = getMoreWork(this.work, this.arrCir, this.maxBend);
    console.log(`new work: ${this.work.length}`);
  }
  onReset() {
    console.log("Circles::onReset");
    this.arrCir = [];
    this.appClassic.forEach(ele => {
      this.arrCir.push(ele);
    });
    this.work = [];
    this.classWork.forEach(ele => {
      this.work.push(ele);
    });
  }
  onPrint() {
    return;
  }
  animNext(): void {
    setTimeout(() => {
      if (this.buffCir.length > 0) {
        const tmp = this.buffCir.shift();
        if (tmp) {
          this.arrCir.push(tmp);
          this.animNext();
        }
      }
    }, 300);
  }
  onAnimate() {
    this.onReset();
    this.buffCir = [];
    this.appClassic.forEach(ele => {
      this.buffCir.push(ele);
    });
    this.arrCir = [];
    while (this.work.length > 0) {
      console.log("getWork");
      this.work = getMoreWork(this.work, this.buffCir, this.maxBend);
    }
    this.animNext();
    return;
  }
  onAll() {
    while (this.work.length > 0) {
      this.work = getMoreWork(this.work, this.arrCir, this.maxBend);
    }
  }

  // in chrome the viewBox is an SVGAnimatedRect. That can be altered
  // want a way to adjust the starting circle setup.
  // the starting circles need to include lines
  // sometime want to embed packing inside some arbitrary circle (think fractal like)
  // animated progression? printing?

  get maxBend(): number {
    // no point in getting circles smaller than what we can discern on the screen
    //console.log(`bend check: ${c.b * this.strokeWid * 2}`);
    //return true;
    return 1 / (this.strokeWid * 2);
  }
  get vwBox() {
    return `${this.upLeft} ${this.upLeft} ${this.sqSize} ${this.sqSize}`;
  }
  get strokeWid() {
    return this.sqSize / this.svgWid;
  }
}
</script>

<style scoped>
svg circle {
  fill: none;
  stroke: #000;
}
</style>
