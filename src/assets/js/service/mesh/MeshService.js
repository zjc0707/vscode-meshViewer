class MeshService {
    static get Instance() {
        if (!this._i) {
            this._i = new MeshService()
        }
        return this._i
    }

    /**
     * 
     * @param {Mesh} mesh 
     */
    clear(mesh) {
        mesh.cells.length = 0
        mesh.faces.length = 0
        mesh.edges.length = 0
        mesh.shells.length = 0
        mesh.vertexIndexes.length = 0
        mesh.stpFaces.length = 0
        mesh.cellIndexToStpFaceIndex.length = 0
        mesh.vertexToCell.length = 0
        mesh.vertexToFace.length = 0
        mesh.vertexToShell.length = 0
        mesh.aabb.clear()
        mesh.faceRendered.length = 0
        mesh.renderFaceToFace.length = 0
        mesh.qualityMetricValsArr.length = 0
        mesh.faceToMeshDataItemIndexes.length = 0
    }

    /**
     * 
     * @param {Mesh} mesh 
     */
    unmarkAll(mesh) {
        for (const c of mesh.cells) { c.marked = false }
    }

    /**
     * 
     * @param {Mesh} mesh 
     */
    markAll(mesh) {
        for (const c of mesh.cells) { c.marked = true }
    }

    /**
     * 
     * @param {Mesh} mesh 
     * @param {Face | Edge | Shell} f 
     * @param {0 | 1} side0Or1 
     * @returns {number[]}
     */
    vertexIndicesReal(mesh, f, side0Or1 = 0) {
        if (f instanceof Face) {
            return mesh.cells[f.ci[side0Or1]].getFaceReal(f.wi[side0Or1])
        } else if (f instanceof Edge) {
            return mesh.cells[f.ci[side0Or1]].getEdge(f.wi[side0Or1])
        } else {
            return mesh.cells[f.ci].vi
        }
    }

    /**
     * 
     * @param {Mesh} mesh 
     * @returns {number[]}
     */
    getBoundaryVertexIndexes(mesh) {
        const rs = new Set()

        /**
         * 
         * @param {Face[] | Edge[]} arr 
         */
        const func = (arr) => {
            arr.filter(p => p.isBoundary())
                .map(p => this.vertexIndicesReal(mesh, p))
                .forEach(p => {
                    p.forEach(pp => rs.add(pp))
                })
        }

        func(mesh.edges)
        func(mesh.faces)

        return Array.from(rs)
    }

    /**
     * 
     * @param {number} vi 
     * @returns 
     */
    pos(vi) {
        return AppDataService.Instance.vertices[vi].clone()
    }

    /**
     * 
     * @param {Mesh} mesh 
     * @param {number | Cell} ci 
     * @returns {boolean}
     */
    isMarked(mesh, ci) {
        if (ci instanceof Cell) {
            return ci.marked
        }
        return mesh.cells[ci].marked
    }

    isFaceVisible(mesh, f) {
        const side0 = !this.isMarked(mesh, f.ci[0]),
            side1 = f.isBoundary() || this.isMarked(mesh, f.ci[1])
        return side0 && side1
    }

    isShellVisible(mesh, s) {
        return !this.isMarked(mesh, s.ci)
    }

    computeAndStoreNormal(mesh, face) {
        const normal = new THREE.Vector3()

        const vi = this.vertexIndicesReal(mesh, face)

        if (!vi) {
            console.error('not found vertex indics')
            return
        }

        if (vi.length === 4) {
            let a, b
            a = new THREE.Vector3().subVectors(this.pos(vi[3]), this.pos(vi[0]))
            b = new THREE.Vector3().subVectors(this.pos(vi[1]), this.pos(vi[0]))
            normal.add(new THREE.Vector3().crossVectors(a, b))
            a = new THREE.Vector3().subVectors(this.pos(vi[0]), this.pos(vi[1]))
            b = new THREE.Vector3().subVectors(this.pos(vi[2]), this.pos(vi[1]))
            normal.add(new THREE.Vector3().crossVectors(a, b))
            a = new THREE.Vector3().subVectors(this.pos(vi[1]), this.pos(vi[2]))
            b = new THREE.Vector3().subVectors(this.pos(vi[3]), this.pos(vi[2]))
            normal.add(new THREE.Vector3().crossVectors(a, b))
            a = new THREE.Vector3().subVectors(this.pos(vi[2]), this.pos(vi[3]))
            b = new THREE.Vector3().subVectors(this.pos(vi[0]), this.pos(vi[3]))
            normal.add(new THREE.Vector3().crossVectors(a, b))
            if (face instanceof Shell) {
                normal.multiplyScalar(-1)
            }
        } else if (vi.length === 3) {
            const a = new THREE.Vector3().subVectors(this.pos(vi[2]), this.pos(vi[0])),
                b = new THREE.Vector3().subVectors(this.pos(vi[1]), this.pos(vi[0]))
            if (face instanceof Face) {
                normal.add(new THREE.Vector3().crossVectors(a, b))
            } else {
                normal.add(new THREE.Vector3().crossVectors(b, a))
            }
        }

        normal.normalize()

        face.normal.copy(normal)
    }
}