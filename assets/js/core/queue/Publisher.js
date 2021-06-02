class AppNeedUpdateOption {
    /** @type {App} */
    app
    /** @type {'all' | 'surfaceColor' | 'wireframeColor' | 'wireframeSelectedColor' | 'surfaceNormal'} */
    type
}

class Publisher {
    static get Instance() {
        if (!this._instance) {
            this._instance = new Publisher()
        }
        return this._instance
    }

    /** @type {Map<string, string>()} */
    map = new Map()
    /** @type {App[]} */
    appNeedUpdateQueue = []
    /** @type {Set<App>()} */
    appNeedRebuildQueue = new Set()

    /**
     * 
     * @param {AppNeedUpdateOption} option 
     * @returns 
     */
    addAppNeedUpdate(option) {
        const uuid = AppService.Instance.getUUID(option.app)
        const s = this.map.get(uuid)
        if (s) {
            if (option.type === 'all') {
                this.map.set(uuid, option.type)
            }
            return
        }
        this.map.set(uuid, option.type)
        this.appNeedUpdateQueue.push(option.app)
    }

    /**
     * 
     * @returns {AppNeedUpdateOption[]}
     */
    getAppNeedUpdate() {
        const arr = this.appNeedUpdateQueue.map(p => {
            return {
                app: p,
                type: this.map.get(AppService.Instance.getUUID(p))
            }
        })
        this.appNeedUpdateQueue.length = 0
        this.map.clear()
        return arr
    }
}