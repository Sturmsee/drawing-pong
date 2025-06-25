const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: 8080 });

var players = [];

wss.on('connection', ws => {
    console.log('New client connected');

    //Error handling for incoming messages    
    try {
        const data = JSON.parse(message)
        console.log(`Received data: ${data.id}, ${data.playerPosY}`);
    } catch (error) {
        console.error('Error parsing message:', error);
    }

    ws.on('message', message => {
        //console.log(`Received message: ${message}`);



        // Parse the incoming message
        var data = JSON.parse(message);

        // Store player data
        players.push({
            id: data.id,
            playerPosY: data.playerPosY
        });

        setInterval(() => {
            // Broadcast the updated player positions to all connected clients
            wss.clients.forEach(client => {
                if (client.readyState === WebSocket.OPEN) {
                    client.send(JSON.stringify({
                        id: data.id,
                        playerPosY: data.playerPosY
                    }));
                }
            });
        }, 1000 / 24);

    });





    ws.on('close', () => {
        console.log('Client disconnected');
    });
});