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
}

exports.init = init;
