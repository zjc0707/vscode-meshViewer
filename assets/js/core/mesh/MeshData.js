class MeshData {
    /** @type {Vector3[]} */
    surfaceVertPos = []
    // 根据所在面片得到的法向量
    /** @type {Vector3[]} */
    surfaceVertFaceNorm = []
    /** @type {Vector3[]} */
    surfaceVertVertexNorm = []
    /** @type {Vector3[]} */
    surfaceVertColor = []
    /** @type {number[]} */
    surfaceIbuffer = []
  
    /** @type {Vector3[]} */
    wireframeVertPos = []
    /** @type {Vector3[]} */
    wireframeVertColor = []
    /** @type {number[]} */
    wireframeVertAlpha = []
  
    clear() {
      this.clearSurface()
      this.clearWireframe()
    }
  
    clearSurface() {
      this.surfaceVertPos.length = 0
      this.surfaceVertFaceNorm.length = 0
      this.surfaceVertVertexNorm.length = 0
      this.surfaceVertColor.length = 0
      this.surfaceIbuffer.length = 0
    }
  
    clearWireframe() {
      this.wireframeVertPos.length = 0
      this.wireframeVertColor.length = 0
      this.wireframeVertAlpha.length = 0
    }
  }