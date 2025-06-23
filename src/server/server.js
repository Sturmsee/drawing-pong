const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: 8080 });

var players = [];

wss.on('connection', ws => {
    console.log('New client connected');

    try {
        const data = JSON.parse(message)
        console.log(`Received data: ${data}`);
    } catch (error) {
        console.error('Error parsing message:', error);
    }

    ws.on('message', data => {
        //console.log(`Received message: ${data}`);

        var message = JSON.parse(data);

        // Broadcast the updated player positions to all connected clients
        wss.clients.forEach(client => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(JSON.stringify({
                    id: message.id,
                    playerPosY: message.playerPosY
                }));
            }
        });
    });



    ws.on('close', () => {
        console.log('Client disconnected');
    });
});