class SetCameraAxisReceiver {
    constructor(v, aabb) {
        console.log('SetCameraAxisReceiver')
        this.newVal = v
        this.aabb = aabb ?? AppService.Instance.getAABB(...RenderService.Instance.render.apps)
        console.log(aabb)
        this.r = new SetCameraDataReceiver(this.frameArea())
    }

    do() {
        this.r.do()
    }

    frameArea() {
        const box = this.aabb
        const axis = this.newVal

        const center = box.center
        const boxCenter = new THREE.Vector3(center.x, center.y, center.z)
        const distance = box.diagonal

        const pos = new THREE.Vector3().set(boxCenter.x + axis[0] * distance,
            boxCenter.y + axis[1] * distance,
            boxCenter.z + axis[2] * distance)

        let up
        if (axis[1] === 1) {
            up = new THREE.Vector3(0, 0, -1)
        } else if (axis[1] === -1) {
            up = new THREE.Vector3(0, 0, 1)
        }
        const near = distance / 100
        const far = distance * 100

        return {
            target: boxCenter,
            pos: pos,
            up: up,
            near: near,
            far: far
        }
    }
}