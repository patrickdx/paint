const canvas = document.getElementById("canvas");
const canvasLength = canvas.clientWidth;  // width and height are same
const canvasColor = "white";


/*
GRID CREATION AND MANAGEMENT
*/
function drawGrid(resolution = 15) {
    
    console.log(resolution)
    function createSquare(){ 
        const square = document.createElement("div");
        const squareLength  = canvasLength / resolution;

        square.style.width = `${squareLength}px`;
        square.style.height = `${squareLength}px`;
    
        return square;
    }

    // loop thru and create all squares
    for (let i =0; i<resolution; i++) {
        for (let j=0; j<resolution; j++) {
            canvas.appendChild(createSquare());
        }
    }
}

function clearCanvas() {
    const squares = document.querySelectorAll("#canvas div");
    squares.forEach((square) => {
        square.style.backgroundColor = canvasColor;
    });
    currentMode = mode.PAINT;
    paintColor = document.getElementById("paint").value;
}

// create the grid when page loads
document.addEventListener('DOMContentLoaded', () => drawGrid());




/*
    A BUNCH OF EVENT LISTENERS FOR PAINTING AND STATE MANAGEMENT
*/ 
const mode = {
    PAINT: "paint",
    ERASER: "eraser",
    MAGIC: "magic",
    RESET: "reset"
}
let currentMode = mode.PAINT;

// what mode are we in?
const controls = Array.from(document.querySelector(".controls").children);

controls.forEach((control) => {
    control.addEventListener("click", (event) => {  
        currentMode = event.target.id; 
        
        controls.forEach((control) => {
            control.classList.remove("selected");
        });
        event.target.classList.add("selected");
    });
});


function setPaintBrush(){
     switch (currentMode) {
        case mode.PAINT:
            paintColor = document.getElementById("paint").value;
            break;
        case mode.ERASER:
            paintColor = canvasColor;
            break;
        case mode.MAGIC:
            paintColor = randomColor();
            break;
       
    }
    console.log(paintColor, currentMode);
}

// set the paintbrush to the appropriate color based on mode
// the idea is that painting is only done on events mouseDown and mouseOver, so determine color on those events
canvas.addEventListener("mousedown", setPaintBrush);
canvas.addEventListener("mouseover", setPaintBrush);


// the painting functionality
let isDrawing = false;

canvas.addEventListener("mousedown", (event) => {
    // mousebutton 0 = left click
    if (event.button == 0) {isDrawing = true;}
    // since mouseover event only triggers when mouse moves onto a different element
    event.target.style.backgroundColor = paintColor;
    
});
canvas.addEventListener("mouseup", (event) => {
    if (event.button == 0) {isDrawing = false;}
});

canvas.addEventListener("mouseover", (event) => {
    if (isDrawing) {
        event.target.style.backgroundColor = paintColor;
    }
});

canvas.addEventListener('dragstart', (e) => {
    // This line prevents the browser from starting a native 
    // drag-and-drop operation ⦻ when the mouse button is held down.
    e.preventDefault(); 
});

// helper function for magic brush
function randomColor() {
    const rgb = [0,0,255];
    rgb[0] = Math.floor(Math.random() * 256);
    rgb.sort(() => 0.5 - Math.random());            // SHUFFLE IT 
    return `rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`; 
}



// TODO: button highlighting

// change event fires when slider is released
document.getElementById("sizeSlider").addEventListener("change", (event) => {
    let resolution = event.target.value;
    canvas.innerHTML = "";   // clear out existing grid
    drawGrid(resolution);
});
