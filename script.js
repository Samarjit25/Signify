const canvas = document.getElementById('signature-pad');
const ctx = canvas.getContext('2d');
let isDrawing = false;
let lastX = 0;
let lastY = 0;
let drawingHistory = [];

function draw(e) {
    if (!isDrawing) return;

    ctx.strokeStyle = '#000';
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    ctx.beginPath();
    ctx.moveTo(lastX, lastY);
    const pos = getMousePos(e);
ctx.lineTo(pos.x, pos.y);

    ctx.stroke();

    [lastX, lastY] = [e.offsetX, e.offsetY];
}

function saveState() {
    drawingHistory.push(ctx.getImageData(0, 0, canvas.width, canvas.height));
}

function undoLastAction() {
    if (drawingHistory.length > 0) {
        drawingHistory.pop(); // remove current state
        if (drawingHistory.length > 0) {
            ctx.putImageData(drawingHistory[drawingHistory.length - 1], 0, 0);
        } else {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        }
    }
}
function resizeCanvas() {
    const canvas = document.getElementById('signature-pad');
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
}
window.addEventListener('load', resizeCanvas);
window.addEventListener('resize', resizeCanvas);

function getMousePos(e) {
    const rect = canvas.getBoundingClientRect();
    return {
        x: (e.clientX - rect.left) * (canvas.width / rect.width),
        y: (e.clientY - rect.top) * (canvas.height / rect.height)
    };
}
// Only save state once per stroke
canvas.addEventListener('mousedown', (e) => {
    isDrawing = true;
    [lastX, lastY] = [e.offsetX, e.offsetY];
});

canvas.addEventListener('mousemove', draw);
canvas.addEventListener('mouseup', () => {
    if (isDrawing) {
        isDrawing = false;
        saveState(); // Save after completing the stroke
    }
});
canvas.addEventListener('mouseout', () => isDrawing = false);

document.getElementById('clear').addEventListener('click', () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawingHistory = [];
});

document.getElementById('undo').addEventListener('click', undoLastAction);

document.getElementById('save').addEventListener('click', () => {
    const dataURL = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.href = dataURL;
    link.download = 'signature.png';
    link.click();
});
