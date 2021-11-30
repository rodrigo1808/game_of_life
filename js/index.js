function generateGrid(height, width) {
  grid = Array(height).fill().map(()=>Array(width).fill())
  game.width = width
  game.height = height
  grid_element = document.getElementById('grid')
  for(let i = 0; i < height; i++) {
    grid_element.insertAdjacentHTML('beforeend', `<tr id="${'row_' + i}"></tr>`)
    row = document.getElementById('row_' + i)
    for(let k = 0; k < width; k++) {
      row.insertAdjacentHTML('beforeend', returnCellElement(i, k))
      let cell = {
        index: (i*width) + k,
        active: false,
        row: i,
        column: k,
        element: document.getElementById('cell_' + i + '_' + k),
      }
      grid[i][k] = cell
    }
  }

  console.log(grid)
}

async function gameClock() {
  while(true) {
    checkCellsNeighbors()
    toggleStack()
    await sleep(1000)
  }
}

function checkCellsNeighbors() {
  for(let r = 0; r < game.height; r++) {
    for(let c = 0; c < game.width; c++) {
      let cell = grid[r][c]
      let numberOfNeighbors = getNumberOfNeighbors(r, c)
      if(cell.active) {
        if(numberOfNeighbors < 2 || numberOfNeighbors > 3) {
          toggleCell(cell)
        }
      }
      else {
        if(numberOfNeighbors == 3) {
          toggleCell(cell)
        } 
      }
    }
  }
}

function returnCellElement(row, column) {
  return `<td 
    id="${'cell_' + row + '_' + column}"
    class="${false ? 'active' : 'inactive'}"
    onclick="getCell(event)"
    >
    </td>`
}

function getCell(event) {
  let cellValues = event.target.id.split('_')
  let row = parseInt(cellValues[1])
  let column = parseInt(cellValues[2])
  if(game.hasStarted) {
    getNumberOfNeighbors(row, column)
    return
  }
  let cell = grid[row][column]
  toggleCell(cell)
  cell.active = !cell.active
}

function toggleCell(cell) {
  let newClass = !cell.active ? 'active' : 'inactive'
  cell.element.className = newClass
  if(game.hasStarted)  
    toggleStackItems.push({row: cell.row, column: cell.column, index: cell.index})
}

function toggleStack() {
  for(cellCoordinates of toggleStackItems) {
    let cell = grid[cellCoordinates.row][cellCoordinates.column]
    cell.active = !cell.active
  }
  toggleStackItems = []
}

function getNumberOfNeighbors(row, column) {
  let numberOfActives = 0;
  for(let r = row - 1; r <= row + 1; r++) {
    for(let c = column - 1; c <= column + 1; c++) {
      if(r < 0 || c < 0)
        continue
      if(r >= game.height || c >= game.width)
        continue
      if(r == row && c == column)
        continue
      if(grid[r][c].active)
        numberOfActives++
    }
  }
  return numberOfActives
}

function startGame() {
  game.hasStarted = true;
  gameClock()
}

function sleep(ms) {
  return new Promise(
    resolve => setTimeout(resolve, ms)
  );
}

var grid;
var game = {
  hasStarted: false,
  width: 0,
  height: 0
};
var toggleStackItems = []

generateGrid(20, 40)
