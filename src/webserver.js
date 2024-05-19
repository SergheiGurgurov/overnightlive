const express = require("express");
const WebSocket = require("ws");
const http = require("http");
const path = require("path");
const EventEmitter = require("events");
const port = require("../config.json").port;
const simpleBundler = require("../lib/simple-bundler");

const app = express();
const router = express.Router();

router.get("/overlay", (req, res) => {
  res.sendFile(path.join(__dirname, "../overlay-svelte/index.html"));
});

router.get("/editor", (req, res) => {
  simpleBundler.bundle(
    path.join(__dirname, "../editor/index.html"),
    (err, html) => {
      if (err) {
        res.status(500).json(err).end();
      }
      res.status(200).send(html).end();
    }
  );
});

router.get("/assets/*", (req, res) => {
  res.sendFile(path.join(__dirname, "../overlay-svelte", req.url));
});

app.use("/overnightlive", router);

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../overlay-svelte/index.html"));
});

app.get("/assets/*", (req, res) => {
  res.sendFile(path.join(__dirname, "../overlay-svelte", req.url));
});

const server = http.createServer(app);

/* WebSocket */
const events = new EventEmitter();
const wss = new WebSocket.Server({ server });

const listeners = [];

wss.on("connection", (ws) => {
  listeners.push(ws);
  events.emit("connection", ws);

  console.log("Client connected");

  ws.on("message", (message) => {
    events.emit("websocket-message", message.toString());
  });

  ws.on("close", () => {
    listeners.splice(listeners.indexOf(ws), 1);
    console.log("Client disconnected");
  });
});

server.listen(port, () => {
  console.log("Listening on port:" + port);
});

/**
 * @param {string} message
 */
function sendBroadcastMessage(message) {
  listeners.forEach((listener) => {
    listener.send(message);
  });
}

exports.sendBroadcastMessage = sendBroadcastMessage;
exports.events = events;
