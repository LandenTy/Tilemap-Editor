const cols = 10; // Number of columns
const rows = 10; // Number of rows
const squareSize = 50; // Size of each square in pixels

let grid;
let canvas;
let ctx;
let isDrawing = false;
let isFloodFillMode = false; // Flag to toggle flood fill mode

// Function to make a 2D array
function make2DArray(cols, rows) {
    let arr = new Array(cols);
    for (let i = 0; i < arr.length; i++) {
        arr[i] = new Array(rows).fill(false); // Initialize with false (transparent)
    }
    return arr;
}

// Initialize the grid
function setup() {
    grid = make2DArray(cols, rows);

    canvas = document.getElementById('gridCanvas');
    ctx = canvas.getContext('2d');

    canvas.width = cols * squareSize;
    canvas.height = rows * squareSize;

    canvas.addEventListener('mousedown', handleMouseDown);
    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseup', handleMouseUp);
    canvas.addEventListener('mouseleave', handleMouseLeave);

    document.getElementById('fillButton').addEventListener('click', toggleFillMode);
    document.getElementById('penButton').addEventListener('click', togglePenMode);
    document.getElementById('eraserButton').addEventListener('click', toggleEraserMode);

    drawGrid();
}

// Draw the grid of squares
function drawGrid() {
    for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
            ctx.beginPath();
            ctx.rect(i * squareSize, j * squareSize, squareSize, squareSize);
            ctx.strokeStyle = 'black';
            ctx.stroke();
            if (grid[i][j]) {
                ctx.fillStyle = 'grey';
                ctx.fill();
            } else {
                ctx.clearRect(i * squareSize, j * squareSize, squareSize, squareSize);
            }
        }
    }
}

// Handle mouse down event
function handleMouseDown(event) {
    isDrawing = true;
    draw(event);
}

// Handle mouse move event
function handleMouseMove(event) {
    if (isDrawing) {
        draw(event);
    }
}

// Handle mouse up event
function handleMouseUp() {
    isDrawing = false;
}

// Handle mouse leave event
function handleMouseLeave() {
    isDrawing = false;
}

function toggleEraserMode() {
    isEraserMode = true;
    isFloodFillMode = false; // Ensure other modes are deactivated
    isDrawing = false;
}

// Draw function for mouse events
function draw(event) {
    const x = Math.floor(event.offsetX / squareSize);
    const y = Math.floor(event.offsetY / squareSize);
    if (isDrawing && !isFloodFillMode && !isEraserMode) {
        grid[x][y] = true;
        drawGrid();
    } else if (isDrawing && isFloodFillMode) {
        floodFill(x, y);
        drawGrid();
    } else if (isDrawing && isEraserMode) {
        grid[x][y] = false; // Set the grid cell to transparent
        drawGrid();
    }
}

// Toggle flood fill mode
function toggleFillMode() {
    isFloodFillMode = true;
    isEraserMode = false;
    isDrawing = false;
}

// Toggle pen mode
function togglePenMode() {
    isDrawing = true;
    isEraserMode = false;
    isFloodFillMode = false;
}

// Flood fill algorithm
function floodFill(x, y) {
    if (x < 0 || x >= cols || y < 0 || y >= rows || grid[x][y]) {
        return;
    }

    grid[x][y] = true;

    floodFill(x + 1, y);
    floodFill(x - 1, y);
    floodFill(x, y + 1);
    floodFill(x, y - 1);
}

// Initialize the grid when the page loads
window.onload = setup;
