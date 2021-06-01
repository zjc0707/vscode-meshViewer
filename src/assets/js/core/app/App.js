class App {
  name = ''
  fileType = FILE_TYPE.TRI
  // 渲染时顶点法向量使用面法向/平均相邻面法向
  isNormalFace = true
  originName = 'app'

  deleteFlag = false

  _visible = true
  get visible() {
    return this._visible
  }

  set visible(v) {
    const data = AppService.Instance.getData(this)
    data.renderables.visible.surface.visible = v
    data.renderables.visible.wireframe.visible = v
    data.renderables.visible.wireframeSelected.visible = false
    this._visible = v
  }

  /**
   * 对应的threeJs模型是否已经存在
   */
  isMeshBuilt = false
  isFromStp = false
  isSelected = false

  /**
   * 
   * @param {Part} parent 
   */
  constructor(parent) {
    AppGroupService.Instance.addChild(parent, this)
    this.parent = parent

    AppService.Instance.initData(this)
  }

  toString() {
    return AppService.Instance.getUUID(this)
  }
}
