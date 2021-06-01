class Render {
    constructor() {
        this.uuid = Utils.getUUID()
        /** @type {Component[]} */
        this.components = []
        /** @type {App[]} */
        this.apps = []
    }
}