/**
 *
 * @typedef {{
 * username: string,
 * emoji: string,
 * count: number,
 * epoch: number
 * }} UserInteraction
 *
 * */

//@ts-check

const { connect, env } = require("./database");
const chat = require("./chat");
const scoreboard = require("./scoreboard.js");
const webserver = require("./webserver.js");
const channels = require("../config.json").channels;
const queries = require("./queries");

/**@type {UserInteraction[]} */
let statsBuffer = [];

webserver.events.on("connection", (ws) => {
  ws.send(scoreboard.getScoreboardEncoded());
});

webserver.events.on(
  "websocket-message",
  /** @param {string} message */ (message) => {
    if (message.startsWith('{"type":"canvas-update"')) {
      webserver.sendBroadcastMessage(message);
    }
  }
);

chat.init(channels, (channel, tags, message, self) => {
  //log all message
  //console.log(`${tags['display-name']}: ${message}`);
  for (const contestant of scoreboard.contestants) {
    const occurrences = (message.match(new RegExp(contestant, "g")) || [])
      .length;
    if (occurrences > 0) {
      statsBuffer.push({
        username: tags["display-name"] || "{unknown_user}",
        emoji: contestant,
        count: occurrences,
        epoch: Date.now(),
      });
      scoreboard.addScore(contestant, occurrences);
      webserver.sendBroadcastMessage(scoreboard.getScoreboardEncoded());
    }
  }
});

setInterval(() => {
  try {
    if (statsBuffer.length > 0) {
      let temp = statsBuffer;
      statsBuffer = [];

      const query = queries.insertStats(temp);
      console.log("Inserting stats: ", query);
      connect().then((connection) => {
        connection.query(query).then(() => {
          connection.end();
        });
      });
    }
  } catch (error) {
    console.error("Error inserting stats: ", error);
  }
}, Number(env.DB_SAVE_INTERVAL) * 1000);
