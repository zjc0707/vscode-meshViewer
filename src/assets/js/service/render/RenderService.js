class RenderService {
    static get Instance() {
        if (!this._i) {
            this._i = new RenderService()
        }
        return this._i
    }

    /**
     * 
     * @param {Render} render 
     * @param {HTMLElement} container 
     */
    init(render, container) {
        const data = new RenderThreeJsData(container)
        console.log(data)
        this.data = data
        this.render = render

        const requestFunction = () => {
            const data = this.data
            const apps = Publisher.Instance.getAppNeedUpdate()
            if (apps.length > 0) {
                console.time('app update')
                console.log('length', apps.length)
                apps.forEach(p => {
                    AppService.Instance.update(p)
                    RenderDataService.Instance.needRender(data)
                })
                console.timeEnd('app update')
            }

            RenderDataService.Instance.renderAll(data)
            requestAnimationFrame(requestFunction)
        }

        requestFunction()
    }

    needRender() {
        RenderDataService.Instance.needRender(this.data)
    }
}