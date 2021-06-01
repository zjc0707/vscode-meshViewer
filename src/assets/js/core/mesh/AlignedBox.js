class AlignedBox {
    constructor() {
        this.min = new THREE.Vector3()
        this.min.setScalar(Number.MAX_SAFE_INTEGER)
        this.max = new THREE.Vector3()
        this.max.setScalar(Number.MIN_SAFE_INTEGER)
    }

    get diagonal() {
        return this.max.distanceTo(this.min)
    }

    get center() {
        return new THREE.Vector3().add(this.min).add(this.max).divideScalar(2)
    }

    get size() {
        return new THREE.Vector3().subVectors(this.max, this.min)
    }

    clear() {
        this.min.setScalar(Number.MAX_SAFE_INTEGER)
        this.max.setScalar(Number.MIN_SAFE_INTEGER)
    }

    extend(...vs) {
        for (const v of vs) {
            this.min.min(v)
            this.max.max(v)
        }
        
        return this
    }
}