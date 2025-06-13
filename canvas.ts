const canvas = document.getElementById('paint');
const ctx: CanvasRenderingContext2D | null = (canvas instanceof HTMLCanvasElement) ? canvas.getContext('2d') : null;
const sizeCanvas = document.getElementById('sizeCanvas');
const ctx1: CanvasRenderingContext2D | null = (sizeCanvas instanceof HTMLCanvasElement) ? sizeCanvas.getContext('2d') : null;
function drawSizeCanvas(can: any, color: string | CanvasGradient | CanvasPattern) {
    if (ctx1 != null) {
        ctx1.clearRect(0, 0, can.width, can.height);
        ctx1.beginPath();
        ctx1.fillStyle = color;
        ctx1.arc(can.width/2, can.height/2, size, 0, 2*Math.PI);
        ctx1.fill();
        ctx1.closePath();
    }
}
window.requestAnimationFrame(loop)
function loop() {
    drawSizeCanvas(sizeCanvas, color);
    requestAnimationFrame(loop);
}   


