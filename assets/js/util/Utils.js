const _lut = [];

for ( let i = 0; i < 256; i ++ ) {

	_lut[ i ] = ( i < 16 ? '0' : '' ) + ( i ).toString( 16 );

}

class Utils {
    static getUUID() {
        const d0 = Math.random() * 0xffffffff | 0;
		const d1 = Math.random() * 0xffffffff | 0;
		const d2 = Math.random() * 0xffffffff | 0;
		const d3 = Math.random() * 0xffffffff | 0;
		const uuid = _lut[ d0 & 0xff ] + _lut[ d0 >> 8 & 0xff ] + _lut[ d0 >> 16 & 0xff ] + _lut[ d0 >> 24 & 0xff ] + '-' +
			_lut[ d1 & 0xff ] + _lut[ d1 >> 8 & 0xff ] + '-' + _lut[ d1 >> 16 & 0x0f | 0x40 ] + _lut[ d1 >> 24 & 0xff ] + '-' +
			_lut[ d2 & 0x3f | 0x80 ] + _lut[ d2 >> 8 & 0xff ] + '-' + _lut[ d2 >> 16 & 0xff ] + _lut[ d2 >> 24 & 0xff ] +
			_lut[ d3 & 0xff ] + _lut[ d3 >> 8 & 0xff ] + _lut[ d3 >> 16 & 0xff ] + _lut[ d3 >> 24 & 0xff ];

		// .toUpperCase() here flattens concatenated strings to save heap memory space.
		return uuid.toUpperCase();
    }

    static getColorHexString() {
        return `#${new THREE.Color(0xffffff * Math.random()).getHexString()}`
    }

    /**
     * 
     * @param {number | string} s 
     * @returns 
     */
    static getColorV3FromString(s) {
        const _c = new THREE.Color(s)
        return new THREE.Vector3(_c.r, _c.g, _c.b)
    }

    /**
     * 
     * @param {THREE.PerspectiveCamera | THREE.OrthographicCamera} camera 
     * @param {number} width 
     * @param {number} height 
     */
    static updateCamera(camera, width, height) {
        if (camera instanceof THREE.PerspectiveCamera) {
          camera.aspect = width / height
        } else {
          camera.left = -width / 2
          camera.right = width / 2
          camera.top = height / 2
          camera.bottom = -height / 2
        }
        camera.updateProjectionMatrix()
      }
}