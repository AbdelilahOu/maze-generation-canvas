let canvas  = document.querySelector('canvas')
let context = canvas.getContext('2d')
let cw = canvas.width;
let ch = canvas.height;
let size = 10;
let AllPixels = [];
let Stack = [];
let current = null;
let ItsDone = true;
//each cube
function Pixel(x , y) {
    this.x = x
    this.y = y
    this.visited = false
    this.walls = [true , true , true , true]
    this.draw = function () {
        context.fillStyle = "white"
        context.fillRect(this.x , this.y , size , size)
        if (this.walls[0]) {
            context.beginPath()
            context.strokeStyle = 'black'
            context.moveTo(this.x , this.y)
            context.lineTo(this.x + size , this.y)
            context.stroke()
        }else{
            context.beginPath()
            context.strokeStyle = 'white'
            context.moveTo(this.x , this.y)
            context.lineTo(this.x + size , this.y)
            context.stroke()
        }
        if (this.walls[1]) {
            context.beginPath()
            context.strokeStyle = 'black'
            context.moveTo(this.x + size , this.y)
            context.lineTo(this.x + size , this.y + size)
            context.stroke()
        }else{
            context.beginPath()
            context.strokeStyle = 'white'
            context.moveTo(this.x + size , this.y)
            context.lineTo(this.x + size , this.y + size)
            context.stroke()
        }
        if (this.walls[2]) {
            context.beginPath()
            context.strokeStyle = 'black'
            context.moveTo(this.x + size , this.y + size)
            context.lineTo(this.x , this.y + size)
            context.stroke()
        }else{
            context.beginPath()
            context.strokeStyle = 'white'
            context.moveTo(this.x + size , this.y + size)
            context.lineTo(this.x , this.y + size)
            context.stroke()
        }
        if (this.walls[3]) {
            context.beginPath()
            context.strokeStyle = 'black'
            context.moveTo(this.x , this.y + size)
            context.lineTo(this.x  , this.y)
            context.stroke()
        }else{
            context.beginPath()
            context.strokeStyle = 'white'
            context.moveTo(this.x , this.y + size)
            context.lineTo(this.x  , this.y)
            context.stroke()
        }
    }
    this.neighbours = function () {
        let neighbours = []

        let top    = AllPixels[Index(this.x , this.y - size)]
        let right  = AllPixels[Index(this.x + size , this.y)]
        let left   = AllPixels[Index(this.x - size , this.y)]
        let buttom = AllPixels[Index(this.x , this.y + size)]


        if (top    && !top.visited) {
            neighbours.push(top   )
        }
        if (right  && !right.visited) {
            neighbours.push(right )
        }
        if (buttom && !buttom.visited) {
            neighbours.push(buttom)
        }
        if (left   && !left.visited) {
            neighbours.push(left  )
        }
        
        let neighbourIndex = Math.floor(Math.random()*neighbours.length) 
        
        if (neighbours.length > 0) return neighbours[neighbourIndex]
        
        else return undefined
        
    }
}
//////////////////////////RETURNS THE INDEX OF A CUBE USING ITS CORDS
const Index = (x , y) => {
    if (x > cw || x < 0 || y > ch || y < 0) return -1
    else return (( y / size ) * ch / size) + x / size   
} 
//////////////////////////MAKE ALL THE CUBES
const MakePixels  = () => {
    for (let j = 0; j < cw / size; j++) {
        for (let i = 0; i < ch / size ; i++) {
            AllPixels.push(new Pixel(i * size , j * size))        
        }
    }
}
MakePixels()
///////////////////////////
const MakeTheMaze = () => {
    current.visited = true
    let next = current.neighbours()
    if (next) {
        Stack.push(current)
        next.visited = true
        RemoveWalls(current , next)
        current = next
    }else if (Stack.length > 0) {
        current = Stack.pop()
    }else{
        context.fillStyle = "red"
        context.fillRect(current.x, current.y , size , size)
        return;
    }
    requestAnimationFrame(MakeTheMaze)
}
//////////////////////////////////////
const RemoveWalls  = (curr , next) => {
    let x = next.x - curr.x
    let y = next.y - curr.y
    if (x == size) {
        curr.walls[1] = false
        next.walls[3] = false
    }else if (x == -size) {
        curr.walls[3] = false
        next.walls[1] = false
    }
    if (y == size) {
        curr.walls[2] = false
        next.walls[0] = false
    }else if (y == -size) {
        curr.walls[0] = false
        next.walls[2] = false
    }
    curr.draw()
    next.draw()
}
///////////////////////////
const MakeTheGrid = () => {
    for (let k = 0; k < AllPixels.length; k++) {
        AllPixels[k].draw()  
    }
}
MakeTheGrid()
//////////////
function getCursorPosition(canvas , event) {
    const rec = canvas.getBoundingClientRect()
    //turn it into a integer
    x = Math.floor(event.clientX - rec.left)
    y = Math.floor(event.clientY - rec.top)
    //get the position of the cube its is in
    x = x - x.toString().split('').splice(-1)
    y = y - y.toString().split('').splice(-1)

    return { x , y }
}

canvas.addEventListener('mousedown',(e) => {
    if (ItsDone) {
        ItsDone = false
        const { x , y } = getCursorPosition(canvas , e)
        current = AllPixels[Index(x , y)]
        MakeTheMaze()
    }   
})