class AppThreeJSData {
    /**
     * 
     * @param {string | number} color 
     */
    constructor(color) {
        this.mesh = new Mesh()
        this.meshData = new MeshData()
        this.buffers = new Buffers(this.meshData)
        this.materials = new Materials()
        this.renderables = new Renderables(this.buffers, this.materials)

        this.group = new THREE.Group()
        this.group.name = 'app'

        this.outsideColor = Utils.getColorV3FromString(color)
        this.insideColor = Utils.getColorV3FromString(GlobalSettings.Instance.surfaceInsideColor)
        this.wireframeColor = Utils.getColorV3FromString(GlobalSettings.Instance.wireframeColor)
        this.localSelectedColor = Utils.getColorV3FromString(GlobalSettings.Instance.localSelectedColor)

        this.materials.visibleWireframe.visible = GlobalSettings.Instance.wireframeOpacity !== 0
    }
}