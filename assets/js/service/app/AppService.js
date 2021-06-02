class AppService {
    static get Instance() {
        if (!this._i) {
            this._i = new AppService()
        }
        return this._i
    }

    /** @type {Map<App, AppThreeJSData>()} */
    appToData = new Map()

    /**
     * 
     * @param {App} app 
     */
    initData(app) {
        const data = new AppThreeJSData(app.parent.parent.color)
        this.appToData.set(app, data)
        return data
    }

    /**
     * 
     * @param {App} app 
     */
    getData(app) {
        return this.appToData.get(app)
    }

    /**
     * 
     * @param {App} app 
     * @returns {string}
     */
    getUUID(app) {
        const data = this.getData(app)
        return data.renderables.visible.surface.uuid
    }

    /**
     * 
     * @param  {...App} apps 
     * @returns 
     */
    getAABB(...apps) {
        const rs = new AlignedBox()
        for (const app of apps) {
            const aabb = this.getData(app).mesh.aabb
            rs.extend(aabb.min, aabb.max)
        }
        return rs
    }

    /**
     * 
     * @param {App} app 
     * @param {Cell[]} array 
     * @param {StpFace[]} stpFaces 
     */
    fromCells(app, array, stpFaces) {
        const data = this.getData(app)
        /** @type {number[][]} */
        const cells = []
        /** @type {Set<number>()} */
        const vertexIndexes = new Set()
        /** @type {number[]} */
        const cellTypes = []
        for (const cell of array) {
            cells.push(cell.vi)
            cell.vi.forEach(v => vertexIndexes.add(v))
            cellTypes.push(cell.type)
        }

        AppDataService.Instance.buildData(app, data, Array.from(vertexIndexes), cells, cellTypes, stpFaces)
    }

    /**
     * 
     * @param {AppNeedUpdateOption} option 
     */
    needUpdate(option) {
        if (!option.app.isMeshBuilt) { return }
        Publisher.Instance.addAppNeedUpdate(option)
    }

    /**
     * 
     * @param {AppNeedUpdateOption} option 
     */
    update(option) {
        AppDataService.Instance.updateApp(option)
    }

}