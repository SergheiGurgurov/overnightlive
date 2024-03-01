//@ts-check
const chat = require('./chat');
const scoreboard = require('./scoreboard.js');
const webserver = require('./webserver.js');
const channels = require('../config.json').channels;

webserver.events.on('connection', ws => {
    ws.send(scoreboard.getScoreboardEncoded());
});

chat.init(channels, (channel, tags, message, self) => {
    console.log(`${tags['display-name']}: ${message}`);
    for (const contestant of scoreboard.contestants) {
        const occurrences = (message.match(new RegExp(contestant, 'g')) || []).length;
        if (occurrences > 0) {
            scoreboard.addScore(contestant, occurrences);
            webserver.sendBroadcastMessage(scoreboard.getScoreboardEncoded());
        }
    }
});

