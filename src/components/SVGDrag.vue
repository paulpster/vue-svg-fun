<template>
  <g
    v-bind:id="name"
    class="svgdrag"
    v-on:mousedown="onDragStart"
    v-on:mouseup="onDragEnd"
    v-on:mousemove="onDrag"
  >
    <slot></slot>
  </g>
</template>

<script lang="ts">
import { Vue, Prop, Component } from "vue-property-decorator";

// want a generic SVG dragger.
// I will need to hook into the parent SVG element to add and remove some event listeners
// perhaps wish to add a drag over concept at some point.
//
// events:
//    on-begin-drag: element offset (svg coord)
//    on-drop
//    on-dragging: svg location

// @Component is needed to use the lifecycle hooks. makes sense, afterall this IS
//    a component
@Component({})
export default class SVGDrag extends Vue {
  @Prop() name!: string;
  amDragging = false;
  offsX = 0;
  offsY = 0;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onDragStart(ev: MouseEvent): void {
    if (ev.target) {
      ev.preventDefault();
      const c: SVGGElement = ev.currentTarget as SVGGElement;
      if (c.classList.contains("svgdrag")) {
        this.amDragging = true;

        const ctm = c.getScreenCTM();
        if (ctm) {
          //console.log(`CTM ${ctm.a} ${ctm.d} ${ctm.e} ${ctm.f}`);
          // i think i need to take into account the current location of the element....
          this.offsX = (ev.clientX - ctm.e) / ctm.a;
          this.offsY = (ev.clientY - ctm.f) / ctm.d;
        }
        console.log(
          `SVGDrag::onDragStart ${this.name} ${this.offsX}, ${this.offsY}`
        );
        // drag begin stuff
        // this is the offset on the clicked element, what is the position on the canvas?
        this.$emit("on-begin-drag", this.offsX, this.offsY);
      }
    }
    return;
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onDragEnd(ev: MouseEvent): void {
    if (this.amDragging && ev.target) {
      console.log(`SVGDrag::onDragEnd ${this.name}`);
      ev.preventDefault();
      this.amDragging = false;
      this.$emit("on-drop");
    }
    return;
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onDrag(ev: MouseEvent): void {
    if (this.amDragging && ev.target) {
      ev.preventDefault;
      //console.log(`SVGDrag::onDrag ${this.name}`);
      const c: SVGGElement = ev.currentTarget as SVGGElement;
      // in my case the CTM does not seem to change with element position
      const ctm = c.getScreenCTM();
      if (ctm) {
        // really want a call back of some kind where i give it where the pointer is
        //    and i get returned where i want the resulting SVG coord to be.
        //    This will allow me to constrain movements to a line or box or arc or...
        this.$emit(
          "on-dragging",
          (ev.clientX - ctm.e) / ctm.a /*- this.offsX*/,
          (ev.clientY - ctm.f) / ctm.d //- this.offsY
        );
      }
    }
    return;
  }
  // these parental could possibly go away, but I don't know yet if there
  //    might be a good use for them to be separate
  onParentMouseMove(ev: MouseEvent): void {
    if (this.amDragging) {
      //console.log(`SVGDrag::onParentMouseMove ${this.name}`);
      this.onDrag(ev);
    }
    return;
  }
  onParentMouseUp(ev: MouseEvent): void {
    if (this.amDragging) {
      console.log(`SVGDrag::onParentMouseUp ${this.name}`);
      this.onDragEnd(ev);
    }
    return;
  }
  onParentMouseLeave(ev: MouseEvent): void {
    if (this.amDragging) {
      console.log(`SVGDrag::onParentMouseLeave ${this.name}`);
      this.onDragEnd(ev);
    }
    return;
  }

  //////////////////////////////////////////
  // lifecycle things....
  mounted() {
    const myself = this.$el as SVGGElement;

    if (myself.ownerSVGElement) {
      myself.ownerSVGElement.addEventListener(
        "mousemove",
        this.onParentMouseMove
      );
      myself.ownerSVGElement.addEventListener("mouseup", this.onParentMouseUp);
      myself.ownerSVGElement.addEventListener(
        "mouseleave",
        this.onParentMouseLeave
      );
    }
    //console.log(`SVGDrag::mounted ${this.name}`);
  }
  beforeDestroy() {
    const myself = this.$el as SVGGElement;

    if (myself.ownerSVGElement) {
      myself.ownerSVGElement.removeEventListener(
        "mousemove",
        this.onParentMouseMove
      );
      myself.ownerSVGElement.removeEventListener(
        "mouseup",
        this.onParentMouseUp
      );
      myself.ownerSVGElement.removeEventListener(
        "mouseleave",
        this.onParentMouseLeave
      );
    }
    console.log(`SVGDrag::beforeDestroy ${this.name}`);
  }
}
</script>

<style scoped>
.svgdrag {
  cursor: move;
}
</style>
