class OBJLoader {
    /**
     * 
     * @param {string} data 
     * @returns 
     */
    static load(data) {
      const vertices = [],
        cells = [],
        cellTypes = [],
        cellIndexToGroup = []
  
      const lines = data.split('\n').map(l => {
        if (l.includes('\r')) {
          return l.substring(0, l.indexOf('\r'))
        }
        return l
      })
  
      for (const line of lines) {
        const ss = line.split(' ').filter(p => p.length !== 0)
        if (ss.length === 0) {continue}
  
        switch (ss[0]) {
          case 'v':
            vertices.push(new THREE.Vector3(Number.parseFloat(ss[1]), Number.parseFloat(ss[2]), Number.parseFloat(ss[3])))
            break
          case 'f':
            cells.push(ss.slice(1).map(p => Number.parseInt(p) - 1))
            switch (cells[cells.length - 1].length) {
              case 3:
                cellTypes.push(CELL_TYPE.TRIANGLE)
                break
              case 4:
                cellTypes.push(CELL_TYPE.QUAD)
                break
            }
            cellIndexToGroup.push(0)
        }
      }
  
      return {
        vertices,
        cells,
        cellTypes,
        cellIndexToGroup,
        groupIds: [0],
        groupNames: [],
        stpFaces: []
      }
    }
  }
  