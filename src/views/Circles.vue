<template>
  <div>
    <h2>Apollonian Circle Packing</h2>
    <div>
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
          <g v-if="showGeomCtrl">
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
          </g>
        </SVGComponent>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import SVGComponent, { SVGConfig } from "@/components/SVG.vue";
import SVGDrag from "@/components/SVGDrag.vue";
import {
  Work,
  Circle,
  getMoreWork,
  getOffAxisCircle,
  newCircles
} from "@/utils/apollonius";

const MAX_SLOPE = 10;
const MAX_RADIUS = 0.9;
const MIN_RADIUS = 0.1;

@Component({ components: { SVGComponent, SVGDrag } })
export default class Circles extends Vue {
  // I like things square (at least for now)
  svgWid = 700;
  svgHgt = 700;
  upLeft = -1.01;
  sqSize = -2 * this.upLeft;
  amConfiguring = true;
  bAnimate = false;

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

  ///////////////////////////////////
  // drag and drop control things
  hndX = 0;
  hndY = 0;

  //
  ///////////////////////////////////

  //////////////////////////////////////////
  // Control
  onStep() {
    this.amConfiguring = false;
    this.work = getMoreWork(this.work, this.arrCir, this.maxBend);
    console.log(`new work: ${this.work.length}`);
  }
  onReset() {
    console.log("Circles::onReset");
    this.bAnimate = false;
    this.amConfiguring = true;
    this.arrCir = [];
    this.appClassic.forEach(ele => {
      this.arrCir.push(ele);
    });
    this.work = [];
    this.classWork.forEach(ele => {
      this.work.push(ele);
    });
    this.hndX = 0;
    this.hndY = 0;
  }
  onPrint() {
    // some day I would like to alter things so that I take advantage of the printer resolution...
    this.amConfiguring = false;
    window.print();
    return;
  }
  animNext(): void {
    setTimeout(() => {
      if (this.buffCir.length > 0 && this.bAnimate) {
        const tmp = this.buffCir.shift();
        if (tmp) {
          this.arrCir.push(tmp);
          this.animNext();
        }
      }
    }, 300);
  }
  onAnimate() {
    //this.onReset();
    this.amConfiguring = false;
    this.bAnimate = true;

    // need to do this with the current configurations
    this.buffCir = [];
    this.arrCir.forEach(ele => {
      this.buffCir.push(ele);
    });
    this.arrCir = [];
    while (this.work.length > 0) {
      console.log("getWork");
      this.work = getMoreWork(this.work, this.buffCir, this.maxBend);
    }
    // this.buffCir is loaded, could sort according to size or position or....
    this.animNext();
    return;
  }
  onAll() {
    this.amConfiguring = false;
    while (this.work.length > 0) {
      this.work = getMoreWork(this.work, this.arrCir, this.maxBend);
    }
  }
  //
  ///////////////////////////////////////////////

  ///////////////////////////////////////////////
  // geometry
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
  onSzDrag(curX: number, curY: number): void {
    // this seems redundant since it is recalculated in onAngleDrag,
    //    but the drag is much smoother with it.
    this.hndX = curX;
    this.hndY = curY;
    // the distance from curX, curY to arrCir[2] center
    // is equal to arrCir[2] center to -1, 0
    let xi = (curX * curX + curY * curY - 1) / (2 + 2 * curX);
    if (xi + 1 < MIN_RADIUS) {
      xi = MIN_RADIUS - 1;
    }
    if (xi + 1 > MAX_RADIUS) {
      xi = MAX_RADIUS - 1;
    }
    this.arrCir[2] = { x: xi, y: 0, b: 1 / (xi + 1) };

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
    //    This method seems better when dragging
    this.hndX =
      this.arrCir[2].x +
      ((1 / this.arrCir[2].b) * (this.arrCir[1].x - this.arrCir[2].x)) /
        (1 / this.arrCir[2].b + 1 / this.arrCir[1].b);
    this.hndY =
      this.arrCir[2].y +
      ((1 / this.arrCir[2].b) * (this.arrCir[1].y - this.arrCir[2].y)) /
        (1 / this.arrCir[2].b + 1 / this.arrCir[1].b);
  }
  //
  ///////////////////////////////////////////////

  // in chrome the viewBox is an SVGAnimatedRect. That can be altered
  // want a way to adjust the starting circle setup.
  // the starting circles need to include lines
  // sometime want to embed packing inside some arbitrary circle (think fractal like)
  // animated progression? printing?

  get showGeomCtrl(): boolean {
    return this.amConfiguring;
  }
  /*  get hndX(): number {
    return (
      this.arrCir[2].x +
      ((1 / this.arrCir[2].b) * (this.arrCir[1].x - this.arrCir[2].x)) /
        (1 / this.arrCir[2].b + 1 / this.arrCir[1].b)
    );
  }
  get hndY(): number {
    return (
      this.arrCir[2].y +
      ((1 / this.arrCir[2].b) * (this.arrCir[1].y - this.arrCir[2].y)) /
        (1 / this.arrCir[2].b + 1 / this.arrCir[1].b)
    );
  }*/
  get maxBend(): number {
    // no point in getting circles smaller than what we can discern on the screen
    //console.log(`bend check: ${c.b * this.strokeWid * 2}`);
    //return true;
    return 1 / (this.strokeWid * 2);
  }
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
