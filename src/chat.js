const tmi = require('tmi.js');

/**
 * 
 * @param {string[]} channels
 * @param {(channel: string, userstate: tmi.ChatUserstate, message: string, self: boolean) => void} onMessage 
 */
function init(channels,onMessage) {
    const client = new tmi.Client({
        channels
    });
    
    client.connect();
    
    client.on('message', onMessage);
    client.on('connected', () => {
        console.log('Connected to IRC');
    });
    client.on('disconnected', () => {
        console.log('Disconnected from IRC');
    });
    client.on('error', (err) => {
        console.log('TMI Error:', err);
    });
}

exports.init = init;
