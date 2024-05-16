import { decode } from "./helpers";
import { scoreboard } from "./store";

var socketProtocol = window.location.protocol == "https:" ? "wss:" : "ws:";
var socket = new WebSocket(
  `${socketProtocol}//${window.location.host}/overnightlive`
);

socket.addEventListener("message", function (event) {
  /** @type {{type:string,data:any}} */
  const message = decode(event.data);
  if (message.type == "scoreboard-update") {
    console.log("Received Socket Message:", message);
    /**@type {ScoreboardData} */
    const scoreboardData = message.data;
    const arr = Array.from(scoreboardData.list)
      .map(([key, value]) => value)
      .sort((a, b) => b.score - a.score);
    scoreboard.set(arr);
  } else if (message.type == "canvas-update") {
    console.log("Received Socket Message:", message);
  } else {
    console.log("Received Socket Message:", message);
  }
});

socket.addEventListener("open", function (event) {
  console.log("Connected to server");
});

socket.addEventListener("close", function (event) {
  console.log("Server connection closed: ", event.reason);
});

socket.addEventListener("error", function (event) {
  console.log("WebSocket error: ", event);
});
