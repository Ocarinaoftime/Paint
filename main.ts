interface MousePos {
    x: number;
    y: number;
}
interface RoomData {
    currRoom: number;
    color: string;
}
interface DotData {
    x: number;
    y: number;
    size: number;
    col: string;
}
let mouseDown: boolean = false;
let mouseMove: boolean = false;
let numOfPerson = -1;
let numOfOtherPerson = -1;
let color = "blue";
const socket: SocketIOClient.Socket = io();
let size: number = 10;
const sizeEl = document.getElementById("size");
const sizeNum = document.getElementById("sizeNum");
const colorEl = document.getElementById("color");
if (sizeEl != null) {
    sizeEl.onchange = () => {
        size = (sizeEl instanceof HTMLInputElement) ? parseInt(sizeEl.value) : parseInt("10");
    }
    window.onkeyup = (e: KeyboardEvent) => {
        size = (sizeEl instanceof HTMLInputElement) ? parseInt(sizeEl.value) : parseInt("10");
    }
}
if (colorEl != null) {
    colorEl.onchange = () => {
        color = (colorEl instanceof HTMLInputElement) ? colorEl.value : "blue";
    }
}


function getMousePos(canvasEl: any, evt: MouseEvent): MousePos {
  var rect = canvasEl?.getBoundingClientRect();
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
    
    if (target && target?.id == "paint" && ctx) {
        socket.emit("dot", {whom: numOfOtherPerson, x: mousePos.x, y: mousePos.y, size: size, col: color})
        ctx.beginPath();
        ctx.fillStyle = color;
        ctx.arc(mousePos.x, mousePos.y, size, 0, 2*Math.PI);
        ctx.fill();
        ctx.closePath();
    }
}

socket.on("Error", (msg: string) => {throw new Error(msg)});
socket.on("currRoom", (data: RoomData) => {
    console.log(JSON.stringify(data));
    numOfPerson = data.currRoom;
    console.log(`You are in room ${data.currRoom}\nYour color is ${data.color}`);
    if (data.currRoom == 1) {
        numOfOtherPerson = 2;
    } else if (data.currRoom == 2) {
        numOfOtherPerson = 1;
    }
    color = data.color;
})
socket.on("dot", (data: DotData) => {
    if (ctx) {
        console.log("data: " + JSON.stringify(data));
        ctx.beginPath();
        ctx.fillStyle = data.col;
        ctx.arc(data.x, data.y, data.size, 0, 2*Math.PI);
        ctx.fill();
        ctx.closePath();
    }
})
