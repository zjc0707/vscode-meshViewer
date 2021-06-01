class CreateAppsFromFileReceiver {
    /**
     * 
     * @param {string} fileContext 
     * @param {string} fileName 
     * @param {boolean} isStp 
     */
    constructor(fileContext, fileName, isStp) {
        this.fileContext = fileContext
        this.fileName = fileName
        this.isStp = isStp
        /** @type {App[]} */
        this.apps = []
    }

    do() {
        const fileLoadResult = FileLoader.load(this.fileContext, this.fileName)
        if (!fileLoadResult) { return }

        console.log(fileLoadResult)
        const { vertices, cells, cellTypes, cellIndexToGroup, stpFaces, groupIds, groupNames } = fileLoadResult
        const renderDataVertices = RenderService.Instance.data.vertices
        const start = renderDataVertices.length
        cells.forEach(cell => {
            for (let i = 0; i < cell.length; i++) {
                cell[i] = cell[i] + start
            }
        })

        for (let i = 0; i < vertices.length; i++) {
            renderDataVertices.push(vertices[i])
        }

        for (let i = 0; i < groupIds.length; i++) {
            const groupId = groupIds[i]
            /** @type {number[]} */
            const cellIndexes = []
            cellIndexToGroup.forEach((value, index) => {
                if (value === groupId) {
                    cellIndexes.push(index)
                }
            })

            const createComponentReceiver = new CreateComponentReceiver(groupNames[groupId] ?? this.fileName,
                i === 0 ? GlobalSettings.Instance.surfaceOutsideColor : undefined)
            createComponentReceiver.do()
            const componentOrPart = createComponentReceiver.component
            const part = new Part(componentOrPart)
            const app = new App(part)
            app.isFromStp = this.isStp
            app.isNormalFace = !this.isStp

            const c = cellIndexes.map(p => {
                const c = new Cell(cellTypes[p])
                c.vi.push(...cells[p])
                return c
            })

            AppService.Instance.fromCells(app, c, stpFaces)

            const addAppReceiver = new AddAppReceiver(app)
            addAppReceiver.do()

            this.apps.push(app)
            console.log(this.apps)
        }
    }
}