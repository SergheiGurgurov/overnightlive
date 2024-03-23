/**@type {HTMLIFrameElement} */
const iframe = document.querySelector("iframe");
iframe.src = `https://player.twitch.tv/?autoplay=true&channel=animenightlive&parent=${window.location.hostname}`

/**@type {HTMLCanvasElement} */
const canvas = document.querySelector("#drawing-board")
const toolbard = document.querySelector("#toolbar")
const ctx = canvas.getContext("2d")


let isPaining = false

let startX;
let startY;

let lineWidth = document.getElementById("lineWidth").value
let color = document.getElementById("stroke").value;
let alpha = Number(document.getElementById("opacity").value).toString(16);
let compositeOperation = document.getElementById("tool").value;
console.log(compositeOperation)
ctx.globalCompositeOperation = compositeOperation;

toolbard.addEventListener("change", (e) => {
    if (e.target.id === "stroke") {
        color = e.target.value;
        ctx.strokeStyle = color + alpha
    }

    if(e.target.id === "opacity"){
        alpha = Number(e.target.value).toString(16);
        if(alpha.length == 1) {
            alpha = "0" + alpha;
        }
        ctx.strokeStyle = color + alpha
    }

    if (e.target.id === "tool") {
        compositeOperation = e.target.value;
    }

    else if (e.target.id === "lineWidth") {
        lineWidth = e.target.value
    }
})

canvas.addEventListener("mousedown", (e) => {
    isPaining = true
    startX = e.offsetX
    startY = e.offsetY
    ctx.globalCompositeOperation = compositeOperation;
})

canvas.addEventListener("mousemove", (e) => {
    /* if(alpha == "00") {
        ctx.fillCircle(e.offsetX, e.offsetY, lineWidth, "#000");
        return
    } */

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
var socket = new WebSocket(`${socketProtocol}//${window.location.host}/overnightlive`);

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
