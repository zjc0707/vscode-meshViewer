const FILE_TYPE = {
    STP: 'STP',
    TRI: 'TRI',
    QUAD: 'QUAD',
    TET: 'TET',
    HEX: 'HEX',
    WEDGE: 'WEDGE',
    PYRAMID: 'PYRAMID',
    HEXDOM: 'HEXDOM'
}

const FILE_CLAZZ = {
    GEOMETRY: 'GEOMETRY',
    GRID: 'GRID',
    VOLUME_GRID: 'VOLUME_GRID',
    SHELL_GRID: 'SHELL_GRID'
}

/**
 * 
 * @param {string} type 
 * @param {string} clazz 
 * @returns 
 */
function matchFileTypeToClass(type, clazz) {
    let condition
    switch (clazz) {
        case FILE_CLAZZ.GEOMETRY:
            condition = [[FILE_TYPE.STP], true]
            break
        case FILE_CLAZZ.GRID:
            condition = [[FILE_TYPE.STP], false]
            break
        case FILE_CLAZZ.SHELL_GRID:
            condition = [[FILE_TYPE.TRI, FILE_TYPE.QUAD], true]
            break
        case FILE_CLAZZ.VOLUME_GRID:
            condition = [[FILE_TYPE.TET, FILE_TYPE.HEX, FILE_TYPE.WEDGE, FILE_TYPE.PYRAMID, FILE_TYPE.HEXDOM], true]
            break
    }

    return condition[0].includes(type) === condition[1]
}

/**
 * 
 * @param {number} cellType 
 * @returns 
 */
function cellTypeToFileType(cellType) {
    switch (cellType) {
      case CELL_TYPE.TRIANGLE:
        return FILE_TYPE.TRI
      case CELL_TYPE.QUAD:
        return FILE_TYPE.QUAD
      case CELL_TYPE.PYRAMID:
        return FILE_TYPE.PYRAMID
      case CELL_TYPE.TETRA:
        return FILE_TYPE.TET
      case CELL_TYPE.HEX:
        return FILE_TYPE.HEX
      case CELL_TYPE.WEDGE:
        return FILE_TYPE.WEDGE
    }
  }