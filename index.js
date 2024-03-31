const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");
let w, h;
const sizeOfMatrix = 3;
const distanceBetweenDots = 75;
const startYofDots = 150;
const TWO_PI = Math.PI * 2;
let mouse2 = { x: undefined, y: undefined };
let canDrawLine = false;
let startDot = { x: undefined, y: undefined, color: undefined };
let selectedDots = [];
//colors: pink = "#FFB6C1", blue = "#87CEFA", yellow = "#FFD700", green = "#98FB98"
const colors = ["#FFB6C1", "#87CEFA", "#FFD700", "#98FB98"];

function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}

function init() {
    w = canvas.width = innerWidth;
    h = canvas.height = innerHeight;
}

class Dot {
    constructor(color, x, y, column) {
        this.color = color;
        this.x = x;
        this._y = y;
        this.column = column;
    }

    get y() {
        return this._y;
    }
    set y(y) {
        if (!this._y) {
            this._y = y;
        } else {
            console.log("медленное перемещение");
            this._y = y;
            // while (this._y !== y) {
            //     this._y += 0.4;
            //     ctx.clearRect(0, 0, w, h);
            //     draw();
            // }
        }
    }
}

function createMatrix(startY, size, step) {
    const arr = [];
    const startX = w / 2 - (size * step) / 2;
    console.log(startX);
    for (let i = 0; i < size; i++) {
        let column = [];
        for (let j = 0; j < size; j++) {
            column.push(
                new Dot(
                    colors[getRandomInt(4)],
                    startX + i * step,
                    startY + j * step,
                    i
                )
            );
        }
        arr.push(column);
    }
    return arr;
}
function createCircle(x, y, rad, fill, color) {
    ctx.fillStyle = ctx.strokeStyle = color;
    ctx.beginPath();
    ctx.arc(x, y, rad, 0, TWO_PI);
    ctx.closePath();
    fill ? ctx.fill() : ctx.stroke();
}

init();
let matrix = createMatrix(startYofDots, sizeOfMatrix, distanceBetweenDots); // запихать в инит

console.log(matrix);

function draw() {
    matrix.forEach((arr) =>
        arr.forEach(
            (dot) => dot && createCircle(dot.x, dot.y, 25, true, dot.color)
        )
    );
    if (selectedDots.length >= 2) {
        ctx.beginPath();
        ctx.strokeStyle = startDot.color;
        ctx.lineWidth = 3;
        ctx.moveTo(selectedDots[0].x, selectedDots[0].y);
        for (let i = 1; i < selectedDots.length; i++) {
            ctx.lineTo(selectedDots[i].x, selectedDots[i].y);
        }
        // ctx.closePath();
        ctx.stroke();
    }
}
draw();

function pointInCircle(dot, mouse) {
    let dx = dot.x - mouse.x;
    let dy = dot.y - mouse.y;
    let dist = Math.sqrt(dx * dx + dy * dy);

    if (dist < 25) return true;
    return false;
}

function onMousePos(canvas, evt) {
    let ClientRect = canvas.getBoundingClientRect();
    mouse2.x = Math.round(evt.clientX - ClientRect.left);
    mouse2.y = Math.round(evt.clientY - ClientRect.top);
}
function onMoveMouseHandler(canvas, evt) {
    onMousePos(canvas, evt);
    if (canDrawLine) {
        ctx.clearRect(0, 0, w, h);
        draw();
        ctx.beginPath();
        ctx.strokeStyle = startDot.color;
        ctx.lineWidth = 3;
        ctx.moveTo(startDot.x, startDot.y);
        ctx.lineTo(mouse2.x, mouse2.y);
        ctx.closePath();
        ctx.stroke();
        matrix.forEach((arr) =>
            arr.forEach((dot) => {
                if (dot) {
                    createCircle(dot.x, dot.y, 25, true, dot.color);
                    if (
                        pointInCircle(dot, mouse2) &&
                        (dot.x === startDot.x || dot.y === startDot.y) &&
                        dot.color === startDot.color
                    ) {
                        selectedDots.push(startDot);
                        // console.log("selectedDots", selectedDots);
                        ctx.clearRect(0, 0, w, h);
                        draw();
                        startDot = dot;
                        ctx.beginPath();
                        ctx.strokeStyle = startDot.color;
                        ctx.lineWidth = 3;
                        ctx.moveTo(startDot.x, startDot.y);
                        ctx.lineTo(mouse2.x, mouse2.y);
                        ctx.closePath();
                        ctx.stroke();
                        // console.log("mouse:", mouse2, "dot:", dot);
                        // startDot = { x: dot.x, y: dot.y, color: dot.color }; //проверить нужно ли
                    } else if (
                        pointInCircle(dot, mouse2) &&
                        ((dot.x !== startDot.x && dot.y !== startDot.y) ||
                            dot.color !== startDot.color)
                    ) {
                        deleteLine();
                        // console.log("not in path");
                    }
                }
            })
        );
    }
}

function onMouseDownHandler(event) {
    matrix.forEach((arr) =>
        arr.forEach((dot) => {
            if (dot) {
                createCircle(dot.x, dot.y, 25, true, dot.color);
                if (pointInCircle(dot, mouse2)) {
                    console.log("mouse:", mouse2, "dot:", dot);
                    canDrawLine = true;
                    startDot = dot;
                } else {
                    console.log("not in path");
                }
            }
        })
    );
}

function deleteLine() {
    canDrawLine = false;
    selectedDots = [];

    ctx.clearRect(0, 0, w, h);
    draw();
}

function onMouseUpHandler(event) {
    console.log("upmouse");
    const newMatrix = matrix.map((column, numberOfColumn) =>
        column.filter((dot) => !selectedDots.includes(dot))
    );
    newMatrix.forEach((column) => {
        let dif = sizeOfMatrix - column.length;
        while (dif) {
            column.unshift(null);
            dif--;
        }
    });
    newMatrix.forEach((column) =>
        column.forEach((dot, index) => {
            if (dot) {
                dot.y = startYofDots + index * distanceBetweenDots;
            }
        })
    );
    // console.log(newMatrix); пройтись по массиву и изменить y, исходя из индекса
    matrix = newMatrix;
    deleteLine();
}
function slowDown() {}
// new Dot(
//     colors[getRandomInt(4)],
//     startX + i * step,
//     startY + j * step,
//     i
// )

//менее точное определение координат мыши
// function setPos({ layerX, layerY }) {
//     [mouse2.x, mouse2.y] = [layerX, layerY];
// }

window.addEventListener("mousedown", onMouseDownHandler);
window.addEventListener("mouseup", onMouseUpHandler);
canvas.addEventListener("mousemove", (e) => onMoveMouseHandler(canvas, e));

function loop() {
    ctx.clearRect(0, 0, w, h); // очищаем canvas
    draw();
    window.requestAnimationFrame(loop);
}

// loop();
