const express = require('express');
const WebSocket = require('ws');
const http = require('http');
const path = require('path');
const EventEmitter = require('events');
const e = require('express');
const port = require('../config.json').port;

const app = express();

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../index.html'));
});

const server = http.createServer(app);


/* WebSocket */
const events = new EventEmitter();
const wss = new WebSocket.Server({ server });

const listeners = [];

wss.on('connection', ws => {
    listeners.push(ws);
    events.emit('connection', ws);

    console.log('Client connected');

    ws.on('message', message => {
        console.log(`Received: ${message}`);
    });

    ws.on('close', () => {
        listeners.splice(listeners.indexOf(ws), 1);
        console.log('Client disconnected');
    });
});

server.listen(port, () => {
    console.log('Listening on port:'+ port);
});

/**
 * @param {string} message 
 */
function sendBroadcastMessage(message) {
    listeners.forEach(listener => {
        listener.send(message);
    });
}

exports.sendBroadcastMessage = sendBroadcastMessage;
exports.events = events;
