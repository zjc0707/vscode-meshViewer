class Materials {
    visibleSurface = new THREE.MeshLambertMaterial({
        vertexColors: true,
        name: 'visible_surface',
        color: 0xffffff,
        side: THREE.DoubleSide
    })

    visibleWireframe = new THREE.LineBasicMaterial({
        vertexColors: true
    })

    dispose() {
        this.visibleWireframe.dispose()
        this.visibleSurface.dispose()
    }
}