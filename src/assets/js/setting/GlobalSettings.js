class GlobalSettings {
    static get Instance() {
      if (!this._instance) {
        this._instance = new GlobalSettings()
      }
      return this._instance
    }
  
    // scene
    backgroundColor = '#52576e'
    ambientLightColor = '#333333'
    lightColor = '#aaaaaa'
    // app
    surfaceInsideColor = '#ffff00'
    surfaceOutsideColor = '#898787'
    localSelectedColor = '#ffffff'
    surfaceTransparentColor = '#8dbf6b'
    surfaceRenderOrder = 0
  
    wireframeColor = '#000000'
    wireframeOpacity = 0.35
    wireframeAlpha = 1
    wireframeRenderOrder = 10
    wireframeSelectedColor = '#ffffff'
    wireframeSelectedRenderOrder = 11
    //
    drawLineColor = '#ff0000'
    drawLineHelperRenderOrder = 12
    selectHelperColor = '#ffffff'
    selectionPointColor = '#ff0000'
  
    // keyboard
    /**
     * 鼠标多选
     */
    keyMultiSelect = 'ShiftLeft'
    /**
     * 控制器启动
     */
    keyControl = 'ControlLeft'
  
    // mouse
  
    mouseSelectKey = 0 // 左键
    mouseUnselectKey = 2 // 右键
  }
  