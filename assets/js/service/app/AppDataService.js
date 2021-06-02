class AppDataService {
    static get Instance() {
        if (!this._i) {
            this._i = new AppDataService()
        }
        return this._i
    }

    get renderData() {
        return RenderService.Instance.data
    }

    get vertices() {
        return this.renderData.vertices
    }

    get vertexIndexToApp() {
        return this.renderData.vertexIndexToApp
    }

    /**
     * 
     * @param {App} app 
     * @param {AppThreeJSData} data 
     * @param {number[]} vertexIndexes 
     * @param {number[][]} cells 
     * @param {number[]} cellTypes 
     * @param {StpFace[]} stpFaces 
     */
    buildData(app, data, vertexIndexes, cells,
        cellTypes, stpFaces) {
        if (app.isFromStp) {
            app.fileType = FILE_TYPE.STP
        } else {
            app.fileType = cellTypeToFileType(cellTypes[0])
            for (let i = 1; i < cellTypes.length; i++) {
                if (cellTypes[i] !== cellTypes[0]) {
                    app.fileType = FILE_TYPE.HEXDOM
                    break
                }
            }
        }

        for (const p of vertexIndexes) {
            if (!this.vertexIndexToApp[p]) {
                this.vertexIndexToApp[p] = []
            }
            this.vertexIndexToApp[p].push(app)
        }

        new Builder().build(data.mesh, vertexIndexes, cells, cellTypes, stpFaces)

        MeshService.Instance.unmarkAll(data.mesh)
        this.updateApp({
            app: app,
            type: 'all'
        })

        data.group.add(data.renderables.visible.surface, data.renderables.visible.wireframe,
            data.renderables.visible.wireframeSelected)
        app.isMeshBuilt = true
    }

    /**
     * 
     * @param {AppNeedUpdateOption} option 
     */
    updateApp(option) {
        const app = option.app
        const isFromStp = app.isFromStp
        const isNormalFace = app.isNormalFace
        const data = AppService.Instance.getData(app)

        switch (option.type) {
            case 'all':
                this.prepareFace(data)
                data.buffers.updateSurface(isNormalFace)
                this.prepareWireframe(data, isFromStp)
                data.buffers.updateWireframe()
                break
            case 'surfaceNormal':
                data.buffers.updateSurfaceNormal(isNormalFace)
                break
            case 'surfaceColor':
                data.buffers.updateSurfaceColor()
                break
            case 'wireframeColor':
                data.buffers.updateWireframeColor()
                break
            case 'wireframeSelectedColor':
                data.buffers.updateWireframeSelectedColor()
                break
        }
    }

    prepareFace(data) {
        data.meshData.clearSurface()
        data.mesh.faceRendered.length = 0
        data.mesh.renderFaceToFace.length = 0
        data.mesh.faceToMeshDataItemIndexes.length = 0
        for (const f of data.mesh.faces) {
            if (MeshService.Instance.isFaceVisible(data.mesh, f)) {
                this.addVisibleFace(data, f)
            } else {
                data.mesh.faceToMeshDataItemIndexes.push([])
            }
        }
        for (const s of data.mesh.shells) {
            if (MeshService.Instance.isShellVisible(data.mesh, s)) {
                this.addVisibleFace(data, s)
            } else {
                data.mesh.faceToMeshDataItemIndexes.push([])
            }
        }
    }

    prepareWireframe(data, isFromStp) {
        data.meshData.clearWireframe()
        if (isFromStp) {
            data.mesh.edges.filter(e => e.isBoundary()).forEach(e => {
                const vi = MeshService.Instance.vertexIndicesReal(data.mesh, e)
                this.addWireframeEdge(data, vi[0], vi[1])
            })
        } else {
            [...data.mesh.faces, ...data.mesh.shells]
                .filter(f => f instanceof Face ? MeshService.Instance.isFaceVisible(data.mesh, f)
                    : MeshService.Instance.isShellVisible(data.mesh, f))
                .map(f => MeshService.Instance.vertexIndicesReal(data.mesh, f))
                .forEach(vi => {
                    for (let side = 0; side < vi.length; side++) {
                        const v0 = vi[side], v1 = vi[(side + 1) % vi.length]
                        this.addWireframeEdge(data, v0, v1)
                    }
                })
        }
    }

    addVisibleFace(data, face) {
        if (face instanceof Face) {
          data.mesh.faceRendered.push(face)
        }
        const cell = face instanceof Face ? data.mesh.cells[face.ci[0]] : data.mesh.cells[face.ci]
        const color = cell.isSelected ? data.localSelectedColor
          : cell.qualityColor ??
          ((face instanceof Face && !face.isBoundary()) ? data.insideColor : data.outsideColor)
    
        const idx = data.meshData.surfaceVertPos.length
        const vi = MeshService.Instance.vertexIndicesReal(data.mesh, face)
    
        const indexes = []
        for (let i = 0; i < vi.length; i++) {
          const index = this.addVertex(data.meshData, MeshService.Instance.pos(vi[i]),
            face.normal, this.computeVertexNormal(data.mesh, vi[i]), color)
          indexes.push(index)
        }
        data.mesh.faceToMeshDataItemIndexes.push(indexes)
    
        if (vi.length === 4) {
          data.mesh.renderFaceToFace.push(face, face)
          if (face instanceof Face) {
            this.addTriangle(data.meshData, idx + 2, idx + 1, idx)
            this.addTriangle(data.meshData, idx, idx + 3, idx + 2)
          } else {
            this.addTriangle(data.meshData, idx, idx + 1, idx + 2)
            this.addTriangle(data.meshData, idx + 2, idx + 3, idx)
          }
        } else if (vi.length === 3) {
          data.mesh.renderFaceToFace.push(face)
          if (face instanceof Face) {
            this.addTriangle(data.meshData, idx + 2, idx + 1, idx)
          } else {
            this.addTriangle(data.meshData, idx, idx + 1, idx + 2)
          }
        }
      }

      computeVertexNormal(mesh, v) {
        const normal = new THREE.Vector3()
        mesh.vertexToFace[v].forEach(f => {
          const face = mesh.faces[f]
          if (MeshService.Instance.isFaceVisible(mesh, face)) {
            normal.add(face.normal)
          }
        })
        mesh.vertexToShell[v].forEach(s => {
          const shell = mesh.shells[s]
          if (MeshService.Instance.isShellVisible(mesh, shell)) {
            normal.add(shell.normal)
          }
        })
        return normal.normalize()
      }

      addVertex(meshData, pos, face_norm, vertex_norm, color) {
        meshData.surfaceVertPos.push(pos)
        meshData.surfaceVertFaceNorm.push(face_norm)
        meshData.surfaceVertVertexNorm.push(vertex_norm)
        meshData.surfaceVertColor.push(color)
    
        return meshData.surfaceVertColor.length - 1
      }
    
      addTriangle(meshData, i1, i2, i3) {
        meshData.surfaceIbuffer.push(i1, i2, i3)
      }
    
      addWireframeEdge(data, v0, v1) {
        data.meshData.wireframeVertPos.push(MeshService.Instance.pos(v0), MeshService.Instance.pos(v1))
    
        for (let i = 0; i < 2; i++) {
          data.meshData.wireframeVertColor.push(data.wireframeColor)
          data.meshData.wireframeVertAlpha.push(GlobalSettings.Instance.wireframeAlpha)
        }
      }


}