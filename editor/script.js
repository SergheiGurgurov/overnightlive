/**@type {HTMLIFrameElement} */
const iframe = document.querySelector("iframe");
iframe.src = `https://player.twitch.tv/?autoplay=true&channel=animenightlive&parent=${window.location.hostname}`

/**@type {HTMLCanvasElement} */
const canvas = document.querySelector("#drawing-board")
const toolbard = document.querySelector("#toolbar")
const ctx = canvas.getContext("2d")


let isPaining = false
let lineWidth = 5

let startX;
let startY;

toolbard.addEventListener("change", (e) => {
    if (e.target.id === "stroke") {
        ctx.strokeStyle = e.target.value
    }

    else if (e.target.id === "lineWidth") {
        lineWidth = e.target.value
    }
})

canvas.addEventListener("mousedown", (e) => {
    isPaining = true
    startX = e.offsetX
    startY = e.offsetY
})

canvas.addEventListener("mousemove", (e) => {
    if (isPaining) {
        ctx.lineCap = "round"
        ctx.lineWidth = lineWidth
        ctx.beginPath()
        ctx.moveTo(startX, startY)
        ctx.lineTo(e.offsetX, e.offsetY)
        ctx.stroke()
        startX = e.offsetX
        startY = e.offsetY
    }
});

canvas.addEventListener("mouseup", () => {
    isPaining = false;
    ctx.stroke();
    ctx.closePath();
})


function loadCanvas(imageDataUrl) {
    var img = new Image();
    img.onload = function () {
        ctx.drawImage(img, 0, 0);
    }

    img.src = imageDataUrl
}


var socketProtocol = window.location.protocol == "https:" ? "wss:" : "ws:";
var socket = new WebSocket(`${socketProtocol}//${window.location.host}`);

socket.addEventListener('message', function (event) {
});
socket.addEventListener('open', function (event) {
});
socket.addEventListener('close', function (event) {
});
socket.addEventListener('error', function (event) {
});


toolbard.addEventListener("click", (e) => {
    if (e.target.id === "clear") {
        ctx.clearRect(0, 0, canvas.width, canvas.height)
    } else if( e.target.id === "send"){
        socket.send(JSON.stringify({
            type:"canvas-update",
            data:canvas.toDataURL()
        }))
    }
})
