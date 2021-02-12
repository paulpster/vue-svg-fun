import { expect, assert } from "chai";
import "chai/register-should";
import Complex from "complex.js";

// twilio: aeZSyiyNK4tJ6WZ
// twilio: failsafe: 8kOY6XrAGCHVfqc_aD-uImS56sPVn_Fgs6snzDcT
// https://github.com/public-apis/public-apis

import {
  isBetween,
  inTriangle,
  Circle,
  Work,
  quadradic,
  quadraticRoot,
  newBend,
  newCircles,
  getMoreWork,
  getOffAxisCircle
} from "@/utils/apollonius";

function CtoS(c: Circle): string {
  return `x: ${c.x} y: ${c.y} b: ${c.b}`;
}
function cmpC(a: Circle, b: Circle): boolean {
  return a.x === b.x && a.y === b.y && a.b === b.b;
}

function circCmp(a: Circle, b: Circle): boolean {
  if (a.x !== b.x) {
    return false;
  }
  if (a.y !== b.y) {
    return false;
  }
  if (a.b !== b.b) {
    return false;
  }
  return true;
}

describe("apollonius.ts", () => {
  it("isBetween", () => {
    assert(isBetween(5, 0, 10));
    assert(!isBetween(0, 5, 10));
    assert(isBetween(0, -5, 10));
    assert(isBetween(5, 4, 10));
    assert(!isBetween(5, 5, 10));
  });
  it("inTriangle", () => {
    const c1 = { x: 0, y: 0, b: -1 };
    const c2 = { x: -0.5, y: 0, b: 2 };
    const c3 = { x: 0.5, y: 0, b: 2 };
    const c4 = { x: 0, y: 0.666, b: 3 };
    assert(inTriangle(c4, c1, c2, c3));
  });
  describe("Quadradics", () => {
    const tests = [
      { args: [1, 0, 0], exp: [0, 0] },
      { args: [1, 0, -1], exp: [1, -1] }
    ];
    tests.forEach(test => {
      it(`series ${test.args}`, () => {
        const q = quadradic(test.args[0], test.args[1], test.args[2]);
        expect(q[0]).to.equal(test.exp[0]);
        expect(q[1]).to.equal(test.exp[1]);
      });
    });
    it("quadratic test 1", () => {
      const q = quadradic(1, 0, 0);
      expect(q[0]).to.equal(0);
      expect(q[1]).to.equal(0);
    });
    it("quadratic test 2", () => {
      const q = quadradic(1, 0, -1);
      expect(q[0]).to.equal(1);
      expect(q[1]).to.equal(-1);
    });
    it("quadratic test 3", () => {
      // this should cause an error
      const q = quadradic(1, 0, 1);
      expect(q[0]).to.be.NaN;
      expect(q[1]).to.be.NaN;
    });
  });
  describe("Complex Quadratics", () => {
    it("test 1", () => {
      const q = quadraticRoot(
        new Complex(1, 0),
        new Complex(0, 0),
        new Complex(0, 0)
      );
      expect(q[0].equals(Complex.ZERO)).to.equal(true);
      expect(q[1].equals(Complex.ZERO)).to.equal(true);
    });
    it("test 2", () => {
      const q = quadraticRoot(Complex.ONE, Complex.ZERO, Complex.ONE.neg());
      expect(q[0].equals(Complex.ONE)).to.equal(true);
      expect(q[1].equals(Complex.ONE.neg())).to.equal(true);
    });
    it("test 3", () => {
      const q = quadraticRoot(Complex.ONE, Complex.ZERO, Complex.ONE);
      //console.log(`q0: ${q[0].re} + ${q[0].im}i  q1: ${q[1].re} + ${q[1].im}i`);
      expect(q[0].equals(new Complex(0, 1))).to.equal(true);
      expect(q[1].equals(new Complex(0, -1))).to.equal(true);
    });
  });
  describe("Bends Testing", () => {
    const tests = [
      { args: [1, 1, 0], exp: [4, 0] },
      { args: [-1, 2, 2], exp: [3, 3] },
      { args: [-1, 2, 3], exp: [6, 2] },
      { args: [3, 2, 2], exp: [15, -1] },
      { args: [6, 2, 3], exp: [23, -1] },
      { args: [6, -1, 3], exp: [14, 2] },
      { args: [6, 2, -1], exp: [11, 3] },
      { args: [15, 2, 3], exp: [38, 2] },
      { args: [15, 2, 2], exp: [35, 3] }
    ];
    tests.forEach(test => {
      it(`Series: ${test.args}`, () => {
        const q = newBend(test.args[0], test.args[1], test.args[2]);
        //console.log(`       q0: ${q[0]}  q1: ${q[1]}`);
        expect(q[0]).to.equal(test.exp[0]);
        expect(q[1]).to.equal(test.exp[1]);
      });
    });
  });
  describe("Circles Testing", () => {
    it("basic", () => {
      const c1 = { x: 0, y: 0, b: -1 };
      const c2 = { x: -0.5, y: 0, b: 2 };
      const c3 = { x: 0.5, y: 0, b: 2 };
      const q = newCircles(c1, c2, c3);
      //console.log(q);
      if (q[0]) {
        q[0].x.should.equal(0);
        q[0].y.should.equal(2 / 3);
        q[0].b.should.equal(3);
      } else {
        assert(false);
      }
      if (q[1]) {
        q[1].x.should.equal(0);
        q[1].y.should.equal(-2 / 3);
        q[1].b.should.equal(3);
      } else {
        assert(false);
      }
    });

    const tests = [
      {
        args: [
          { x: 0, y: 2 / 3, b: 3 },
          { x: 0, y: 0, b: -1 },
          { x: 0.5, y: 0, b: 2 }
        ],
        exp: [{ x: 0.5, y: 2 / 3, b: 6 }]
      },
      {
        args: [
          { x: 0, y: 2 / 3, b: 3 },
          { x: 0.5, y: 0, b: 2 },
          { x: -0.5, y: 0, b: 2 }
        ],
        exp: [{ x: 0, y: 8 / 30, b: 15 }]
      },
      {
        args: [
          { x: 0, y: 2 / 3, b: 3 },
          { x: 0, y: 0, b: -1 },
          { x: -0.5, y: 0, b: 2 }
        ],
        exp: [{ x: -0.5, y: 2 / 3, b: 6 }]
      }
    ];
    tests.forEach(test => {
      it("series", () => {
        const q = newCircles(test.args[0], test.args[1], test.args[2]);
        //console.log(q);
        if (q[0]) {
          assert(circCmp(q[0], test.exp[0]));
        } else {
          assert(false);
        }
        //assert(circCmp(q[1], test.exp[1]));
      });
    });
    //////////////////////////////////
    describe("in depth", () => {
      const arrCir: Array<Circle> = [
        { x: 0, y: 0, b: -1 },
        { x: 0.5, y: 0, b: 2 },
        { x: -0.5, y: 0, b: 2 },
        { x: 0, y: 2 / 3, b: 3 },
        { x: 0, y: -2 / 3, b: 3 }
      ];

      // need a way to start with the first three circles and fill out the rest until we reach
      //    twice the stroke-width.
      let work: Array<Work> = [
        { cir: 3, depth: 1, parents: [0, 1, 2] },
        { cir: 4, depth: 1, parents: [0, 1, 2] }
      ];
      it("Step 1", () => {
        const answer = [
          { x: 0.5, y: 0.6666666666666666, b: 6 },
          { x: -0.5, y: 0.6666666666666666, b: 6 },
          { x: 0, y: 0.26666666666666666, b: 15 },
          { x: 0.5, y: -0.6666666666666666, b: 6 },
          { x: -0.5, y: -0.6666666666666666, b: 6 },
          { x: 0, y: -0.26666666666666666, b: 15 }
        ];
        const NW = getMoreWork(work, arrCir, 18);
        work = NW;
        for (let x = 0; x < NW.length; x++) {
          const b = cmpC(arrCir[NW[x].cir], answer[x]);
          if (!b) {
            console.log(
              `cmpC FAIL [${x}]: ${CtoS(arrCir[NW[x].cir])} vs ${CtoS(
                answer[x]
              )}`
            );
          }
          assert(cmpC(arrCir[NW[x].cir], answer[x]));
        }
      });
      it("Step 2", () => {
        // some of these things will not show because of the maxBend of 18
        const answer = [
          { x: 0.35714285714285715, y: 0.8571428571428571, b: 14 },
          //{ x: 0.34782608695652173, y: 0.5217391304347826, b: 23 },
          { x: 0.7272727272727273, y: 0.5454545454545454, b: 11 },
          { x: -0.35714285714285715, y: 0.8571428571428571, b: 14 },
          //{ x: -0.34782608695652173, y: 0.5217391304347826, b: 23 },
          { x: -0.7272727272727273, y: 0.5454545454545454, b: 11 },
          //{ x: 0.07894736842105263, y: 0.3157894736842105, b: 38 },
          //{ x: -0.07894736842105263, y: 0.3157894736842105, b: 38 },
          //{ x: 0, y: 0.17142857142857143, b: 35 },
          { x: 0.35714285714285715, y: -0.8571428571428571, b: 14 },
          //{ x: 0.34782608695652173, y: -0.5217391304347826, b: 23 },
          { x: 0.7272727272727273, y: -0.5454545454545454, b: 11 },
          { x: -0.35714285714285715, y: -0.8571428571428571, b: 14 },
          //{ x: -0.34782608695652173, y: -0.5217391304347826, b: 23 },
          { x: -0.7272727272727273, y: -0.5454545454545454, b: 11 }
          //{ x: 0.07894736842105263, y: -0.3157894736842105, b: 38 },
          //{ x: -0.07894736842105263, y: -0.3157894736842105, b: 38 },
          //{ x: 0, y: -0.17142857142857143, b: 35 }
        ];
        const NW = getMoreWork(work, arrCir, 18);
        work = NW;
        for (let x = 0; x < NW.length; x++) {
          const b = cmpC(arrCir[NW[x].cir], answer[x]);
          if (!b) {
            console.log(
              `cmpC FAIL: ${CtoS(arrCir[NW[x].cir])} vs ${CtoS(answer[x])}`
            );
          }
          assert(cmpC(arrCir[NW[x].cir], answer[x]));
        }
      });
      it("Step 3", () => {
        const NW = getMoreWork(work, arrCir, 18);
        expect(NW.length).to.be.eq(0);
      });
    });
  });
  describe("Off axis circle", () => {
    it("a try", () => {
      // max radius would be .5 (b:2)
      // min radius to try .1 (b:10)
      const inner: Circle = { x: -0.5, y: 0, b: 2 };
      const poss: Circle = { x: 0.5, y: 1, b: 0 };
      let circC = getOffAxisCircle(inner, poss);
      console.log(`First on slope 1: ${CtoS(circC)}`);
      circC = getOffAxisCircle(
        { x: -1 / 3, y: 0, b: 1.5 },
        { x: 0.5, y: 0.0001, b: 0 }
      );
      console.log(`Second on slope 1: ${CtoS(circC)}`);
    });
  });
});
