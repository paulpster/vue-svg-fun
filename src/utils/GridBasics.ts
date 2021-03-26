import { GridOct, GridSquare } from "@/utils/gridOct";
import {
  GridTri,
  GridHex,
  GridTriHex,
  GridTruncHex,
  GridTruncTriHex,
  GridRhombiTriHex,
  GridRhombiHexExt,
  GridDoDecHex,
  GridHexSq,
  GridHexHexSq
} from "@/utils/gridTrunHex";

export type Line = {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
};
export type Use = {
  x: number;
  y: number;
  trans: string;
  href: string;
};
export type Extent = {
  left: number;
  right: number;
  top: number;
  bottom: number;
};

export interface Grid {
  cellLen(): number;
  name(): string;
  base(): Array<Line>;
  plot(ext: Extent): Array<Use>;
}

export class NullGrid implements Grid {
  cellLen(): number {
    return 0;
  }
  name(): string {
    return "";
  }
  base(): Array<Line> {
    return [];
  }
  plot(/*ext: Extent*/): Array<Use> {
    return [];
  }
}

export const gridList = {
  //NulGrid: NullGrid,
  Triangle: GridTri,
  Square: GridSquare,
  SqOct: GridOct,
  Hex: GridHex,
  TriHex: GridTriHex,
  TruncHex: GridTruncHex,
  RhombiTriHex: GridRhombiTriHex,
  RhombiHexExt: GridRhombiHexExt,
  TruncTriHex: GridTruncTriHex,
  DoDecHex: GridDoDecHex,
  HexSq: GridHexSq,
  HexHexSq: GridHexHexSq
} as const;

// the last 'as const' allows me to do this: keyof typeof gridList.
// and THAT gives up a type safe list of keys.
