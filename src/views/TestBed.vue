<template>
  <div>
    <h2>Test Bed</h2>
    <div style="display:flex;">
      <div>
        <svg
          id="mysvg"
          xmlns="http://www.w3.org/2000/svg"
          v-bind:width="svgWid"
          v-bind:height="svgHgt"
          v-bind:viewBox="vwBox"
          v-on:mouseleave="onDragEnd"
          v-on:mouseup="onDragEnd"
          v-on:mousemove="onDrag"
        >
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

          <g
            class="svgdrag"
            v-on:mousedown="onDragStart"
            v-on:mouseup="onDragEnd"
            v-on:mousemove="onDrag"
          >
            <circle
              class="handle"
              v-bind:cx="hndX"
              v-bind:cy="hndY"
              v-bind:r="5 * strokeWid"
              v-bind:stroke-width="strokeWid"
            />
          </g>
          <g
            class="svgdrag"
            v-on:mousedown="onDragStartAngle"
            v-on:mouseup="onDragEndAngle"
            v-on:mousemove="onDragAngle"
          >
            <circle
              class="handle"
              v-bind:cx="arrCir[1].x"
              v-bind:cy="arrCir[1].y"
              v-bind:r="5 * strokeWid"
              v-bind:stroke-width="strokeWid"
            />
          </g>
        </svg>
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
import { getOffAxisCircle, Circle, Work, newCircles } from "@/utils/apollonius";

// i would like to have a resizeable SVG component
//  zoom and panning would be nice

@Component({ components: {} })
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

  onDragStart(ev: MouseEvent): void {
    console.log("onDragStart");
    // the target is an element, i guess i need to cast target into the type i want
    if (ev.target) {
      const c: SVGGElement = ev.currentTarget as SVGGElement;
      if (c.classList.contains("svgdrag")) {
        this.dragging = c;
        // drag begin stuff
        this.onStart();

        const ctm = c.getScreenCTM();
        if (ctm) {
          console.log(`CTM ${ctm.a} ${ctm.d} ${ctm.e} ${ctm.f}`);
          // i think i need to take into account the current location of the element....
          this.doffsX = this.hndX - (ev.clientX - ctm.e) / ctm.a;
          this.doffsY = this.hndY - (ev.clientY - ctm.f) / ctm.d;
          console.log(`Init Grab: ${this.doffsX} ${this.doffsY}`);
        } else {
          console.log("no CTM");
        }
      }
    }
  }
  onDragEnd(ev: MouseEvent): void {
    if (ev.target && this.dragging) {
      this.dragging = null;
      console.log("onDragEnd");
      console.log(`Curr: ${this.hndX} ${this.hndY}`);
      this.onDrop();
    }
    if (ev.target && this.dragAngle) {
      this.dragAngle = null;
      console.log("onDragAngleEnd");
      console.log(`DEACurr: ${this.arrCir[1].x} ${this.arrCir[1].y}`);
      this.onDrop();
    }
    return;
  }
  onDrag(ev: MouseEvent): void {
    if (this.dragging && ev.currentTarget) {
      ev.preventDefault();
      const c: SVGGElement = ev.currentTarget as SVGGElement;
      // in my case the CTM does not seem to change with element position
      const ctm = c.getScreenCTM();
      if (ctm) {
        // really want a call back of some kind where i give it where the pointer is
        //    and i get returned where i want the resulting SVG coord to be.
        //    This will allow me to contrain movements to a line or box or arc or...
        this.onSzDrag(
          this.doffsX + (ev.clientX - ctm.e) / ctm.a,
          this.doffsY + (ev.clientY - ctm.f) / ctm.d
        );
      }
    }
    if (this.dragAngle && ev.currentTarget) {
      this.onDragAngle(ev);
    }
    return;
  }
  onDragStartAngle(ev: MouseEvent) {
    console.log("onDragStart");
    // the target is an element, i guess i need to cast target into the type i want
    if (ev.target) {
      const c: SVGGElement = ev.currentTarget as SVGGElement;
      if (c.classList.contains("svgdrag")) {
        this.dragAngle = c;
        // drag begin stuff
        this.onStart();

        const ctm = c.getScreenCTM();
        if (ctm) {
          //console.log(`CTM ${ctm.a} ${ctm.d} ${ctm.e} ${ctm.f}`);
          // i think i need to take into account the current location of the element....
          this.aoffsX = this.arrCir[1].x - (ev.clientX - ctm.e) / ctm.a;
          this.aoffsY = this.arrCir[1].y - (ev.clientY - ctm.f) / ctm.d;
          console.log(`Init Angle Grab: ${this.aoffsX} ${this.aoffsY}`);
        } else {
          console.log("no CTM");
        }
      }
    }
  }
  onDragEndAngle(ev: MouseEvent): void {
    if (ev.target && this.dragging) {
      this.dragAngle = null;
      console.log("onDragEndAngle");
      console.log(`ACurr: ${this.arrCir[1].x} ${this.arrCir[1].y}`);
      this.onDrop();
    }
    return;
  }
  onDragAngle(ev: MouseEvent): void {
    if (this.dragAngle && ev.currentTarget) {
      ev.preventDefault();
      const c: SVGGElement = ev.currentTarget as SVGGElement;
      // in my case the CTM does not seem to change with element position
      const ctm = c.getScreenCTM();
      if (ctm) {
        // really want a call back of some kind where i give it where the pointer is
        //    and i get returned where i want the resulting SVG coord to be.
        //    This will allow me to contrain movements to a line or box or arc or...
        this.onAngleDrag(
          this.aoffsX + (ev.clientX - ctm.e) / ctm.a,
          this.aoffsY + (ev.clientY - ctm.f) / ctm.d
        );
      }
    }
    return;
  }
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
    /*
    // this works ONLY if both circles are on the X-axis
    //  off axis is more difficult
    //need a min and max size for the left hand circle
    this.hndX = curX;
    // -1 is the left edge of the outer circle.
    this.cirLX = -1 + (curX + 1) / 2;
    this.cirLR = (curX + 1) / 2;
    // 1 is the right edge of the outer circle
    this.cirRX = 1 - (1 - curX) / 2;
    this.cirRR = (1 - curX) / 2;
    */
    let dist = Math.sqrt(
      (curX - this.arrCir[2].x) * (curX - this.arrCir[2].x) +
        (curY - this.arrCir[2].y) * (curY - this.arrCir[2].y)
    );
    if (dist < 0.1) {
      dist = 0.1;
    }
    if (dist > 0.9) {
      dist = 0.9;
    }
    this.arrCir[2].b = 1 / dist;
    this.arrCir[2].x = dist - 1;
    this.onAngleDrag(this.arrCir[1].x, this.arrCir[1].y);
  }
  onAngleDrag(curX: number, curY: number): void {
    const slope = (this.arrCir[2].y - curY) / (this.arrCir[2].x - curX);

    // limit the angle....
    if (Math.abs(slope) > 10) {
      curX =
        this.arrCir[2].x - (this.arrCir[2].y - curY) / (Math.sign(slope) * 10);
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
  }

  // computed
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
