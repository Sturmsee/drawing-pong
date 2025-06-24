

let canvas;
let ctx;

var posX = [];
var posY = 0;

var mousePosition = 0;

var playerId = ""; // Default player ID, can be changed based on localStorage or other logic

// Set up event listeners for mouse movement and clicks
document.addEventListener("mousemove", setPositionY);

window.onload = function () {
    playerId = sessionStorage.getItem('playerColor');
    console.log(`Player ID set to: ${playerId}`);
}


//##########################################
//############### CANVAS ###################
//##########################################

// Initialize the canvas and context
function initCanvas() {
    canvas = document.getElementById("pongCanvas");
    if (!canvas) {
        throw new Error("Canvas element not found");
    }
    ctx = canvas.getContext("2d");
    if (!ctx) {
        throw new Error("Failed to get canvas context");
    }
    resizeCanvas();
    posX = [75, canvas.width - 75]; // Set initial positions for the rectangles
    // Set up the canvas to resize with the window
    window.addEventListener("resize", resizeCanvas);
}

// Resize the canvas to fit the window
function resizeCanvas() {
    if (!canvas) return;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}



//#########################################
//############### PLAYERS  ################
//#########################################

// Function to set the position of the mouse
function setPositionY(event) {
    return mousePosition = event.clientY;
}

class Rect {
    constructor(_posX, _color) {
        this.posX = _posX;
        this.posY = posY;
        this.width = 25;
        this.height = 80;
        this.color = _color
    }

    drawRectangle() {
        if (!ctx) return;

        ctx.beginPath();
        ctx.fillStyle = this.color;
        ctx.fillRect(this.posX, posY, 25, 80);
        ctx.closePath();
        ctx.fill();
    }


    onCollision() {
        // Check for collision between the rectangle and the game ball
        if (gameBall.x + gameBall.radius > this.posX &&
            gameBall.x - gameBall.radius < this.posX + 25 &&
            gameBall.y + gameBall.radius > posY &&
            gameBall.y - gameBall.radius < posY + 80) {

            gameBall.onHit(); // Call the onHit method of the Ball class
        }
    }
}



//##########################################
//################ BALL ####################
//##########################################

class Ball {
    speedFactor = 1; // Factor to increase speed on hit

    constructor(x, y, radius, dx, dy) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.dx = dx;
        this.dy = dy;

    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = "black";
        ctx.fill();
        ctx.closePath();
    }

    update() {
        this.x += this.dx;
        this.y += this.dy;

        // Bounce off walls
        if (this.x + this.radius > canvas.width || this.x - this.radius < 0) {
            this.dx *= -1;
        }
        if (this.y + this.radius > canvas.height || this.y - this.radius < 0) {
            this.dy *= -1;
        }
    }

    //Hitscan
    onHit() {
        const speedFactor = this.speedFactor;
        this.dx *= -speedFactor; // Reverse direction on hit
        this.dy *= speedFactor;

    }


}



//##########################################
//############### WEBSOCKET ################
//##########################################

const ws = new WebSocket('ws://localhost:8080'); // Connect to the WebSocket server

ws.addEventListener('open', e => {
    console.log('WebSocket connection established');
    ws.send(JSON.stringify({
        id: playerId,
        playerPosY: mousePosition // Send the initial position of the player
    }));

    ws.addEventListener('message', event => {
        //console.log(event.data);
        var message = JSON.parse(event.data);
        updateRectPositions(message);
    });
});



function onUpdatePositions() {
    // Send the current positions of the player
    var data = {
        playerPosY: mousePosition, // Get the current mouse position
        id: playerId
    };
    
    ws.send(JSON.stringify(data));
}


//Update the positions of the rectangles based on Player IDs
function updateRectPositions(_data) {
    //_data = JSON.parse(_message.data);
    if (_data.id === "red") {
        player1.posY = _data.playerPosY; // Update player position
        player1 = posX[0];
        player1.color = _data.id; // Update player color
    }
    if (_data.id === "blue") {
        player2.posY = _data.playerPosY; // Update enemy position
        player2 = posX[1];
        player2.color = _data.id; // Update enemy color
    }

}



//##########################################
//############### GAME LOOP ################
//##########################################

initCanvas();
gameBall = new Ball(100, 100, 20, 4, 3);
player1 = new Rect(posX[0], "red");
player2 = new Rect(posX[1], "blue");
gameLoop(); // Start the game loop



function gameLoop() {
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas

    if (ws.readyState == WebSocket.OPEN) {
        onUpdatePositions(); // Update the positions of the rectangles based on mouse position
    }
    
    gameBall.draw();
    gameBall.update();

    player1.drawRectangle(); // Draw the rectangle
    player1.onCollision(); // Check for collision with the rectangle
    player2.drawRectangle(); // Draw the second rectangle
    player2.onCollision(); // Check for collision with the second rectangle

    requestAnimationFrame(gameLoop);
}
