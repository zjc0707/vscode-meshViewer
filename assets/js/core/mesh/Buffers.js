class Buffers {
    /**
     * 
     * @param {MeshData} meshData 
     */
    constructor(meshData) {
        this.surface = new THREE.BufferGeometry()
        this.surface.name = 'surface'
        this.wireframe = new THREE.BufferGeometry()
        this.wireframe.name = 'wireframe'
        this.wireframeSelected = new THREE.BufferGeometry()
        this.wireframeSelected.name = 'wireframeSelected'
        this.meshData = meshData
    }

    dispose() {
        this.surface.dispose()
        this.wireframe.dispose()
        this.wireframeSelected.dispose()
        this.meshData.clear()
    }

    updateWireframe() {
        this.updateWireframePosition()
        this.updateWireframeColor()
        this.updateWireframeSelectedColor()
        this.updateWireframeAlpha()
    }

    updateWireframePosition() {
        const buffer = Buffers.getBuffer(this.meshData.wireframeVertPos)
        const attr = new THREE.BufferAttribute(buffer, 3)
        this.wireframe.setAttribute('position', attr)
        this.wireframeSelected.setAttribute('position', attr)
    }

    updateWireframeColor() {
        const buffer = Buffers.getBuffer(this.meshData.wireframeVertColor)
        this.wireframe.setAttribute('color', new THREE.BufferAttribute(buffer, 3))
    }

    updateWireframeSelectedColor() {
        const color = Utils.getColorV3FromString(GlobalSettings.Instance.wireframeSelectedColor)
        const v = []
        for (let i = 0; i < this.meshData.wireframeVertColor.length; i++) {
            v.push(color)
        }

        const buffer = Buffers.getBuffer(v)
        this.wireframeSelected.setAttribute('color', new THREE.BufferAttribute(buffer, 3))
    }

    updateWireframeAlpha() {
        const buffer = new Float32Array(this.meshData.wireframeVertAlpha)
        const attr = new THREE.BufferAttribute(buffer, 1)
        this.wireframe.setAttribute('alpha', attr)
        this.wireframeSelected.setAttribute('alpha', attr)
    }

    /**
     * 
     * @param {boolean} isNormalFace 
     */
    updateSurface(isNormalFace) {
        this.updateSurfacePosition()
        this.updateSurfaceColor()
        this.updateSurfaceNormal(isNormalFace)
        this.updateSurfaceIbuffer()
    }

    updateSurfacePosition() {
        const buffer = Buffers.getBuffer(this.meshData.surfaceVertPos)
        this.surface.setAttribute('position', new THREE.BufferAttribute(buffer, 3))
    }

    /**
     * 
     * @param {boolean} isNormalFace 
     */
    updateSurfaceNormal(isNormalFace) {
        const buffer = Buffers.getBuffer(isNormalFace ? this.meshData.surfaceVertFaceNorm : this.meshData.surfaceVertVertexNorm)
        this.surface.setAttribute('normal', new THREE.BufferAttribute(buffer, 3))
    }

    updateSurfaceColor() {
        const buffer = Buffers.getBuffer(this.meshData.surfaceVertColor)
        this.surface.setAttribute('color', new THREE.BufferAttribute(buffer, 3))
    }

    updateSurfaceIbuffer() {
        const buffer = []
        for (const i of this.meshData.surfaceIbuffer) {
            buffer.push(i)
        }
        this.surface.setIndex(buffer)
    }

    /**
     * 
     * @param {THREE.Vector3[]} vs 
     * @returns 
     */
    static getBuffer(vs) {
        const arr = []
        for (const v of vs) {
            arr.push(v.x, v.y, v.z)
        }
        return new Float32Array(arr)
    }
}
