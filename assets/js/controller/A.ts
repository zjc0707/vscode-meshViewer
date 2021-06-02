type Color = string | number

export enum CELL_TYPE {
    TRIANGLE = 5,
    QUAD = 9,
    TETRA = 10,
    HEX = 12,
    WEDGE = 13,
    PYRAMID = 14
  }

class A {
    private static _i?: A;

    static get Instance() {
        if (!this._i) {
            this._i = new A();
        }
        return this._i;
    }

    color?: Color
}

