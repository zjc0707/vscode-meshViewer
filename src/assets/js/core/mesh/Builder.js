class FaceData {
    /**
     * 
     * @param {number[]} vi 
     * @param {number} ci 
     * @param {number} s 
     */
    constructor(vi, ci, s) {
        this.ci = ci
        this.v1 = vi[1]
        this.v2 = vi[2]
        this.v3 = vi[3]
        this.side = s
    }

    /**
     * 
     * @param {FaceData} f 
     * @returns 
     */
    matches(f) {
        return (f.v2 === this.v2) && (f.v1 === this.v3) && (f.v3 === this.v1)
    }
}

class EdgeData {
    /**
     * 
     * @param {number} v1 
     * @param {number} ci 
     * @param {number} s 
     */
    constructor(v1, ci, s) {
        this.ci = ci
        this.v1 = v1
        this.side = s
    }

    /**
     * 
     * @param {EdgeData} f 
     * @returns 
     */
    matches(f) {
        return (f.v1 === this.v1)
    }
}

class Builder {
    /** @type {FaceData[][]} */
    faceData = []
    /** @type {EdgeData[][]} */
    edgeData = []

    /**
     * 
     * @param {Mesh} mesh 
     * @param {number[]} vertexIndexes 
     * @param {number[][]} cells 
     * @param {CELL_TYPE[]} cellTypes 
     * @param {StpFace[]} stpFaces 
     */
    build(mesh, vertexIndexes, cells, cellTypes, stpFaces) {
        this.addVertices(mesh, vertexIndexes)
        this.initAabb(mesh, cells)

        for (let i = 0; i < vertexIndexes.length; i++) {
            this.faceData[vertexIndexes[i]] = []
            this.edgeData[vertexIndexes[i]] = []
        }

        this.addCells(mesh, cells, cellTypes)

        for (const v of this.faceData.filter(p => p !== undefined)) {
            for (const fd of v) {
                this.addFace(mesh, fd)
            }
        }
        for (const e of this.edgeData.filter(p => p !== undefined)) {
            for (const ed of e) {
                this.addEdge(mesh, ed)
            }
        }
        mesh.shells.forEach(s => MeshService.Instance.computeAndStoreNormal(mesh, s))

        this.addStpFace(mesh, stpFaces)

        this.edgeData.length = 0
        this.faceData.length = 0

        // save vertex to face or shell
        for (let i = 0; i < vertexIndexes.length; i++) {
            mesh.vertexToShell[vertexIndexes[i]] = []
            mesh.vertexToFace[vertexIndexes[i]] = []
            mesh.vertexToCell[vertexIndexes[i]] = []
        }
        mesh.shells.forEach((s, i) => {
            MeshService.Instance.vertexIndicesReal(mesh, s).forEach(vi => {
                mesh.vertexToShell[vi].push(i)
            })
        })
        mesh.faces.forEach((f, i) => {
            MeshService.Instance.vertexIndicesReal(mesh, f).forEach(vi => {
                mesh.vertexToFace[vi].push(i)
            })
        })

        mesh.cells.forEach((c, i) => {
            c.vi.forEach(vi => {
                mesh.vertexToCell[vi].push(i)
            })
        })
    }

    /**
     * 
     * @param {Mesh} mesh 
     * @param {StpFace[]} stpFaces 
     */
    addStpFace(mesh, stpFaces) {
        mesh.stpFaces.length = 0
        mesh.cellIndexToStpFaceIndex.length = 0
        mesh.stpFaces.push(...stpFaces)
        stpFaces.forEach((sf, sfi) => {
            for (let i = sf[0]; i <= sf[1]; i++) {
                mesh.cellIndexToStpFaceIndex[i] = sfi
            }
        })
    }

    /**
     * 
     * @param {Mesh} mesh 
     * @param {EdgeData} ea 
     * @param {EdgeData | undefined} eb 
     */
    addEdge(mesh, ea, eb) {
        if (!eb) {
            const e = new Edge()
            e.ci[0] = ea.ci
            e.wi[0] = ea.side
            e.ci[1] = -1
            e.wi[1] = -1

            const ei = mesh.edges.length
            mesh.edges.push(e)
            mesh.cells[ea.ci].ei[ea.side] = ei
        } else {
            const e = new Edge()
            e.ci[0] = ea.ci
            e.wi[0] = ea.side
            e.ci[1] = eb.ci
            e.wi[1] = eb.side

            const ei = mesh.edges.length
            mesh.edges.push(e)
            mesh.cells[ea.ci].ei[ea.side] = ei
            mesh.cells[eb.ci].ei[eb.side] = ei
        }
    }

    /**
     * 
     * @param {Mesh} mesh 
     * @param {FaceData} fa 
     * @param {FaceData?} fb 
     */
    addFace(mesh, fa, fb) {
        if (!fb) {
            const f = new Face()
            f.ci[0] = fa.ci
            f.wi[0] = fa.side
            f.ci[1] = -1
            f.wi[1] = -1
            MeshService.Instance.computeAndStoreNormal(mesh, f)

            const fi = mesh.faces.length
            mesh.faces.push(f)
            mesh.cells[fa.ci].fi[fa.side] = fi
        } else {
            const f = new Face()
            f.ci[0] = fa.ci
            f.wi[0] = fa.side
            f.ci[1] = fb.ci
            f.wi[1] = fb.side
            MeshService.Instance.computeAndStoreNormal(mesh, f)

            const fi = mesh.faces.length
            mesh.faces.push(f)
            mesh.cells[fa.ci].fi[fa.side] = fi
            // mesh.cells[fb.ci].fi[fb.side] = fi
        }
    }

    /**
     * 
     * @param {Mesh} mesh 
     * @param {number[][]} cells 
     * @param {CELL_TYPE[]} cell_types 
     */
    addCells(mesh, cells, cell_types) {
        for (let i = 0; i < cells.length; i++) {
            this.addCell(mesh, cells[i], cell_types[i])
        }
    }

    /**
     * 
     * @param {Mesh} mesh 
     * @param {number[]} vi 
     * @param {CELL_TYPE} cell_type 
     * @returns 
     */
    addCell(mesh, vi, cell_type) {
        let side = 0
        let isShell = false
        switch (cell_type) {
            case CELL_TYPE.HEX:
                side = 6
                break
            case CELL_TYPE.TETRA:
                side = 4
                break
            case CELL_TYPE.PYRAMID:
            case CELL_TYPE.WEDGE:
                side = 5
                break
            case CELL_TYPE.QUAD:
                isShell = true
                side = 4
                break
            case CELL_TYPE.TRIANGLE:
                isShell = true
                side = 3
                break
            default:
                ERROR('not support cell_type')
                return
        }
        const ci = mesh.cells.length
        const c = new Cell(cell_type)
        c.vi.push(...vi)
        mesh.cells.push(c)

        if (!isShell) {
            for (let s = 0; s < side; s++) {
                const vi = this.biggerFirstFace(c.getFace(s))
                const fd = new FaceData(vi, ci, s)

                this.findMatches(mesh, this.faceData[vi[0]], fd)
            }
        } else {
            mesh.shells.push(new Shell(ci))
            for (let s = 0; s < side; s++) {
                const vi = this.biggerFirstEdge(c.getEdge(s))
                const ed = new EdgeData(vi[1], ci, s)

                this.findMatchesEdge(mesh, this.edgeData[vi[0]], ed)
            }
        }
    }

    /**
     * 
     * @param {number[]} v 
     * @returns 
     */
    biggerFirstEdge(v) {
        return v[0] > v[1] ? v : [v[1], v[0]]
    }

    /** 
     * 将四位中最大的放到第一位，用作索引
     * 当存在重复项（三角形）时，将重复项放在第二位并设为-1
     * @param {number[]} v
     */
    biggerFirstFace(v) {
        const m0 = v[0] > v[1] ? 0 : 1,
            m1 = v[2] > v[3] ? 2 : 3,
            m = v[m0] > v[m1] ? m0 : m1
        const f = [v[m], v[(m + 1) % 4], v[(m + 2) % 4], v[(m + 3) % 4]]

        if (f[0] === f[1]) {
            f[1] = f[2]
            f[2] = -1
        }
        if (f[3] === f[0]) {
            f[3] = f[2]
            f[2] = -1
        }
        if (f[1] === f[2] || f[2] === f[3]) {
            f[2] = -1
        }

        return f
    }

    /**
     * 
     * @param {Mesh} mesh 
     * @param {EdgeData[]} v 
     * @param {EdgeData} ed 
     * @returns 
     */
    findMatchesEdge(mesh, v, ed) {
        const last = v.length - 1
        for (let i = 0; i < v.length; i++) {
            if (v[i].matches(ed)) {
                this.addEdge(mesh, ed, v[i])

                if (i < last) {
                    [v[i], v[last]] = [v[last], v[i]]
                }
                v.splice(last, 1)
                return
            }
        }
        v.push(ed)
    }

    /**
     * 
     * @param {Mesh} mesh 
     * @param {FaceData[]} v 
     * @param {FaceData} fd 
     * @returns 
     */
    findMatches(mesh, v, fd) {
        for (let i = 0; i < v.length; i++) {
            if (v[i].matches(fd)) {
                this.addFace(mesh, fd, v[i])
                this.addFace(mesh, v[i], fd)

                v.splice(i, 1)
                return
            }
        }
        // not found: add it
        v.push(fd)
    }

    /**
     * 
     * @param {Mesh} mesh 
     * @param {number[]} vertexIndexes 
     */
    addVertices(mesh, vertexIndexes) {
        for (const vi of vertexIndexes) {
            mesh.vertexIndexes.push(vi)
        }
    }

    /**
     * 
     * @param {Mesh} mesh 
     * @param {number[][]} cells 
     */
    initAabb(mesh, cells) {
        mesh.aabb.clear()
        cells.forEach(vs => {
            vs.forEach(vi => {
                mesh.aabb.extend(AppDataService.Instance.vertices[vi])
            })
        })
    }
}