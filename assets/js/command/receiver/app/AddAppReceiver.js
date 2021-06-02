class AddAppReceiver {
    /**
     * 
     * @param {App} app 
     * @param {boolean} visible 
     */
    constructor(app, visible = true) {
        this.app = app
        this.visible = visible
    }

    do() {
        this.app.visible = this.visible
        const render = RenderService.Instance.render
        const renderData = RenderService.Instance.data
        const appData = AppService.Instance.getData(this.app)

        renderData.scene.add(appData.group)
        render.apps.push(this.app)

        console.log(renderData)
    }
}