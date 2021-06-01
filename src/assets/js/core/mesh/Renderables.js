class Renderables {
    /**
     * 
     * @param {Buffers} buffers 
     * @param {Materials} materials 
     */
    constructor(buffers, materials) {
      const surface = new THREE.Mesh(buffers.surface, materials.visibleSurface)
      surface.renderOrder = GlobalSettings.Instance.surfaceRenderOrder
  
      const wireframe = new THREE.LineSegments(buffers.wireframe, materials.visibleWireframe)
      wireframe.renderOrder = GlobalSettings.Instance.wireframeRenderOrder
  
      const wireframeSelected = new THREE.LineSegments(buffers.wireframeSelected, materials.visibleWireframe)
      wireframeSelected.renderOrder = GlobalSettings.Instance.wireframeSelectedRenderOrder
      wireframeSelected.visible = false
  
      this.visible = {
        surface: surface,
        wireframe: wireframe,
        wireframeSelected: wireframeSelected
      }
    }
  }
  