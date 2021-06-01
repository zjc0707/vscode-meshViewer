const CELL_TYPE = {
    TRIANGLE: 5,
    QUAD: 9,
    TETRA: 10,
    HEX: 12,
    WEDGE: 13,
    PYRAMID: 14
}

class Cell {
    /** @type {number[]} */ fi = []
    /** @type {number[]} */ ei = []
    /** @type {number[]} */ vi = []
    isSelected = false
    marked = false

    /**
     * 
     * @param {number} type CELL_TYPE
     */
    constructor(type) {
        this.type = type
    }

    /**
     * 
     * @param {number} side 
     */
    getEdge(side) {
        switch (this.type) {
            case CELL_TYPE.TRIANGLE:
                return this.getEdgeTri(side)
            // case CELL_TYPE.QUAD:
            default:
                return this.getEdgeQuad(side)
        }
    }

    /**
     * 
     * @param {number} side 
     */
    getFace(side) {
        switch (this.type) {
            case CELL_TYPE.HEX:
                return this.getFaceHex(side)
            case CELL_TYPE.TETRA:
                return this.getFaceTet(side)
            case CELL_TYPE.PYRAMID:
                return this.getFacePyramid(side)
            // case CELL_TYPE.WEDGE:
            default:
                return this.getFaceWebge(side)
        }
    }

    /**
     * 
     * @param {number} side 
     */
    getFaceReal(side) {
        switch (this.type) {
            case CELL_TYPE.HEX:
                return this.getFaceHex(side)
            case CELL_TYPE.TETRA:
                return this.getFaceTetReal(side)
            case CELL_TYPE.PYRAMID:
                return this.getFacePyramidReal(side)
            // case CELL_TYPE.WEDGE:
            default:
                return this.getFaceWebgeReal(side)
        }
    }

    getEdgeQuad(/** @type {number} */ edge0to3) {
        switch (edge0to3) {
            case 0:
                return this.vs(2, 1)
            case 1:
                return this.vs(1, 0)
            case 2:
                return this.vs(0, 3)
            // case 3:
            default:
                return this.vs(3, 2)
        }
    }

    getEdgeTri(edge0to2) {
        switch (edge0to2) {
            case 0:
                return this.vs(2, 1)
            case 1:
                return this.vs(1, 0)
            // case 2:
            default:
                return this.vs(0, 2)
        }
    }

    getFaceWedge(face0to4) {
        switch (face0to4) {
            case 0:
                return this.vs(0, 1, 4, 3)
            case 1:
                return this.vs(0, 3, 5, 2)
            case 2:
                return this.vs(2, 5, 4, 1)
            case 3:
                return this.vs(0, 2, 2, 1)
            // case 4:
            default:
                return this.vs(4, 5, 5, 3)
        }
    }

    getFaceWedgeReal(face0to4) {
        switch (face0to4) {
            case 0:
                return this.vs(0, 1, 4, 3)
            case 1:
                return this.vs(0, 3, 5, 2)
            case 2:
                return this.vs(2, 5, 4, 1)
            case 3:
                return this.vs(0, 2, 1)
            // case 4:
            default:
                return this.vs(4, 5, 3)
        }
    }

    getFacePyramid(face0to4) {
        switch (face0to4) {
            case 0:
                return this.vs(0, 1, 2, 3)
            case 1:
                return this.vs(0, 4, 4, 1)
            case 2:
                return this.vs(1, 4, 4, 2)
            case 3:
                return this.vs(2, 4, 4, 3)
            // case 4:
            default:
                return this.vs(3, 4, 4, 0)
        }
    }

    getFacePyramidReal(face0to4) {
        switch (face0to4) {
            case 0:
                return this.vs(0, 1, 2, 3)
            case 1:
                return this.vs(0, 4, 1)
            case 2:
                return this.vs(1, 4, 2)
            case 3:
                return this.vs(2, 4, 3)
            // case 4:
            default:
                return this.vs(3, 4, 0)
        }
    }

    getFaceHex(face0to5) {
        switch (face0to5) {
            case 0:
                return this.vs(2, 1, 5, 6)
            case 1:
                return this.vs(3, 7, 4, 0)
            case 2:
                return this.vs(4, 5, 1, 0)
            case 3:
                return this.vs(7, 3, 2, 6)
            case 4:
                return this.vs(1, 2, 3, 0)
            default:
                return this.vs(5, 4, 7, 6)
        }
    }

    getFaceTetReal(face0to3) {
        switch (face0to3) {
            case 0:
                return this.vs(3, 1, 0)
            case 1:
                return this.vs(3, 2, 1)
            case 2:
                return this.vs(3, 0, 2)
            // case 3:
            default:
                return this.vs(1, 2, 0)
        }
    }

    getFaceTet(face0to3) {
        switch (face0to3) {
            case 0:
                return this.vs(3, 3, 1, 0)
            case 1:
                return this.vs(3, 3, 2, 1)
            case 2:
                return this.vs(3, 3, 0, 2)
            // case 3:
            default:
                return this.vs(1, 2, 2, 0)
        }
    }

    /**
     * 
     * @param  {...number} vs 
     * @returns 
     */
    vs(...vs) {
        return vs.map(v => this.vi[v])
    }
}

class Face {
    constructor() {
        this.normal = new THREE.Vector3()
        /** @type {number[]} */
        this.ci = []
        /** @type {number[]} */
        this.wi = []
    }

    isBoundary() {
        return this.ci[1] === -1
    }
}

class Shell {
    /**
     * 
     * @param {number} ci 
     */
    constructor(ci) {
        this.normal = new THREE.Vector3()
        this.ci = ci
    }
}

class Edge {
    constructor() {
        /** @type {number[]} */
        this.ci = []
        /** @type {number[]} */
        this.wi = []
    }

    isBoundary() {
        return this.ci[1] === -1
    }
}

class StpFace extends Array {
    isSelected = false
}

class Mesh {
    /** @type {Cell[]} */
    cells = []
    /** @type {Face[]} */
    faces = []
    /** @type {Edge[]} */
    edges = []
    /** @type {Shell[]} */
    shells = []
    /** @type {number[]} */
    vertexIndexes = []
    /** @type {StpFace[]} */
    stpFaces = []
    /** @type {number[]} */
    cellIndexToStpFaceIndex = []

    /** @type {number[]} */
    vertexToCell = []
    /** @type {number[]} */
    vertexToFace = []
    /** @type {number[]} */
    vertexToShell = []

    aabb = new AlignedBox()
    /** @type {Face[]} */
    faceRendered = []
    /** @type {(Face | Shell)[]} */
    renderFaceToFace = []
    /** @type {number[][]} */
    faceToMeshDataItemIndexes = []
}