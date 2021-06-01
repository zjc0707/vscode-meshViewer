class RenderDataService {
    static get Instance() {
        if (!this._i) {
            this._i = new RenderDataService()
        }
        return this._i
    }

    /**
     * 
     * @param {RenderThreeJsData} target 
     */
    needRender(target) {
        target.needRender = true
    }

    /**
     * 
     * @param {RenderThreeJsData} target 
     */
    renderAll(target) {
        target.renderer.clear()
        target.pointLight.position.copy(target.camera.position)

        target.renderer.render(target.scene, target.camera)
        target.needRender = false

        target.viewHelper.render(target.renderer)
        // if (target.needRender) {

        // }

        if (target.trackballControls.enabled) {
            target.trackballControls.update()
        }
    }

    /**
     * 
     * @param {RenderThreeJsData} data 
     */
    updateCamera(data) {
        Utils.updateCamera(data.perspectiveCamera, data.canvas.clientWidth, data.canvas.clientHeight)
        const d = Math.tan(data.perspectiveCamera.fov / 2 * Math.PI / 180) * 2
        const z = data.perspectiveCamera.position.distanceTo(data.cameraTarget)
        const height = d * z
        const width = height * data.perspectiveCamera.aspect
        Utils.updateCamera(data.orthographicCamera, width, height)
    }

    /**
     * 
     * @param {RenderThreeJsData} data 
     */
    onWindowResize(data) {
        data.canvas.style.width = '100%'
        data.canvas.style.height = '100%'
        this.updateCamera(data)
        data.renderer.setSize(data.canvas.clientWidth, data.canvas.clientHeight)
        this.needRender(data)
    }
}