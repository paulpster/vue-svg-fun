import { Line, Grid, Use, Extent } from "@/utils/GridBasics";

export class SqGrid implements Grid {
  constructor(
    private baseLen: number,
    private gridName: string,
    private cell: Array<Line>
  ) {}

  cellLen(): number {
    return this.baseLen;
  }
  name(): string {
    return this.gridName;
  }
  base(): Array<Line> {
    return this.cell;
  }
  plot(ext: Extent): Array<Use> {
    const arr: Array<Use> = [];
    // these loops need to cover the extent
    // find the number of cells in each direction to cover the extent
    const wid = Math.ceil(ext.right / this.baseLen) + 1;
    const hgt = Math.ceil(ext.top / this.baseLen) + 1;
    const lBeg = Math.ceil(ext.left / this.baseLen) - 1;
    const bBeg = Math.ceil(ext.bottom / this.baseLen) - 1;
    //console.log(`Loop: ${lBeg} ${bBeg} ${wid} ${hgt}`);

    for (let i = bBeg; i < hgt; i++) {
      for (let j = lBeg; j < wid; j++) {
        const x = j * this.baseLen;
        const y = i * this.baseLen;
        arr.push({ x: x, y: y, trans: "", href: `#${this.gridName}` });
      }
    }
    return arr;
  }
}

const cellOct: Array<Line> = [
  { x1: -1.2071, y1: 0, x2: -0.7071, y2: 0 },
  { x1: -0.7071, y1: 0, x2: 0.0, y2: -0.7071 },
  { x1: 0.0, y1: -1.2071, x2: 0.0, y2: -0.7071 },
  { x1: 0.0, y1: -0.7071, x2: 0.7071, y2: 0.0 },
  { x1: 1.2071, y1: 0, x2: 0.7071, y2: 0 },
  { x1: 0.7071, y1: 0, x2: 0.0, y2: 0.7071 },
  { x1: 0.0, y1: 1.2071, x2: 0.0, y2: 0.7071 },
  { x1: 0.0, y1: 0.7071, x2: -0.7071, y2: 0.0 }
];

const cellSquare = [
  { x1: 0.0, y1: 0.5, x2: 0.0, y2: -0.5 },
  { x1: -0.5, y1: 0.0, x2: 0.5, y2: 0.0 }
];

export const GridSquare = new SqGrid(1, "square", cellSquare);

export const GridOct = new SqGrid(2.4142, "oct", cellOct);

/*export default class GridOct implements Grid {
  baseLen = 2.4142;
  gridName = "oct";

  name(): string {
    return this.gridName;
  }
  base(): Array<Line> {
    return this.cellOct;
  }
  plot(ext: Extent): Array<Use> {
    const arr: Array<Use> = [];
    // these loops need to cover the extent
    // find the number of cells in each direction to cover the extent
    const wid = Math.ceil(ext.right / this.baseLen) + 1;
    const hgt = Math.ceil(ext.top / this.baseLen) + 1;
    const lBeg = Math.ceil(ext.left / this.baseLen) - 1;
    const bBeg = Math.ceil(ext.bottom / this.baseLen) - 1;
    console.log(`Loop: ${lBeg} ${bBeg} ${wid} ${hgt}`);

    for (let i = bBeg; i < hgt; i++) {
      for (let j = lBeg; j < wid; j++) {
        const x = j * this.baseLen;
        const y = i * this.baseLen;
        arr.push({ x: x, y: y, trans: "", href: `#${this.gridName}` });
      }
    }
    return arr;
  }
}*/
