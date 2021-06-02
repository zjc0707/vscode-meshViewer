class LoadFileReceiver {
    /**
     * 
     * @param {string} fileContext 
     * @param {string} fileName
     */
    constructor(fileContext, fileName) {
        this.fileContext = fileContext
        this.fileName = fileName
        this.renderThreeJsData = RenderService.Instance.data
    }

    do() {
        let isStp = false
        switch (this.fileName.split('.').pop()?.toLowerCase()) {
            case 'stp':
            case 'step':
                isStp = true
                break
        }

        const r = new CreateAppsFromFileReceiver(
            this.fileContext,
            this.fileName,
            isStp
        )

        r.do()

        const apps = r.apps
        if (apps.length === 0) {
            RenderController.Instance.progress({ status: 'failure', msg: 'create fail' })
            return
        }

        const r1 = new SetCameraAxisReceiver([0, 0, 1], AppService.Instance.getAABB(...apps))
        r1.do()
        RenderController.Instance.progress({ status: 'success' })
    }
}