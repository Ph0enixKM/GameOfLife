let canvas = document.querySelector('canvas')
let c = canvas.getContext('2d')

let width = canvas.width = (window.innerWidth > 1000) ? 1000 : Math.floor(window.innerWidth/250)*250
let height = canvas.height = (window.innerHeight > 1000) ? 1000 : Math.floor(window.innerHeight/250)*250
let res = 10 // Resolution
let cols = width / res // Columns
let rows = height / res // Rows


let matrix = []

function randomize() {
  for (let i = 0; i < cols; i++) {
    matrix[i] = [] // Add another array
    for (let j = 0; j < rows; j++) {
      matrix[i][j] = Math.round( Math.random() )
    }
  }
}
randomize()

let temp = JSON.parse(JSON.stringify(matrix))

function update() {
  for (let x = 0; x < cols; x++) {
    for (let y = 0; y < rows; y++) {
      let self = matrix[x][y]

      //Count neighbours
      let count = 0
      for (let i = -1; i < 2; i++) {
        for (let j = -1; j < 2; j++) {
          let col = ( x + i + cols ) % cols
          let row = ( y + j + rows ) % rows
          count += matrix[col][row]
        }
      }
      // Don't count yourself
      count -= self

      if (self == 1 && (count > 3 || count < 2)) {
        temp[x][y] = 0
      } else if (self == 0 && count == 3){
        temp[x][y] = 1
      } else {
        temp[x][y] = matrix[x][y]
      }

      if (self == 1) {
        c.fillStyle = 'black'
      } else {
        c.fillStyle = 'white'
      }
      // Draw the cell
      c.beginPath()
      c.strokeStyle = '#888'
      c.rect(x*res,y*res,res,res)
      c.fill()
      c.stroke()

    }
  }
  matrix = JSON.parse(JSON.stringify(temp))
}
update()

// INPUT SECTION
/**
 * @param {next} button
 * @param {play} button
*/

let next = document.querySelector('#next')
let play = document.querySelector('#play')
let clear = document.querySelector('#clear')
let random = document.querySelector('#random')

random.addEventListener("click",()=>{
  randomize()
  update()
})

clear.addEventListener("click",()=>{
  for (let i = 0; i < cols; i++) {
    matrix[i] = [] // Add another array
    for (let j = 0; j < rows; j++) {
      matrix[i][j] = 0
    }
  }
  update()
})

play.state = false
play.loop = undefined

play.addEventListener("click", () => {
  if (play.state) {
    clearInterval(play.loop)
    play.state = !play.state
    play.innerHTML = 'Play'
  } else {
    play.loop = setInterval(update,50)
    play.state = !play.state
    play.innerHTML = 'Stop'
  }
})

next.addEventListener("click",update)

// Adding / deleting cells
canvas.addEventListener("mousedown", e => {
  let loc = {
    x : Math.floor( (e.x-canvas.offsetLeft) / res ),
    y : Math.floor( (e.y-canvas.offsetTop+window.pageYOffset) / res )
  }

  matrix[loc.x][loc.y] = +!matrix[loc.x][loc.y]

  if (matrix[loc.x][loc.y] == 1) {
    c.fillStyle = 'black'
  } else {
    c.fillStyle = 'white'
  }
  // Draw the cell
  c.beginPath()
  c.strokeStyle = '#888'
  c.rect(loc.x*res,loc.y*res,res,res)
  c.fill()
  c.stroke()
})

// Window Resize
window.addEventListener('resize', ()=>{
  width = canvas.width = (window.innerWidth > 1000) ? 1000 : Math.floor(window.innerWidth/250)*250
  height = canvas.height = (window.innerHeight > 1000) ? 1000 : Math.floor(window.innerHeight/250)*250
  cols = width / res
  rows = height / res
  randomize()
  update()
})
