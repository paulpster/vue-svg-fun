<template>
  <svg
    v-bind:id="svgid"
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

/*
    // the keydown events do not seem to fire on the SVG element
    v-on:keydown.ctrl="onCtrl"
    v-on:keydown.shift="onShift"
    v-on:keydown.alt="onAlt"
    v-on:keyup.ctrl="onCtrlUp"
    v-on:keyup.shift="onShiftUp"
    v-on:keyup.alt="onAltUp"

    v-on:wheel="onWheel"
    v-on:mousedown="onPanStart"
    v-on:mouseup="onPanEnd"
    v-on:mousemove="onPan"
*/
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
  @Prop({ default: "" }) readonly svgid!: string;
  @Prop() param!: SVGConfig;
  // I want conditional application of the event handlers.
  @Prop({ default: false }) readonly bZoom!: boolean;
  @Prop({ default: false }) readonly bPan!: boolean;
  panStartX = 0;
  panStartY = 0;
  bPanning = false;
  bCtrl = false;
  bShift = false;
  bAlt = false;

  // use wheel event for zooming, I will want to know what the cursor position is.
  onWheel(evt: WheelEvent): void {
    // my event coordinate evt.clientX, evt.clientY.
    // evt.deltaY is the only thing that changes push the wheel up is negative, pull down is positive
    // pull will be shrink, push will be grow (this is how it works on a chrome web page)

    if (this.bShift) {
      // go up-down
      this.$emit("on-pan", {
        dx: 0,
        dy:
          evt.deltaY > 0
            ? -0.05 * this.param.vwHeight
            : 0.05 * this.param.vwHeight
      });
    }
    if (this.bCtrl) {
      // go left-right
      this.$emit("on-pan", {
        dx:
          evt.deltaY > 0
            ? -0.05 * this.param.vwWidth
            : 0.05 * this.param.vwWidth,
        dy: 0
      });
    }
    //console.log(`Wheel: ${evt.clientX}, ${evt.clientY} ${evt.deltaY}`);
    // testing has determined that c is the <svg> element
    const c: SVGSVGElement = evt.currentTarget as SVGSVGElement;
    if (c) {
      const ctm = c.getScreenCTM();
      if (ctm) {
        //console.log(`CTM ${ctm.a} ${ctm.d} ${ctm.e} ${ctm.f}`);
        // i think i need to take into account the current location of the element....
        const offsX = (evt.clientX - ctm.e) / ctm.a;
        const offsY = (evt.clientY - ctm.f) / ctm.d;

        // this is the 'no key pressed' version of things
        this.$emit("on-zoom", { x: offsX, y: offsY, bIn: evt.deltaY < 0 });
      }
    }
    return;
  }

  onPanStart(evt: MouseEvent): void {
    evt.preventDefault();
    const c: SVGSVGElement = evt.currentTarget as SVGSVGElement;
    if (c) {
      const ctm = c.getScreenCTM();
      if (ctm) {
        console.log("onPanStart");
        this.panStartX = (evt.clientX - ctm.e) / ctm.a;
        this.panStartY = (evt.clientY - ctm.f) / ctm.d;
        this.bPanning = true;
      }
    }
    return;
  }
  onPan(evt: MouseEvent): void {
    if (this.bPanning) {
      evt.preventDefault();
      const c: SVGSVGElement = evt.currentTarget as SVGSVGElement;
      if (c) {
        const ctm = c.getScreenCTM();
        if (ctm) {
          const locX = (evt.clientX - ctm.e) / ctm.a;
          const locY = (evt.clientY - ctm.f) / ctm.d;
          this.$emit("on-pan", this.panStartX - locX, this.panStartY - locY);
        }
      }
    }
    return;
  }
  onPanEnd(evt: MouseEvent): void {
    console.log("onPanEnd");
    evt.preventDefault();
    this.bPanning = false;
    return;
  }

  onKeyDown(evt: KeyboardEvent): void {
    console.log(`onKeyDown: ${evt.code}`);
    return;
  }

  // these could be inlined some time, if they do not grow...
  onCtrl(): void {
    console.log("onCtrl");
    this.bCtrl = true;
    return;
  }
  onShift(): void {
    this.bShift = true;
    return;
  }
  onAlt(): void {
    this.bAlt = true;
    return;
  }
  onCtrlUp(): void {
    console.log("onCtrlUp");
    this.bCtrl = false;
    return;
  }
  onShiftUp(): void {
    this.bShift = false;
    return;
  }
  onAltUp(): void {
    this.bAlt = false;
    return;
  }
  //////////////////////////////////////////
  // lifecycle things....
  beforeMount() {
    // i think there should be a mor vue'ish way to get this done
    // this.$on? a conditional ref?
    console.log(`SVGComponent::beforeMount ${this.bZoom} ${this.bPan}`);
  }
  mounted() {
    //console.log("SVGComponent::mounted");
    if (this.svgid.length > 0 && (this.bPan || this.bZoom)) {
      const svg: HTMLElement | null = document.getElementById(this.svgid);
      if (svg && this.bZoom) {
        svg.addEventListener("wheel", this.onWheel);
      }
      if (svg && this.bPan) {
        svg.addEventListener("mousedown", this.onPanStart);
        svg.addEventListener("mouseup", this.onPanEnd);
        svg.addEventListener("mousemove", this.onPan);
      }
    }
  }
  beforeDestroy() {
    //console.log("SVGComponent::beforeDestroy");
  }

  /////////////////////////////
  // computed
  get vwBox(): string {
    return `${this.param.vwLeft} ${this.param.vwTop} ${this.param.vwWidth} ${this.param.vwHeight}`;
  }
}
</script>
