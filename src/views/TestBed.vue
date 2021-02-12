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
          <circle cx="0" cy="0" r="1" v-bind:stroke-width="strokeWid" />
          <circle
            class="mark"
            v-bind:cx="cirLX"
            v-bind:cy="cirLY"
            v-bind:r="2 * strokeWid"
            v-bind:stroke-width="strokeWid"
          />
          <circle
            class="mark"
            v-bind:cx="cirRX"
            v-bind:cy="cirRY"
            v-bind:r="2 * strokeWid"
            v-bind:stroke-width="strokeWid"
          />
          <line
            v-bind:x1="cirLX"
            v-bind:y1="cirLY"
            v-bind:x2="cirRX"
            v-bind:y2="cirRY"
            v-bind:stroke-width="strokeWid"
          />
          <circle
            v-bind:cx="cirRX"
            v-bind:cy="cirRY"
            v-bind:r="cirRR"
            v-bind:stroke-width="strokeWid"
          />
          <circle
            v-bind:cx="cirLX"
            v-bind:cy="cirLY"
            v-bind:r="cirLR"
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
              v-bind:cx="cirRX"
              v-bind:cy="cirRY"
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
import { getOffAxisCircle } from "@/utils/apollonius";

// i would like to have a resizeable SVG component
//  zoom and panning would be nice

@Component({ components: {} })
export default class TestBed extends Vue {
  svgWid = 700;
  svgHgt = 700;
  upLeft = -1.01;
  sqSize = -2 * this.upLeft;

  cirLX = -0.5;
  cirLY = 0;
  cirLR = 0.5;
  cirRX = 0.5;
  cirRY = 0;
  cirRR = 0.5;

  hndX = 0;
  hndY = 0;
  angX = 0.5;
  angY = 0;

  dragging: SVGGElement | null = null;
  dragAngle: SVGGElement | null = null;
  doffsX = 0;
  doffsY = 0;
  aoffsX = 0;
  aoffsY = 0;

  onDragStart(ev: MouseEvent) {
    console.log("onDragStart");
    // the target is an element, i guess i need to cast target into the type i want
    if (ev.target) {
      const c: SVGGElement = ev.currentTarget as SVGGElement;
      if (c.classList.contains("svgdrag")) {
        this.dragging = c;
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
      //const c: SVGGElement = ev.currentTarget as SVGGElement;
      //const ctm = c.getScreenCTM();
      //if (ctm) {
      //  console.log(`CTM ${ctm.a} ${ctm.d} ${ctm.e} ${ctm.f}`);
      //} else {
      //  console.log("no CTM");
      //}
    }
    if (ev.target && this.dragAngle) {
      this.dragAngle = null;
      console.log("onDragEnd");
      console.log(`Curr: ${this.angX} ${this.angY}`);
    }
    return;
  }
  onDrag(ev: MouseEvent) {
    if (this.dragging && ev.currentTarget) {
      //console.log("onDrag");
      ev.preventDefault();
      const c: SVGGElement = ev.currentTarget as SVGGElement;
      // in my case the CTM does not seem to change with element position
      const ctm = c.getScreenCTM();
      if (ctm) {
        //this.hndX = this.doffsX + (ev.clientX - ctm.e) / ctm.a;
        //this.hndY = this.doffsY + (ev.clientY - ctm.f) / ctm.d;
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
        const ctm = c.getScreenCTM();
        if (ctm) {
          console.log(`CTM ${ctm.a} ${ctm.d} ${ctm.e} ${ctm.f}`);
          // i think i need to take into account the current location of the element....
          this.aoffsX = this.angX - (ev.clientX - ctm.e) / ctm.a;
          this.aoffsY = this.angY - (ev.clientY - ctm.f) / ctm.d;
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
      console.log(`Curr: ${this.angX} ${this.angY}`);
      //const c: SVGGElement = ev.currentTarget as SVGGElement;
      //const ctm = c.getScreenCTM();
      //if (ctm) {
      //  console.log(`CTM ${ctm.a} ${ctm.d} ${ctm.e} ${ctm.f}`);
      //} else {
      //  console.log("no CTM");
      //}
    }
    return;
  }
  onDragAngle(ev: MouseEvent) {
    if (this.dragAngle && ev.currentTarget) {
      //console.log("onDrag");
      ev.preventDefault();
      const c: SVGGElement = ev.currentTarget as SVGGElement;
      // in my case the CTM does not seem to change with element position
      const ctm = c.getScreenCTM();
      if (ctm) {
        //this.hndX = this.doffsX + (ev.clientX - ctm.e) / ctm.a;
        //this.hndY = this.doffsY + (ev.clientY - ctm.f) / ctm.d;
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
  onDrop() {
    console.log("onDrop");
    return;
  }
  onDragOver() {
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
      (curX - this.cirLX) * (curX - this.cirLX) +
        (curY - this.cirLY) * (curY - this.cirLY)
    );
    if (dist < 0.1) {
      dist = 0.1;
    }
    if (dist > 0.9) {
      dist = 0.9;
    }
    this.cirLR = dist;
    this.cirLX = this.cirLR - 1;
    this.onAngleDrag(this.cirRX, this.cirRY);
  }
  onAngleDrag(curX: number, curY: number): void {
    const slope = (this.cirLY - curY) / (this.cirLX - curX);

    // limit the angle....
    if (Math.abs(slope) > 10) {
      curX = this.cirLX - (this.cirLY - curY) / 10;
    }
    const result = getOffAxisCircle(
      { x: this.cirLX, y: this.cirLY, b: 1 / this.cirLR },
      { x: curX, y: curY, b: 0 }
    );
    this.cirRX = result.x;
    this.cirRY = result.y;
    this.cirRR = 1 / result.b;
    this.hndX =
      this.cirLX +
      (this.cirLR * (this.cirRX - this.cirLX)) / (this.cirLR + this.cirRR);
    this.hndY =
      this.cirLY +
      (this.cirLR * (this.cirRY - this.cirLY)) / (this.cirLR + this.cirRR);
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
