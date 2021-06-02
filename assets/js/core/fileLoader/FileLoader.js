class LoadFileResult {
    /** @type {THREE.Vector3} */
    vertices
    /** @type {number[][]} */
    cells
    /** @type {number[]} */
    cellTypes
    /** @type {number[]} */
    cellIndexToGroup
    /** @type {string[]} */
    groupNames
    /** @type {number[]} */
    groupIds
    /** @type {StpFace[]} */
    stpFaces
}

class FileLoader {
    /**
     * 
     * @param {string} fileContext 
     * @param {string} fileName 
     * @returns {LoadFileResult}
     */
    static load(fileContext, fileName) {
        const suffix = fileName.substring(fileName.lastIndexOf('.') + 1).toLowerCase()
        switch (suffix) {
            case 'vtk': return VTKLoader.load(fileContext)
            case 'bdf': return BDFLoader.load(fileContext)
            // case 'stp':
            // case 'step':
            //     return OCCService.Instance.loadSTEP(file)
            case 'obj':
                return OBJLoader.load(fileContext)
        }
    }
}