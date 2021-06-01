class AppGroup {
    /**
     * @type {AppGroup | undefined}
     */
    parent = undefined
    /**
     * @type {(AppGroup | App)[]}
     */
    children = []

    /**
     * @param {string} name 
     * @param {'component' | 'part'} type 
     */
    constructor(name, type) {
        this.uuid = Utils.getUUID()
        this.name = name
        this.type = type
    }
}

class Part extends AppGroup {
    /**
     * @type {App[]}
     */
    children = []

    /**
     * 
     * @param {Component} parent 
     */
    constructor(parent) {
        super('part', 'part')
        AppGroupService.Instance.addChild(parent, this)
        this.parent = parent
    }
}

class Component extends AppGroup {
    /**
     * @type {Part[]}
     */
    children = []

    /**
     * 
     * @param {string} name 
     * @param {string} color 
     */
    constructor(name, color) {
        super(name, 'component')
        this.color = color ?? Utils.getColorHexString()
    }
}