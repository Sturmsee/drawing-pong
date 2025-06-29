let roomName = 'pong';

let serverURL = 'wss://nosch.uber.space/web-rooms/';
let socket = new WebSocket(serverURL);

let clientId = null;
let clientCount = 0;

let canvas;
let ctx;

var posX = [];


var mousePosition = 0;

var pointDisplay;

var roomID = "";

// Set up event listeners for mouse movement and clicks
document.addEventListener("mousemove", setPositionY);

window.onload = function () {
    roomID = sessionStorage.getItem('roomID');

    pointDisplay = document.querySelector('.points');
    pointDisplay.innerText = "0/0";

    initCanvas();
    gameBall = new Ball(100, 100, 20, 4, 3);
    player1 = new Rect(posX[0], "red");
    player2 = new Rect(posX[1], "blue");
    setInterval(gameLoop(), 1000 / 60); // Start the game loop
    setInterval(sendPositions, 1000); // Send positions every frame
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
    posX = [75, canvas.width - 75];     // Set initial positions for the rectangles
    
    window.addEventListener("resize", resizeCanvas);    // Set up the canvas to resize with the window
}

// Resize the canvas to fit the window
function resizeCanvas() {
    if (!canvas) return;
    canvas.width = window.innerWidth/1.5;
    canvas.height = window.innerHeight/1.5;
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
        this.posY = 0;
        this.width = 25;
        this.height = 80;
        this.color = _color
    }

    drawRect() {
        ctx.beginPath();
        ctx.fillStyle = this.color;
        ctx.fillRect(this.posX, this.posY, 25, 80);
        ctx.closePath();
        ctx.fill();
    }


    onCollision() {
        // Check for collision between the rectangle and the game ball
        if (gameBall.x + gameBall.radius > this.posX &&
            gameBall.x - gameBall.radius < this.posX + 25 &&
            gameBall.y + gameBall.radius > this.posY &&
            gameBall.y - gameBall.radius < this.posY + 80) {

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
        sendPositions(); // Show collision
    }


}



//##########################################
//############### WEBSOCKET ################
//##########################################

// WebSocket-Setup
socket.addEventListener('open', () => {
    socket.send(JSON.stringify(['*enter-room*', roomName]));
    socket.send(JSON.stringify(['*subscribe-client-count*']));
    socket.send(JSON.stringify(['*subscribe-client-enter-exit*']));
    socket.send(JSON.stringify(['*init-data*', 'positions', [0, 0, 100, 100]])); //Player1.posY, Player2.posY, Ball.x, Ball.y
    socket.send(JSON.stringify(['*subscribe-data*', 'positions']));
    setInterval(() => socket.send(''), 30000); // Keep alive
    console.log("WebSocket verbunden");
});

socket.addEventListener('message', (event) => {
    if (!event.data) return;

    const data = JSON.parse(event.data);
    const cmd = data[0];
    console.log("Empfangen:", data);

    switch (cmd) {
        case '*client-id*':
            clientId = data[1];
            break;

        case '*client-count*':
            clientCount = data[1];
            break;

        case 'positions':
            updatePositions(data[1]);
            break;

            
        case '*error*':
            console.warn('Serverfehler:', data[1]);
            break;

        default:
            console.warn('Unbekannter Befehl:', cmd);
            break;
    }
});




//##########################################
//############### GAME LOOP ################
//##########################################



function gameLoop() {
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas


    gameBall.draw();
    gameBall.update();


    if (clientId === 0) {
        player1.posY = mousePosition;
    }
    if (clientId === 1) {
        player2.posY = mousePosition;
    }

    player1.drawRect(); // Draw the rectangle
    player1.onCollision(); // Check for collision with the rectangle
    
    player2.drawRect(); // Draw the second rectangle
    player2.onCollision(); // Check for collision with the second rectangle
    

    requestAnimationFrame(gameLoop);
}


//UPDATE POSITIONS
// This function updates the positions of the players and the ball based on the received message

function updatePositions(message) {
    const positions = message;
    console.log("Received positions:", positions);
    
    player1.posY = positions[0];
    player2.posY = positions[1];
    
    gameBall.x = positions[2];
    gameBall.y = positions[3];   
    

}


//SENDS POSITIONS TO SERVER
// This function sends the current positions of the players and the ball to the server

function sendPositions() {
    
    const _positions = [player1.posY, player2.posY, gameBall.x, gameBall.y];
    const _message = JSON.stringify(['*set-data*', 'positions', positions = _positions]);
    socket.send(_message);
    
}