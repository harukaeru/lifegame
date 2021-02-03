
// State Management
const CellState = {
  ALIVE: 1,
  DEAD: 0,
}

const createInitialGeneration = (field) => {
  const rows = []
  for (let i = 0; i < field.height; i++) {
    const row = []
    rows.push(row)
    for (let j = 0; j < field.width; j++) {
      row.push(CellState.DEAD)
    }
  }
  return rows
}

const getCellState = (generation, columnIndex, rowIndex) => {
  return generation[rowIndex][columnIndex]
}

const setCellState = (generation, cellState, columnIndex, rowIndex) => {
  generation[rowIndex][columnIndex] = cellState
  renderAliveInBoard(cellState, columnIndex, rowIndex)
}

// rule
// xxx
// xox
// xxx

const calcNextCellState = (columnIndex, rowIndex, currentGeneration) => {
  let impossible_index_list = []
  if (rowIndex === 0) {
    // 1,2,3は無理
    impossible_index_list = impossible_index_list.concat([1, 2, 3])
  }
  if (columnIndex === 0) {
    // 1,4,7は無理
    impossible_index_list = impossible_index_list.concat([1, 4, 7])
  }
  if (columnIndex === currentGeneration[0].length - 1) {
    // 3,6,9は無理
    impossible_index_list = impossible_index_list.concat([3, 6, 9])
  }
  if (rowIndex === currentGeneration.length - 1) {
    // 7.8,9は無理
    impossible_index_list = impossible_index_list.concat([7, 8, 9])
  }

  const impossible_list = Array.from(new Set(impossible_index_list))
  const neighbors = [1,2,3,4,6,7,8,9].filter(a => !impossible_list.includes(a))
  const alives = neighbors.map(neighbor => {
    if (neighbor === 1) {
      return getCellState(currentGeneration, columnIndex - 1, rowIndex - 1)
    } else if (neighbor === 2) {
      return getCellState(currentGeneration, columnIndex, rowIndex - 1)
    } else if (neighbor === 3) {
      return getCellState(currentGeneration, columnIndex + 1, rowIndex - 1)
    } else if (neighbor === 4) {
      return getCellState(currentGeneration, columnIndex - 1, rowIndex)
    } else if (neighbor === 6) {
      return getCellState(currentGeneration, columnIndex + 1, rowIndex)
    } else if (neighbor === 7) {
      return getCellState(currentGeneration, columnIndex - 1, rowIndex + 1)
    } else if (neighbor === 8) {
      return getCellState(currentGeneration, columnIndex, rowIndex + 1)
    } else if (neighbor === 9) {
      return getCellState(currentGeneration, columnIndex + 1, rowIndex + 1)
    }
  })

  const aliveCount = alives.filter(alive => alive === CellState.ALIVE).length

  const pos6Alive = getCellState(currentGeneration, columnIndex, rowIndex)
  if (pos6Alive === CellState.ALIVE) {
    if (aliveCount == 2 || aliveCount == 3) {
      return CellState.ALIVE
    }
    return CellState.DEAD
  }

  if (aliveCount === 3) {
    return CellState.ALIVE
  }

  return CellState.DEAD
}

const calcNextGeneration = (currentGeneration) => {
  const nextGeneration = []
  const renderingCommands = []

  for (let i = 0; i < currentGeneration.length; i++) {
    const row = []
    nextGeneration.push(row)
    for (let j = 0; j < currentGeneration[i].length; j++) {
      const currentState = currentGeneration[i][j]
      const nextState = calcNextCellState(j, i, currentGeneration)

      if (currentState !== nextState) {
        renderingCommands.push([nextState, i, j])
      }

      row.push(nextState)
    }
  }

  return {
    nextGeneration,
    renderingCommands,
  }
}

// Renderer
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
      cell.setAttribute('data-alive', 0)
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

const renderAliveInBoard = (isAlive, columnIndex, rowIndex) => {
  const elem = document.querySelector(`[data-column="${columnIndex}"][data-row="${rowIndex}"]`)

  elem.setAttribute('data-alive', isAlive)
}

const renderNextField = (currentGeneration) => {
  const {
    nextGeneration,
    renderingCommands,
  }= calcNextGeneration(currentGeneration)

  for (let i=0; i<renderingCommands.length; i++) {
    const [cellState, rowIndex, columnIndex] = renderingCommands[i]
    renderAliveInBoard(cellState, columnIndex, rowIndex)

  }
  return nextGeneration
}

// Game Manager
const nnext = (count, generation) => {
  if (count === 0) {
    return
  }

  setTimeout(() => {
    const nextGeneration = renderNextField(generation)
    nnext(count - 1, nextGeneration)
  }, 150)
}

// __main__
const initialize = (field) => {
  const initialGeneration = createInitialGeneration(field)
  createBoard(document.getElementById('root'), field)

  setCellState(initialGeneration, CellState.ALIVE, 1, 0)
  setCellState(initialGeneration, CellState.ALIVE, 1, 2)
  setCellState(initialGeneration, CellState.ALIVE, 2, 1)
  setCellState(initialGeneration, CellState.ALIVE, 0, 2)
  setCellState(initialGeneration, CellState.ALIVE, 1, 2)
  setCellState(initialGeneration, CellState.ALIVE, 2, 2)

  nnext(1000, initialGeneration)
}

const field = { width: 50, height: 50 }
initialize(field)
