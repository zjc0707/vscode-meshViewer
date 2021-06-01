class RenderController {
    static get Instance() {
        if (!this._i) {
            this._i = new RenderController()
        }
        return this._i
    }

    /**
     * 
     * @param {HTMLElement} container 
     */
    init(container) {
        console.log('init')
        RenderService.Instance.init(new Render(), container)
    }

    loadFile(fileContext, fileName) {
        console.log('loadFile')
        const r = new LoadFileReceiver(fileContext, fileName)
        r.do()
    }
}
