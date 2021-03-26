<template>
  <ContentLayout>
    <template v-slot:title>
      <h2>Regular Grids</h2>
    </template>
    <div class="gridcont">
      <!-- I could use a LinearGrid here. I chose not to so i would not need to 
          relay events to this level. -->
      <SVGComponent
        v-bind:param="SVGParam"
        bZoom="true"
        bPan="true"
        svgid="gridsvg"
        v-on:on-zoom="onZoom"
        v-on:on-pan="onPan"
      >
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
    <template v-slot:side>
      <button v-on:click="onPrint">Print</button><br />
      <button
        v-for="key in gridList"
        v-bind:key="key"
        v-on:click="onChgGrid(key)"
        class="gridbtn"
      >
        <LinearGrid v-bind:svgparam="btnSVG(key)" v-bind:gridname="key" />
      </button>
    </template>
  </ContentLayout>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import ContentLayout from "@/components/ContentLayout.vue";
import SVGComponent, { SVGConfig } from "@/components/SVG.vue";
import LinearGrid from "@/components/LinearGrid.vue";
import { Line, Grid, gridList, Extent } from "@/utils/GridBasics";

@Component({ components: { SVGComponent, ContentLayout, LinearGrid } })
export default class RegularGrids extends Vue {
  vwTop = -2;
  vwLft = -2;
  vwHgt = 12;
  vwWid = 12;
  svgWid = 700;
  svgHgt = 700;

  // seems dumb
  gridList = Object.keys(gridList);
  currentGrid: Grid = gridList["Hex"];
  // need to have some smarts with each cell definition so that
  //    each cell def knows something about how to draw itself

  onPrint(): void {
    return;
  }
  onChgGrid(gridName: keyof typeof gridList): void {
    this.currentGrid = gridList[gridName];
  }

  onZoom(data: { x: number; y: number; bIn: boolean }): void {
    //console.log(`onZoom ${data.x},${data.y} ${data.bIn}`);
    let zm = 1.1;
    if (data.bIn) {
      zm = 0.9;
    }
    // this zooms in centered on data.x, data.y
    this.vwTop = data.y - (data.y - this.vwTop) * zm;
    this.vwLft = data.x - (data.x - this.vwLft) * zm;

    this.vwHgt = this.vwHgt * zm;
    this.vwWid = this.vwWid * zm;
    return;
  }
  onPan(dx: number, dy: number): void {
    //console.log(`Grids::onPan ${dx} ${dy}`);
    this.vwTop += dy;
    this.vwLft += dx;
    return;
  }

  ///////////////////////////////////////////////////////////////
  // cell definitions, they should go into another file
  //    this file is large with them in it.
  cellSH: Array<Line> = [
    { x1: -0.5, y1: 0.0, x2: 1, y2: 0 },
    { x1: -0.5, y1: 0.866, x2: 0.5, y2: 0.866 },
    { x1: -1.0, y1: 0, x2: -0.25, y2: 1.2991 },
    { x1: 0.75, y1: 0.433, x2: 0, y2: 1.7321 },
    { x1: 0.0, y1: 0, x2: -0.5, y2: 0.866 },
    { x1: 0.0, y1: 0, x2: 0.5, y2: 0.866 }
  ];
  cellSSq: Array<Line> = [
    { x1: 0, y1: -0.5, x2: 0, y2: 0.5 },
    { x1: -1, y1: 0.5, x2: -1.0, y2: 0 },
    { x1: 1, y1: -0.5, x2: 1.0, y2: 0 },
    { x1: -1.0, y1: -0.5, x2: 1.0, y2: -0.5 },
    { x1: -1.0, y1: 0.5, x2: 1.0, y2: 0.5 },
    { x1: -1.0, y1: 0.5, x2: -0.5, y2: 1.3661 },
    { x1: 1, y1: 0.5, x2: 0.5, y2: 1.3661 },
    { x1: 0, y1: 1.3661, x2: 0.5, y2: 1.3661 },
    { x1: 0, y1: 0.5, x2: 0.5, y2: 1.3661 },
    { x1: 0, y1: 0.5, x2: -0.5, y2: 1.3661 },
    { x1: -1.0, y1: -0.5, x2: -0.5, y2: -1.3661 },
    { x1: 1, y1: -0.5, x2: 0.5, y2: -1.3661 },
    { x1: -0.5, y1: -1.3661, x2: 0, y2: -1.3661 },
    { x1: 0, y1: -0.5, x2: 0.5, y2: -1.3661 },
    { x1: 0, y1: -0.5, x2: -0.5, y2: -1.3661 }
  ];
  cellSS: Array<Line> = [
    { x1: 0, y1: 0.5, x2: 0, y2: -0.5 },
    { x1: 0.866, y1: 0, x2: 0, y2: -0.5 },
    { x1: 0.866, y1: 0, x2: 0, y2: 0.5 },
    { x1: -0.866, y1: 0, x2: 0, y2: -0.5 },
    { x1: -0.866, y1: 0, x2: 0, y2: 0.5 }
  ];
  cellES: Array<Line> = [
    { x1: -0.5, y1: 0, x2: 0.5, y2: 0 },
    { x1: -0.5, y1: 1, x2: 0.5, y2: 1 },
    { x1: 0, y1: 0, x2: 0, y2: 1 },
    { x1: 0, y1: 1.0, x2: -0.5, y2: 1.866 },
    { x1: 0, y1: 1.0, x2: 0.5, y2: 1.866 }
  ];
  cellDodecSq2: Array<Line> = [
    { x1: 0.5, y1: 0.5, x2: -0.5, y2: 0.5 },
    { x1: -0.5, y1: 0.5, x2: -0.5, y2: -0.5 },
    { x1: -0.5, y1: -0.5, x2: 0.5, y2: -0.5 },
    { x1: 0.5, y1: -0.5, x2: 0.5, y2: 0.5 },
    { x1: 0.5, y1: 0.5, x2: 0, y2: 1.3661 },
    { x1: -0.5, y1: 0.5, x2: 0, y2: 1.3661 },
    { x1: 0.5, y1: -0.5, x2: 0, y2: -1.3661 },
    { x1: -0.5, y1: -0.5, x2: 0, y2: -1.3661 },
    { x1: 0.5, y1: 0.5, x2: 1.3661, y2: 1.0 },
    { x1: 0, y1: 1.3661, x2: 0.8661, y2: 1.8661 },
    { x1: 1.3661, y1: 1.0, x2: 0.8661, y2: 1.8661 },
    { x1: -0.5, y1: 0.5, x2: -1.3661, y2: 1.0 },
    { x1: 0, y1: 1.3661, x2: -0.8661, y2: 1.8661 },
    { x1: -1.3661, y1: 1.0, x2: -0.8661, y2: 1.8661 },
    { x1: 0.5, y1: -0.5, x2: 1.3661, y2: -1.0 },
    { x1: 0, y1: -1.3661, x2: 0.8661, y2: -1.8661 },
    { x1: 1.3661, y1: -1.0, x2: 0.8661, y2: -1.8661 },
    { x1: -0.5, y1: -0.5, x2: -1.3661, y2: -1.0 },
    { x1: 0.0, y1: -1.3661, x2: -0.8661, y2: -1.8661 },
    { x1: -1.3661, y1: -1.0, x2: -0.8661, y2: -1.8661 },
    { x1: 0.8661, y1: 1.8661, x2: 0.8661, y2: 2.3661 },
    { x1: -0.8661, y1: 1.8661, x2: -0.8661, y2: 2.3661 },
    { x1: 0.8661, y1: -1.8661, x2: 0.8661, y2: -2.3661 },
    { x1: -0.8661, y1: -1.8661, x2: -0.8661, y2: -2.3661 },
    { x1: 1.3661, y1: 1.0, x2: 2.2322, y2: 0.5 },
    { x1: 1.3661, y1: -1.0, x2: 2.2322, y2: -0.5 },
    { x1: 2.2322, y1: 0.5, x2: 2.2322, y2: -0.5 },
    { x1: -1.3661, y1: 1.0, x2: -2.2322, y2: 0.5 },
    { x1: -1.3661, y1: -1.0, x2: -2.2322, y2: -0.5 },
    { x1: -2.2322, y1: 0.5, x2: -2.2322, y2: -0.5 },
    { x1: 2.2322, y1: 0.5, x2: 2.7322, y2: 0.5 },
    { x1: 2.2322, y1: -0.5, x2: 2.7322, y2: -0.5 },
    { x1: -2.2322, y1: 0.5, x2: -2.7322, y2: 0.5 },
    { x1: -2.2322, y1: -0.5, x2: -2.7322, y2: -0.5 }
  ];
  cellDodecSq: Array<Line> = [
    { x1: 0.5, y1: 0.5, x2: -0.5, y2: 0.5 },
    { x1: -0.5, y1: 0.5, x2: -0.5, y2: -0.5 },
    { x1: -0.5, y1: -0.5, x2: 0.5, y2: -0.5 },
    { x1: 0.5, y1: -0.5, x2: 0.5, y2: 0.5 },
    { x1: 0.5, y1: 0.5, x2: 0, y2: 1.3661 },
    { x1: -0.5, y1: 0.5, x2: 0, y2: 1.3661 },
    { x1: 0.5, y1: -0.5, x2: 0, y2: -1.3661 },
    { x1: -0.5, y1: -0.5, x2: 0, y2: -1.3661 },
    { x1: 0.5, y1: 0.5, x2: 1.3661, y2: 0 },
    { x1: 0.5, y1: -0.5, x2: 1.3661, y2: 0 },
    { x1: -0.5, y1: 0.5, x2: -1.3661, y2: 0 },
    { x1: -0.5, y1: -0.5, x2: -1.3661, y2: 0 },
    { x1: 0.5, y1: 0.5, x2: 1.3661, y2: 1.0 },
    { x1: 0.0, y1: 1.3661, x2: 0.8661, y2: 1.8661 },
    { x1: 1.3661, y1: 1.0, x2: 0.8661, y2: 1.8661 },
    { x1: -0.5, y1: 0.5, x2: -1.0, y2: 1.3661 },
    { x1: -1.3661, y1: 0, x2: -1.8661, y2: 0.8661 },
    { x1: -1.0, y1: 1.3661, x2: -1.8661, y2: 0.8661 },
    { x1: -0.5, y1: -0.5, x2: -1.3661, y2: -1.0 },
    { x1: 0, y1: -1.3661, x2: -0.8661, y2: -1.8661 },
    { x1: -1.3661, y1: -1.0, x2: -0.8661, y2: -1.8661 },
    { x1: 0.5, y1: -0.5, x2: 1.0, y2: -1.3661 },
    { x1: 1.3661, y1: -0, x2: 1.8661, y2: -0.8661 },
    { x1: 1.0, y1: -1.3661, x2: 1.8661, y2: -0.8661 },
    { x1: 1.3661, y1: 0, x2: 1.3661, y2: 1 },
    { x1: 0, y1: 1.3661, x2: -1, y2: 1.3661 },
    { x1: -1.3661, y1: 0, x2: -1.3661, y2: -1 },
    { x1: 0, y1: -1.3661, x2: 1, y2: -1.3661 },
    { x1: 1.3661, y1: 1.0, x2: 1.8661, y2: 1.8661 },
    { x1: 0.8661, y1: 1.8661, x2: 1.8661, y2: 1.8661 },
    { x1: -1.0, y1: 1.3661, x2: -1.8661, y2: 1.8661 },
    { x1: -1.8661, y1: 0.8661, x2: -1.8661, y2: 1.8661 },
    { x1: -1.3661, y1: -1.0, x2: -1.8661, y2: -1.8661 },
    { x1: 1.0, y1: -1.3661, x2: 1.8661, y2: -1.8661 }
    // causes overlap
    //{x1:-.8661, y1:-1.8661, x2:-1.8661, y2:-1.8661},
    //{x1:1.8661, y1:-.8661, x2:1.8661, y2:-1.8661}
  ];
  cellBaseHexTriSq: Array<Line> = [
    { x1: 0, y1: 0, x2: 0, y2: 0.5 },
    { x1: 1.0, y1: 0, x2: 1.0, y2: 0.5 },
    { x1: -1.0, y1: 0, x2: -1.0, y2: 0.5 },
    { x1: -1.0, y1: 0.5, x2: 1.0, y2: 0.5 },
    { x1: 1.0, y1: 0.5, x2: 1.8661, y2: 1 },
    { x1: -1.0, y1: 0.5, x2: -1.8661, y2: 1 },
    { x1: -1.0, y1: 0.5, x2: -0.5, y2: 1.3661 },
    { x1: 1.0, y1: 0.5, x2: 0.5, y2: 1.3661 },
    { x1: 0, y1: 0.5, x2: 0.5, y2: 1.3661 },
    { x1: 0, y1: 0.5, x2: -0.5, y2: 1.3661 },
    { x1: -0.5, y1: 1.3661, x2: 0.5, y2: 1.3661 },
    { x1: -0.5, y1: 1.3661, x2: -0.5, y2: 2.3661 },
    { x1: 0.5, y1: 1.3661, x2: 0.5, y2: 2.3661 },
    { x1: -0.5, y1: 2.3661, x2: 0.5, y2: 2.3661 },
    { x1: -0.5, y1: 1.3661, x2: -1.3661, y2: 1.8661 },
    { x1: -0.5, y1: 2.3661, x2: -1.3661, y2: 1.8661 },
    { x1: 0.5, y1: 1.3661, x2: 1.3661, y2: 1.8661 },
    { x1: 0.5, y1: 2.3661, x2: 1.3661, y2: 1.8661 },
    { x1: -1.8661, y1: 1.0, x2: -1.3661, y2: 1.8661 },
    { x1: 1.8661, y1: 1.0, x2: 1.3661, y2: 1.8661 },
    { x1: -1.3661, y1: 1.8661, x2: -1.8661, y2: 1.8661 },
    { x1: -1.3661, y1: 1.8661, x2: -1.3661, y2: 2.8661 },
    { x1: -1.3661, y1: 2.8661, x2: -1.8661, y2: 2.8661 },
    { x1: 1.3661, y1: 1.8661, x2: 1.8661, y2: 1.8661 },
    { x1: 1.3661, y1: 1.8661, x2: 1.3661, y2: 2.8661 },
    { x1: 1.3661, y1: 2.8661, x2: 1.8661, y2: 2.8661 },
    { x1: -0.5, y1: 2.3661, x2: -1.3661, y2: 2.8661 },
    { x1: -0.5, y1: 2.3661, x2: 0, y2: 3.2322 },
    { x1: 0.5, y1: 2.3661, x2: 1.3661, y2: 2.8661 },
    { x1: 0.5, y1: 2.3661, x2: 0, y2: 3.2322 },
    { x1: 0, y1: 3.2322, x2: 0, y2: 3.7322 },
    { x1: 0, y1: 3.2322, x2: 0.8661, y2: 3.7322 },
    { x1: 0, y1: 3.2322, x2: -0.8661, y2: 3.7322 },
    { x1: 1.3661, y1: 2.8661, x2: 0.8661, y2: 3.7322 },
    { x1: -1.3661, y1: 2.8661, x2: -0.8661, y2: 3.7322 }
  ];
  //<use xlink:href:#cellBaseHexTriSq"/>
  //<use xlink:href:#cellBaseHexTriSq, transform:rotate(180)"/>
  cellDoDec4: Array<Line> = [
    { x1: 0.5, y1: 0.5, x2: -0.5, y2: 0.5 },
    { x1: -0.5, y1: 0.5, x2: -0.5, y2: -0.5 },
    { x1: -0.5, y1: -0.5, x2: 0.5, y2: -0.5 },
    { x1: 0.5, y1: -0.5, x2: 0.5, y2: 0.5 },
    { x1: 0.5, y1: 0.5, x2: 0.0, y2: 1.3661 },
    { x1: 0.0, y1: 1.3661, x2: -0.5, y2: 0.5 },
    { x1: -0.5, y1: 0.5, x2: -1.3661, y2: 0.0 },
    { x1: -1.3661, y1: 0, x2: -0.5, y2: -0.5 },
    { x1: -0.5, y1: -0.5, x2: 0.0, y2: -1.3661 },
    { x1: 0.0, y1: -1.3661, x2: 0.5, y2: -0.5 },
    { x1: 0.5, y1: -0.5, x2: 1.3661, y2: 0.0 },
    { x1: 1.3661, y1: 0.0, x2: 0.5, y2: 0.5 },
    { x1: 0.0, y1: 1.8661, x2: 0.0, y2: 1.3661 },
    { x1: 1.8661, y1: 0.0, x2: 1.3661, y2: 0.0 },
    { x1: 0.0, y1: -1.8661, x2: 0.0, y2: -1.3661 },
    { x1: -1.8661, y1: 0.0, x2: -1.3661, y2: 0.0 }
  ];

  get SVGParam(): SVGConfig {
    return {
      svgHgt: this.svgHgt,
      svgWid: this.svgWid,
      vwTop: this.vwTop,
      vwLeft: this.vwLft,
      vwWidth: this.vwWid,
      vwHeight: this.vwHgt
    };
  }
  get strokeWid() {
    return this.vwWid / this.svgWid;
  }
  get SVGExtent(): Extent {
    return {
      left: this.vwLft,
      right: this.vwLft + this.vwWid,
      top: this.vwTop + this.vwHgt,
      bottom: this.vwTop
    };
  }
  btnSVG(gridName: keyof typeof gridList): SVGConfig {
    return {
      svgHgt: 100,
      svgWid: 100,
      vwTop: 0,
      vwLeft: 0,
      vwWidth: gridList[gridName].cellLen() * 2,
      vwHeight: gridList[gridName].cellLen() * 2
    };
  }
}
</script>

<style scoped>
.gridcont {
  padding: 0.5rem;
  border: black 1px solid;
}
line {
  stroke: black;
  fill: none;
}
use {
  stroke: black;
}
/*.gridbtn {
  width: 7rem;
  height: 7rem;
}*/
</style>
