class AppGroupService {
    static get Instance() {
        if (!this._i) {
            this._i = new AppGroupService()
        }
        return this._i
    }

    /**
     * @param {AppGroup} target 
     * @param {AppGroup | App} p 
     */
    addChild(target, p) {
        if (p.parent) {
            this.removeChild(p.parent, p)
        }
        target.children.push(p)
        p.parent = target
    }

    /**
     * @param {AppGroup} target 
     * @param {AppGroup | App} p 
     */
    removeChild(target, p) {
        const index = target.children.indexOf(p)
        if (index === -1) { return }
        target.children.splice(index, 1)
        p.parent = undefined
    }
}