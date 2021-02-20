<template>
  <div>
    <h2>Test Bed</h2>
    <div style="display:flex;">
      <div>
        <SVGComponent v-bind:param="SVGParam">
          <circle
            v-for="(c, idx) in arrCir"
            v-bind:key="idx"
            v-bind:cx="c.x"
            v-bind:cy="c.y"
            v-bind:r="Math.abs(1 / c.b)"
            v-bind:stroke-width="strokeWid"
          />

          <!-- stuff to help DND configs visually, needs to disappear when not adjustment time -->
          <circle
            class="mark"
            v-bind:cx="arrCir[2].x"
            v-bind:cy="arrCir[2].y"
            v-bind:r="2 * strokeWid"
            v-bind:stroke-width="strokeWid"
          />
          <circle
            class="mark"
            v-bind:cx="arrCir[1].x"
            v-bind:cy="arrCir[1].y"
            v-bind:r="2 * strokeWid"
            v-bind:stroke-width="strokeWid"
          />
          <line
            v-bind:x1="arrCir[2].x"
            v-bind:y1="arrCir[2].y"
            v-bind:x2="arrCir[1].x"
            v-bind:y2="arrCir[1].y"
            v-bind:stroke-width="strokeWid"
          />

          <SVGDrag
            name="size"
            v-on:on-begin-drag="onStart"
            v-on:on-drop="onDrop"
            v-on:on-dragging="onSzDrag"
          >
            <circle
              class="handle"
              v-bind:cx="hndX"
              v-bind:cy="hndY"
              v-bind:r="5 * strokeWid"
              v-bind:stroke-width="strokeWid"
            />
          </SVGDrag>
          <SVGDrag
            name="angle"
            v-on:on-begin-drag="onStart"
            v-on:on-drop="onDrop"
            v-on:on-dragging="onAngleDrag"
          >
            <circle
              class="handle"
              v-bind:cx="arrCir[1].x"
              v-bind:cy="arrCir[1].y"
              v-bind:r="5 * strokeWid"
              v-bind:stroke-width="strokeWid"
            />
          </SVGDrag>
        </SVGComponent>
      </div>
    </div>
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
import SVGComponent, { SVGConfig } from "@/components/SVG.vue";
import SVGDrag from "@/components/SVGDrag.vue";
import { getOffAxisCircle, Circle, Work, newCircles } from "@/utils/apollonius";

// i would like to have a resizeable SVG component
//  zoom and panning would be nice
const MAX_SLOPE = 10;
const MAX_RADIUS = 0.9;
const MIN_RADIUS = 0.1;

@Component({ components: { SVGComponent, SVGDrag } })
export default class TestBed extends Vue {
  svgWid = 700;
  svgHgt = 700;
  upLeft = -1.01;
  sqSize = -2 * this.upLeft;

  hndX = 0;
  hndY = 0;

  dragging: SVGGElement | null = null;
  dragAngle: SVGGElement | null = null;
  doffsX = 0;
  doffsY = 0;
  aoffsX = 0;
  aoffsY = 0;

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

  onStart(): void {
    this.work = [];
    this.arrCir.pop();
    this.arrCir.pop();
  }
  onDrop(): void {
    console.log("onDrop");
    // the end of all dragging
    const ret = newCircles(this.arrCir[0], this.arrCir[1], this.arrCir[2]);
    // there is probably a 'clean code' way of doing this.
    this.arrCir.push(ret[0]);
    this.arrCir.push(ret[1]);
    this.work = [
      { cir: 3, depth: 1, parents: [0, 1, 2] },
      { cir: 4, depth: 1, parents: [0, 1, 2] }
    ];

    return;
  }
  onDragOver(): void {
    console.log("onDragOver");
    // prevent default
    return;
  }
  onSzDrag(curX: number, curY: number): void {
    this.hndX = curX;
    this.hndY = curY;
    let xi = (curX * curX + curY * curY - 1) / (2 + 2 * curX);
    //console.log(`dist: ${xi} ${curX} ${curY}`);
    if (xi + 1 < MIN_RADIUS) {
      xi = MIN_RADIUS - 1;
    }
    if (xi + 1 > MAX_RADIUS) {
      xi = MAX_RADIUS - 1;
    }
    this.arrCir[2] = { x: xi, y: 0, b: 1 / (xi + 1) };

    //console.log(
    //  `onSzDrag: ${this.arrCir[2].x} ${this.arrCir[2].y} ${this.arrCir[2].b}`
    //);
    this.onAngleDrag(this.arrCir[1].x, this.arrCir[1].y);
  }
  onAngleDrag(curX: number, curY: number): void {
    const slope = (this.arrCir[2].y - curY) / (this.arrCir[2].x - curX);

    // limit the angle....
    if (Math.abs(slope) > MAX_SLOPE) {
      curX =
        this.arrCir[2].x -
        (this.arrCir[2].y - curY) / (Math.sign(slope) * MAX_SLOPE);
    }
    this.arrCir[1] = getOffAxisCircle(this.arrCir[2], {
      x: curX,
      y: curY,
      b: 0
    });

    // examine the math on this for simplifications (bend vs radius)
    // TODO: these should probably be get type functions
    this.hndX =
      this.arrCir[2].x +
      ((1 / this.arrCir[2].b) * (this.arrCir[1].x - this.arrCir[2].x)) /
        (1 / this.arrCir[2].b + 1 / this.arrCir[1].b);
    this.hndY =
      this.arrCir[2].y +
      ((1 / this.arrCir[2].b) * (this.arrCir[1].y - this.arrCir[2].y)) /
        (1 / this.arrCir[2].b + 1 / this.arrCir[1].b);
    //console.log(`onAngleDrag ${this.hndX} ${this.hndY}`);
  }

  // computed
  get strokeWid() {
    return this.sqSize / this.svgWid;
  }
  get SVGParam(): SVGConfig {
    return {
      svgHgt: this.svgHgt,
      svgWid: this.svgWid,
      vwTop: this.upLeft,
      vwLeft: this.upLeft,
      vwWidth: this.sqSize,
      vwHeight: this.sqSize
    };
  }
}
</script>

<style scoped>
svg circle {
  fill: none;
  stroke: #000;
}
svg line {
  stroke: #000;
}
svg .handle {
  fill: red;
  stroke: red;
}
svg .mark {
  fill: black;
  stroke: black;
}
.svgdrag {
  cursor: move;
}
</style>
