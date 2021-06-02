class VTKLoader {
    /**
     * 
     * @param {string} data 
     * @returns 
     */
    static load(data) {
        const lines = data.split('\n').map(l => {
            if (l.includes('\r')) {
                return l.substring(0, l.indexOf('\r'))
            }
            return l
        })
        let i = -1

        function EOF() {
            return i >= lines.length
        }

        let versionFunc = version_2

        while (++i < lines.length) {
            if (!lines[i].includes('# vtk DataFile Version')) { continue }
            const version = lines[i].substring(lines[i].lastIndexOf(' ') + 1)
            const supportVersions = ['2.0', '3.0', '4.2']
            if (supportVersions.includes(version)) {
                console.log(`find header: ${lines[i]}`)

                switch (version) {
                    case '4.2':
                        versionFunc = version_4_2
                        break
                }

                break
            } else {
                console.error(`not support version: ${version}, require version: [${supportVersions.join(',')}]`)
                return
            }
        }
        if (EOF()) {
            console.error('not find header')
            return
        }

        while (++i < lines.length) {
            if (lines[i] === 'ASCII') {
                console.log(`find parse type ${lines[i]}`)
                break
            }
        }
        if (EOF()) {
            console.error('not find parse type (ASCII)')
            return
        }

        while (++i < lines.length) {
            if (lines[i].includes('DATASET')) {
                const t = lines[i].split(' ')[1]
                if (t !== 'UNSTRUCTURED_GRID') {
                    console.error(`VTK DATASET '${t}' is not supported`)
                    return
                } else {
                    break
                }
            }
        }
        if (EOF()) {
            console.error('not find DATASET')
            return
        }

        const { vertices, cells, cellTypes } = versionFunc(lines, i)

        if (cellTypes.length !== cells.length) {
            console.error('cell_types.length !== cells.length')
            return
        }

        /** @type {StpFace[]} */
        const stpFaces = []

        while (++i < lines.length) {
            if (lines[i].includes('FACE_LABEL')) {
                const count = Number.parseInt(lines[i].split(' ')[1])
                console.log(`[loader] Reading ${count} face_label..`)
                for (let j = 0; j < count; j++) {
                    const vs = lines[++i].split(' ').map(s => Number.parseInt(s))
                    stpFaces.push([vs[0], vs[1]])
                }
                break
            }
        }

        /** @type {number[]} */
        const cellIndexToGroup = []
        cells.forEach(() => cellIndexToGroup.push(0))

        return {
            vertices,
            cells,
            cellTypes,
            stpFaces,
            cellIndexToGroup,
            groupIds: [0],
            groupNames: []
        }
    }
}

/**
 * 
 * @param {string[]} lines 
 * @param {number} i 
 * @returns 
 */
function version_2(lines, i) {
    const vertices = [],
        cells = [],
        cellTypes = []

    while (++i < lines.length) {
        if (lines[i].includes('POINTS')) {
            const count = Number.parseInt(lines[i].split(' ')[1])
            console.log(`[loader] Reading ${count} vertices..`)
            for (let j = 0; j < count; j++) {
                i++
                const s = lines[i].split(' ').map(p => Number.parseFloat(p))
                vertices.push(new THREE.Vector3(s[0], s[1], s[2]))
            }
            break
        }
    }

    while (++i < lines.length) {
        if (lines[i].includes('CELLS')) {
            const count = Number.parseInt(lines[i].split(' ')[1])
            console.log(`[loader] Reading ${count} cells..`)
            for (let j = 0; j < count; j++) {
                i++
                /** @type {number[]} */
                const arr = []
                lines[i].split(' ')
                    .splice(1)
                    .filter(s => s !== '')
                    .forEach(s => arr.push(Number.parseInt(s)))
                cells.push(arr)
            }
            break
        }
    }

    while (++i < lines.length) {
        if (lines[i].includes('CELL_TYPES')) {
            const count = Number.parseInt(lines[i].split(' ')[1])
            console.log(`[loader] Reading ${count} cell_types..`)
            for (let j = 0; j < count; j++) {
                cellTypes.push(Number.parseInt(lines[++i]))
            }
            break
        }
    }

    return { vertices, cells, cellTypes }
}

function version_4_2(lines, i) {
    const vertices = [],
        cells = [],
        cellTypes = []

    while (++i < lines.length) {
        if (lines[i].includes('POINTS')) {
            const count = Number.parseInt(lines[i].split(' ')[1])
            console.log(`[loader] Reading ${count} vertices..`)

            i++
            const vs = lines[i].split(' ').map(p => Number.parseFloat(p))
            for (let j = 0; j < vs.length; j += 3) {
                vertices.push(new THREE.Vector3(vs[j], vs[j + 1], vs[j + 2]))
            }

            break
        }
    }

    while (++i < lines.length) {
        if (lines[i].includes('CELLS')) {
            console.log(`[loader] Reading ${Number.parseInt(lines[i].split(' ')[1])} cells..`)

            const count = Number.parseInt(lines[i].split(' ')[1])
            for (let j = 0; j < count; j++) {
                const vl = Number.parseInt(lines[++i])
                const arr = []
                for (let k = 0; k < vl; k++) {
                    arr.push(Number.parseInt(lines[++i]))
                }
                cells.push(arr)
            }

            break
        }
    }

    while (++i < lines.length) {
        if (lines[i].includes('CELL_TYPES')) {
            const count = Number.parseInt(lines[i].split(' ')[1])
            console.log(`[loader] Reading ${count} cell_types..`)
            for (let j = 0; j < count; j++) {
                cellTypes.push(Number.parseInt(lines[++i]))
            }
            break
        }
    }

    return { vertices, cells, cellTypes }
}
