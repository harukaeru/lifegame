
// field: { width: 30, height: 30 }
const createBoard = (mountElement, field) => {
  for (let i = 0; i < field.height; i++) {
    const row = document.createElement('div')
    row.className = 'row'
    row.setAttribute('data-row-num', i)
    mountElement.appendChild(row)

    for (let j = 0; j < field.width; j++) {
      const cell = document.createElement('div')
      cell.className = 'cell'
      cell.setAttribute('data-row', i)
      cell.setAttribute('data-column', j)
      cell.setAttribute('data-alive', false)
      if (field.height - 1 === j) {
        cell.className += ' last-cell'
      }
      if (field.width - 1 === i) {
        cell.className += ' last-row'
      }
      row.appendChild(cell)
    }
  }
}

// set
const getElem = (columnIndex, rowIndex) => {
  return document.querySelector(`[data-column="${columnIndex}"][data-row="${rowIndex}"]`)
}

const setAlive = (isAlive, columnIndex, rowIndex) => {
  const elem = getElem(columnIndex, rowIndex)
  elem.setAttribute('data-alive', isAlive)
}

const getAlive = (columnIndex, rowIndex) => {
  const elem = getElem(columnIndex, rowIndex)

  return elem.getAttribute('data-alive')
}

// rule
// xxx
// xox
// xxx

const calcNext = (columnIndex, rowIndex, field) => {
  let impossible_index_list = []
  if (rowIndex === 0) {
    // 1,2,3は無理
    impossible_index_list = impossible_index_list.concat([1, 2, 3])
  }
  if (columnIndex === 0) {
    // 1,4,7は無理
    impossible_index_list = impossible_index_list.concat([1, 4, 7])
  }
  if (columnIndex === field.width - 1) {
    // 3,6,9は無理
    impossible_index_list = impossible_index_list.concat([3, 6, 9])
  }
  if (rowIndex === field.height - 1) {
    // 7.8,9は無理
    impossible_index_list = impossible_index_list.concat([7, 8, 9])
  }

  const impossible_list = Array.from(new Set(impossible_index_list))
  const neighbors = [1,2,3,4,6,7,8,9].filter(a => !impossible_list.includes(a))
  const alives = neighbors.map(neighbor => {
    if (neighbor === 1) {
      return getAlive(columnIndex - 1, rowIndex - 1)
    } else if (neighbor === 2) {
      return getAlive(columnIndex, rowIndex - 1)
    } else if (neighbor === 3) {
      return getAlive(columnIndex + 1, rowIndex - 1)
    } else if (neighbor === 4) {
      return getAlive(columnIndex - 1, rowIndex)
    } else if (neighbor === 6) {
      return getAlive(columnIndex + 1, rowIndex)
    } else if (neighbor === 7) {
      return getAlive(columnIndex - 1, rowIndex + 1)
    } else if (neighbor === 8) {
      return getAlive(columnIndex, rowIndex + 1)
    } else if (neighbor === 9) {
      return getAlive(columnIndex + 1, rowIndex + 1)
    }
  })

  const aliveCount = alives.filter(alive => alive === 'true').length

  const pos6Alive = getAlive(columnIndex, rowIndex)
  if (pos6Alive === 'true') {
    if (aliveCount == 2 || aliveCount == 3) {
      return true
    }
    return false
  }

  if (aliveCount === 3) {
    return true
  }

  return false
}

const calc = (field) => {
  const nextGeneration = []

  for (let i = 0; i < field.height; i++) {
    const row = []
    nextGeneration.push(row)
    for (let j = 0; j < field.width; j++) {
      row.push(calcNext(j, i, field))
    }
  }

  return nextGeneration
}

const render = (data) => {
  for (let i = 0; i < data.length; i++) {
    for (let j = 0; j < data[i].length; j++) {
      setAlive(data[i][j], j, i)
    }
  }
}

const next = () => {
  const data = calc({ width: 20, height: 20 })
  render(data)
}

const initialize = () => {
  createBoard(document.getElementById('root'), { width: 20, height: 20 })
}

initialize()

setAlive(true, 1, 0)
setAlive(true, 2, 1)
setAlive(true, 0, 2)
setAlive(true, 1, 2)
setAlive(true, 2, 2)

const nnext = (count) => {
  if (count === 0) {
    return
  }

  setTimeout(() => {
    next()
    nnext(count - 1)
  }, 300)
}


nnext(100)
