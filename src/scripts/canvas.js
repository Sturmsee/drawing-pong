

let canvas;
let ctx;

var posY = 0;
var Enemy_posY = 0;

var playerId = 0;

// Set up event listeners for mouse movement and clicks
document.addEventListener("mousemove", setPositionY);



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
//############### PLAYER 1 ################
//#########################################

// Function to set the position of the mouse
function setPositionY(event) {
    return posY = event.clientY;
}

class RedRect {
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
        // Check for collision with the rectangle
        if (gameBall.x + gameBall.radius > this.posX &&
            gameBall.x - gameBall.radius < this.posX + 25 &&
            gameBall.y + gameBall.radius > posY &&
            gameBall.y - gameBall.radius < posY + 80) {

            gameBall.onHit(); // Call the onHit method of the Ball class
        }
    }
}



//##########################################
//############### Player 2 #################
//##########################################

class BlueRect {
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
        ctx.fillRect(this.posX, Enemy_posY, 25, 80);
        ctx.closePath();
        ctx.fill();
    }


    onCollision() {
        // Check for collision with the rectangle
        if (gameBall.x + gameBall.radius > this.posX &&
            gameBall.x - gameBall.radius < this.posX + 25 &&
            gameBall.y + gameBall.radius > Enemy_posY &&
            gameBall.y - gameBall.radius < Enemy_posY + 80) {

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
//############### GAME LOOP ################
//##########################################

function gameLoop() {
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas

    setInterval(onUpdatePositions, 1000 / 60); // Update positions at 60 FPS

    gameBall.draw();
    gameBall.update();
    player1.drawRectangle(); // Draw the rectangle
    player1.onCollision(); // Check for collision with the rectangle
    player2.drawRectangle(); // Draw the second rectangle
    player2.onCollision(); // Check for collision with the second rectangle

    requestAnimationFrame(gameLoop);
}

initCanvas();
gameBall = new Ball(100, 100, 20, 4, 3);
player1 = new RedRect(75, "red");
player2 = new BlueRect(canvas.width - 75, "blue");
gameLoop(); // Start the game loop




//##########################################
//############### WEBSOCKET ################
//##########################################

const ws = new WebSocket('ws://localhost:8080');

ws.addEventListener('open', e => {
    console.log('WebSocket connection established');

    ws.addEventListener('message', data => {
        //console.log( data );
        const message = JSON.parse(data);
        if (message.id === 0) {
            playerId = 1;
            //message.id.push(playerId);
        }
        else if (message.id.length > 0) {
            playerId = 2;
            //message.id.push(playerId);
        }

        updateRectPositions(data);
    });
});


function onUpdatePositions() {
    // Send the current positions of the player and enemy rectangles to the server
    const data = {
        playerPosY: posY,
        id: playerId
    };
    ws.send(JSON.stringify(data));
}

//Update the positions of the rectangles based on Player IDs
function updateRectPositions(_data) {
    _data = JSON.parse(_data);
    if (_data.id === 1) {
        posY = _data.playerPosY; // Update player position
    }
    else if (_data.id === 2) {
        Enemy_posY = _data.playerPosY; // Update enemy position
    }

}