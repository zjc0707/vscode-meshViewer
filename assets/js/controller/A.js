"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CELL_TYPE = void 0;
var CELL_TYPE;
(function (CELL_TYPE) {
    CELL_TYPE[CELL_TYPE["TRIANGLE"] = 5] = "TRIANGLE";
    CELL_TYPE[CELL_TYPE["QUAD"] = 9] = "QUAD";
    CELL_TYPE[CELL_TYPE["TETRA"] = 10] = "TETRA";
    CELL_TYPE[CELL_TYPE["HEX"] = 12] = "HEX";
    CELL_TYPE[CELL_TYPE["WEDGE"] = 13] = "WEDGE";
    CELL_TYPE[CELL_TYPE["PYRAMID"] = 14] = "PYRAMID";
})(CELL_TYPE = exports.CELL_TYPE || (exports.CELL_TYPE = {}));
class A {
    static get Instance() {
        if (!this._i) {
            this._i = new A();
        }
        return this._i;
    }
}
//# sourceMappingURL=A.js.map