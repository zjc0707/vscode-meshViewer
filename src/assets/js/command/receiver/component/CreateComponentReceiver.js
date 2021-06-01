class CreateComponentReceiver {
    /**
     * 
     * @param {string} name 
     * @param {string} color 
     */
    constructor(name, color) {
        this.component = new Component(name, color)
        const render = RenderService.Instance.render
        this.components = render.components
    }

    do() {
        this.components.push(this.component)
    }
}