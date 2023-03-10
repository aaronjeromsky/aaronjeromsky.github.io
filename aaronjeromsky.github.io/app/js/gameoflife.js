let useHeatmap = false;
let useGridlines = false;

// Toggle heatmap
function toggleHeatmap() {
    useHeatmap = !useHeatmap
}

// Toggle gridlines
function toggleGridlines() {
    useGridlines = !useGridlines
}

// Reset canvas
function resetCanvas() {
    window.location.reload();
}

window.onload = function () {

    // TODO: toggle cell state via onClick (start with empty grid) (also allow holding click)
    // TODO: set framerate (and by extension allow pausing)
    // TODO: record and show generation number
    // TODO: clear grid and pause (instead of reloading the page)

    // Prepare the document
    var canvas = document.getElementById('canvas');
    var ctx = canvas.getContext('2d');

    // Resolution, width, and height
    const resolution = 10;

    if (Math.floor(window.innerHeight / resolution) * resolution - resolution * 4 < Math.floor(window.innerWidth / resolution) * resolution) {
        canvas.height = Math.floor(window.innerHeight / resolution) * resolution - resolution * 4;
        canvas.width = canvas.height;
    } else {
        canvas.width = Math.floor(window.innerWidth / resolution) * resolution;
        canvas.height = canvas.width;
    }

    let shadeHue = 226
    let shadeSaturation = 25;

    // Constant variables, rows and columns
    const COLS = canvas.width / resolution;
    const ROWS = canvas.height / resolution;

    // Cell class
    class Cell {
        constructor() {
            this.currentState = Math.floor(Math.random() * 2);
            this.total = 0;
            this.shade = 0;
        }
        setState(state) {
            this.currentState = state;
            this.total += state;
            this.shade += state
        }
    }

    // Build the grid
    function buildGrid() {
        return new Array(COLS).fill(null)
            .map(() => new Array(ROWS).fill(null)
                .map(() => new Cell()));
    }

    // Render the grid
    let grid = buildGrid();

    requestAnimationFrame(update);

    // Update the grid
    function update() {
        grid = nextGen(grid);
        render(grid);
        requestAnimationFrame(update);
    }

    // Perform the next generation
    function nextGen(grid) {

        // Copy the current generation
        //const nextGen = grid.map(arr => [...arr]);
        const currentGen = grid.map(arr => arr.map(cell => cell.currentState));

        // Find all the cells
        for (let col = 0; col < currentGen.length; col++) {
            for (let row = 0; row < currentGen[col].length; row++) {

                const cell = currentGen[col][row];
                let numNeighbors = 0;

                // Find the neighors of the cell
                for (let i = -1; i < 2; i++) {
                    for (let j = -1; j < 2; j++) {

                        // Prevents counting itself
                        if (i === 0 && j === 0) {
                            continue;
                        }

                        // TODO: fix cells "pausing" when touching the sides of the grid

                        // Prevent errors from reaching the edge
                        const x_cell = col + i;
                        const y_cell = row + j;

                        // Make sure the cell to be checked isn't outside the grid (undefined)
                        if (x_cell >= 0 && y_cell >= 0 && x_cell < COLS && y_cell < ROWS) {
                            const currentNeighbor = currentGen[col + i][row + j];
                            numNeighbors += currentNeighbor;
                        }
                    }
                }

                // RULES OF THE GAME

                // Any live cell with fewer than two live neighbours dies, as if by underpopulation.
                if (cell === 1 && numNeighbors < 2) {
                    grid[col][row].setState(0);

                    // Any live cell with two or three live neighbours lives on to the next generation.
                    // NO CODE NECESSARY

                    // Any live cell with more than three live neighbours dies, as if by overpopulation.
                } else if (cell === 1 && numNeighbors > 3) {
                    grid[col][row].setState(0);

                    // Any dead cell with exactly three live neighbours becomes a live cell, as if by reproduction.
                } else if (cell === 0 && numNeighbors === 3) {
                    grid[col][row].setState(1);

                    // Any live cell with two or three live neighbours lives on to the next generation.
                    // Also increments the cell lifetime for color changing.
                } else {
                    grid[col][row].setState(grid[col][row].currentState);
                }
            }
        }
        return grid;
    }

    // Render function
    function render(grid) {

        for (let col = 0; col < grid.length; col++) {
            for (let row = 0; row < grid[col].length; row++) {
                const cell = grid[col][row];
            }
        }


        for (let col = 0; col < grid.length; col++) {
            for (let row = 0; row < grid[col].length; row++) {
                const cell = grid[col][row];

                if (cell.currentState === 1) {
                    cell.shade = 0.5 // Initial 'lightness' value
                }

                cell.shade += 0.01; // Speed of cell shade deterioration
                let finalShade = 100 - cell.shade * 100; // Convert to 'lightness' value range (0-100)

                ctx.beginPath();
                ctx.rect(col * resolution, row * resolution, resolution, resolution);

                // Black and white fill style
                if (useHeatmap === true) {
                    ctx.fillStyle = cell.currentState ? 'white' : `hsl(${shadeHue}, ${shadeSaturation}%, ${finalShade}%)`;
                    // Color fill style
                } else {
                    ctx.fillStyle = cell.currentState ? `white` : `black`;
                }

                if (useGridlines === true) {
                    ctx.stroke();
                }

                // Grid fill
                ctx.fill();
            }
        }
    }
}