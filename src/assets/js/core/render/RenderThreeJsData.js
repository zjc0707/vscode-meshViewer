class RenderThreeJsData {
    /** @type {THREE.Vector3[]} */
    vertices = []
    /** @type {App[][]} */
    vertexIndexToApp = []

    /** @type {HTMLCanvasElement} */
    get canvas() {
        return this.renderer.domElement
    }

    /**
     * 
     * @param {HTMLElement} container 
     */
    constructor(container) {
        this.renderer = new THREE.WebGLRenderer({
            antialias: true,
            alpha: true
        })
        this.renderer.autoClear = false
        this.renderer.autoClearDepth = false
        this.renderer.setSize(container.clientWidth, container.clientHeight)
        if (container.childNodes && container.childNodes.length > 0) {
            const len = container.childNodes.length
            for (let i = len - 1; i >= 0; i--) {
                container.removeChild(container.childNodes[i])
            }
        }

        container.appendChild(this.renderer.domElement)
        this.renderer.domElement.style.width = '100%'
        this.renderer.domElement.style.height = '100%'
        this.perspectiveCamera = new THREE.PerspectiveCamera(70, 1, 0.1, 2000)
        this.orthographicCamera = new THREE.OrthographicCamera(0, 0, 0, 0, 0.1, 2000)
        this.camera = this.perspectiveCamera
        this.cameraTarget = new THREE.Vector3()
        Utils.updateCamera(this.camera, this.canvas.clientWidth, this.canvas.clientHeight)

        /**
         * trackballControls
         */
        this.trackballControls = new TrackballControls(this.camera, this.canvas)
        this.trackballControls.staticMoving = true
        this.trackballControls.rotateSpeed = 10
        this.trackballControls.panSpeed = 5
        this.trackballControls.target.set(0, 5, 0)
        this.trackballControls.enabled = true
        this.trackballControls.update()
        this.trackballControls.addEventListener('change', () => {
            this.needRender = true
        })

        /**
         * scene
         */
        this.scene = new THREE.Scene()
        this.scene.background = new THREE.Color(GlobalSettings.Instance.backgroundColor)
        this.ambientLight = new THREE.AmbientLight(GlobalSettings.Instance.ambientLightColor)
        this.pointLight = new THREE.PointLight(GlobalSettings.Instance.lightColor)
        this.scene.add(this.ambientLight)
        this.scene.add(this.pointLight)

        window.addEventListener('resize', () => {
            RenderDataService.Instance.onWindowResize(this)
        })

        /**
         * viewHelper
         */

        this.viewHelper = new ViewHelper(this.camera, container, this.trackballControls)
    }
}