class CameraData {
    /** @type {THREE.Vector3} */
    target
    /** @type {THREE.Vector3} */
    pos
    /** @type {THREE.Vector3} */
    up
    /** @type {number} */
    near
    /** @type {number} */
    far
}

class SetCameraDataReceiver {
    /**
     * 
     * @param {CameraData} newVal 
     * @param {CameraData | undefined} oldVal 
     * @param {boolean} setTarget 
     */
    constructor(newVal, oldVal, setTarget = true) {
        this.newVal = newVal
        this.oldVal = oldVal ?? SetCameraDataReceiver.getData()
        this.renderData = RenderService.Instance.data
        this.setTarget = setTarget
    }

    do() {
        this.setData(this.newVal)
    }

    /**
     * 
     * @param {CameraData} cameraData 
     */
    setData(cameraData) {
        const data = this.renderData

        data.trackballControls.object = data.camera
        data.trackballControls.reset()

        data.cameraTarget.copy(cameraData.target)
        data.camera.position.copy(cameraData.pos)
        if (cameraData.up) {
            data.camera.up.copy(cameraData.up)
        }
        data.camera.near = cameraData.near
        data.camera.far = cameraData.far
        data.camera.updateProjectionMatrix()
        data.camera.lookAt(cameraData.target)

        data.trackballControls.maxDistance = cameraData.far
        data.trackballControls.target.copy(cameraData.target)
        data.trackballControls.update()

        data.viewHelper.editorCamera = data.camera

        RenderDataService.Instance.onWindowResize(data)
    }

    /**
     * 
     * @returns {CameraData}
     */
    static getData() {
        const renderData = RenderService.Instance.data
        const camera = renderData.camera
        return {
            target: renderData.trackballControls.target.clone(),
            pos: camera.position.clone(),
            up: camera.up.clone(),
            near: camera.near,
            far: camera.far
        }
    }



}