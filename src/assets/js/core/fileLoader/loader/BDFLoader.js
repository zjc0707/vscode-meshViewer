class BDFLoader {
  /**
   * 
   * @param {string} data 
   * @returns 
   */
  static load(data) {
    const vertices = [],
      cells = [],
      cellTypes = [],
      cellIndexToGroup = [],
      groupNames = [],
      groupIds = new Set()

    const lines = data.split('\n').map(l => {
      if (l.includes('\r')) {
        return l.substring(0, l.indexOf('\r'))
      }
      return l
    })

    /** @type {number[]} */
    let cellArr = []

    /**
     * 
     * @param {string} line 
     */
    const addCellFromLine = (line) => {
      const index = Number.parseInt(stringSubByLength(line, 1)) - 1
      const groupIndex = Number.parseInt(stringSubByLength(line, 2)) - 1
      cellIndexToGroup[index] = groupIndex
      groupIds.add(groupIndex)

      cellArr = []
      const count = Math.floor(line.length / 8)
      for (let i = 3; i < count; i++) {
        cellArr.push(Number.parseInt(stringSubByLength(line, i)) - 1)
      }
      cells[index] = cellArr

      switch (stringSubByLength(line, 0)) {
        case 'CHEXA':
          cellTypes[index] = CELL_TYPE.HEX
          break
        case 'CQUAD4':
          cellTypes[index] = CELL_TYPE.QUAD
          break
        case 'CTRIA3':
          cellTypes[index] = CELL_TYPE.TRIANGLE
          break
        case 'CTETRI':
          cellTypes[index] = CELL_TYPE.TETRA
          break
      }
    }

    for (const line of lines) {
      switch (stringSubByLength(line, 0)) {
        case 'GRID':
          vertices[Number.parseInt(stringSubByLength(line, 1)) - 1] = new THREE.Vector3(
            parseFloat(stringSubByLength(line, 3)),
            parseFloat(stringSubByLength(line, 4)),
            parseFloat(stringSubByLength(line, 5))
          )
          break
        case 'CQUAD4':
        case 'CHEXA':
        case 'CTRIA3':
        case 'CTETRI':
          addCellFromLine(line)
          break
        case '+':
          cellArr.push(...[1, 2].map(p => Number.parseInt(stringSubByLength(line, p)) - 1))
          break
        case '$HMNAME PROP': {
          const groupIndex = Number.parseInt(stringSubByLength(line, 3)) - 1
          let s = stringSubByLength(line, 4)
          s = s.includes('"') ? s.substring(s.indexOf('"') + 1, s.lastIndexOf('"')) : s
          groupNames[groupIndex] = s
        }
          break
      }
    }

    return {
      vertices,
      cells,
      cellIndexToGroup,
      cellTypes,
      groupNames: groupNames,
      groupIds: Array.from(groupIds),
      stpFaces: []
    }

    function parseFloat(s) {
      if (!s.includes('e')) {
        const s1 = s.substring(0, 1)
        const s2 = s.substring(1).replace('-', 'e-').replace('+', 'e+')
        s = s1 + s2
      }
      return Number.parseFloat(s)
    }
  }
}

function stringSubByLength(value, index, length = 8) {
  return value.substr(index * length, length).trim()
}