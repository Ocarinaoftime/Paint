interface MousePos {
    x: number;
    y: number;
}
let mouseDown: boolean = false;
let mouseMove: boolean = false;
let numOfPerson = -1;
let numOfOtherPerson = -1;
const socket: SocketIOClient.Socket = io();
const canvas = document.getElementById("paint");
const sizeEl = document.getElementById("size");
const sizeNum = document.getElementById("sizeNum");
if (sizeEl != null) {
    sizeEl.onchange = () => {
        if (sizeNum != null) {
            sizeNum.innerHTML = ((sizeEl instanceof HTMLInputElement) ? sizeEl.value : "10");
        }
    }
}

const ctx = (canvas instanceof HTMLCanvasElement) ? canvas.getContext('2d') : null;
function getMousePos(canvas: any, evt: MouseEvent): MousePos {
  var rect = canvas?.getBoundingClientRect();
  return {
    x: evt.clientX - rect.left,
    y: evt.clientY - rect.top
  };
}
window.onmousedown = (event: MouseEvent) => {
   mouseDown = true;
}
window.onmouseup = (event: MouseEvent) => {
   mouseDown = false;
}

window.onmousemove = (event: MouseEvent) => {
    if (!mouseDown) return;
    const target = event.target;
    const mousePos: MousePos = getMousePos(canvas, event);
    let size = (sizeEl instanceof HTMLInputElement) ? parseInt(sizeEl.value) : parseInt("10");
    if (target && target?.id == "paint" && ctx) {
        socket.emit("dot", {whom: numOfOtherPerson, x: mousePos.x, y: mousePos.y, size: size})
        ctx.beginPath();
        ctx.fillStyle = "blue";
        ctx.arc(mousePos.x, mousePos.y, size, 0, 2*Math.PI);
        ctx.fill();
        ctx.closePath();
    }
}

socket.on("Error", (msg: string) => {throw new Error(msg)});
socket.on("currRoom", (room: number) => {
    numOfPerson = room;
    if (room == 1) {
        numOfOtherPerson = 2;
    } else if (room == 2) {
        numOfOtherPerson = 1;
    }
})
socket.on("dot", ({x, y, size}) => {
    if (ctx) {
        console.log("dot has size", size);
        ctx.beginPath();
        ctx.fillStyle = "red";
        ctx.arc(x, y, size, 0, 2*Math.PI);
        ctx.fill();
        ctx.closePath();
    }
})
