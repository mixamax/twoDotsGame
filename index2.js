const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");
let w, h;
const sizeOfMatrix = 5;
const distanceBetweenDots = 75;
const startYofDots = 150;
let startXofDots;
let matrix;
const TWO_PI = Math.PI * 2;
const dropSpeed = 10;
let mouse2 = { x: undefined, y: undefined };
let canDrawLine = false;
let startDot = { x: undefined, y: undefined, color: undefined };
let selectedDots = [];
//colors: pink = "#FFB6C1", blue = "#87CEFA", yellow = "#FFD700", green = "#98FB98"
const colors = ["#FFB6C1", "#87CEFA", "#FFD700", "#98FB98"];
let scoreOfMove = 20;

function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}

function init() {
    w = canvas.width = innerWidth;
    h = canvas.height = innerHeight;
    startXofDots = w / 2 - (sizeOfMatrix * distanceBetweenDots) / 2;
    matrix = createMatrix();
    scoreMatrix = createScoreMatrix();
}

class scoreDot {
    constructor(color, x) {
        this.color = color;
        this.x = x;
        this.y = 20;
        this.textY = 50;
        this.startScore = 15;
        // this.sound = new Audio();
        // this.sound.src = "pepSound3.mp3";
    }
    setStartScore(score) {
        if (score < 0) {
            this.startScore = 0;
        } else {
            this.startScore = score;
        }
    }
}

class Dot {
    constructor(color, x, y, column) {
        this.color = color;
        this.x = x;
        this._y = y;
        this.column = column;
        this.sound = new Audio();
        this.sound.src = "pepSound3.mp3";
    }

    get y() {
        return this._y;
    }
    set y(y) {
        this._y = y;
    }
}
function createScoreMatrix() {
    const arr = [];
    startX = w / 2 - ((sizeOfMatrix - 1) * distanceBetweenDots) / 2;
    for (let i = 0; i < sizeOfMatrix - 1; i++) {
        arr.push(new scoreDot(colors[i], startX + i * distanceBetweenDots));
    }
    return arr;
}
function createMatrix() {
    const arr = [];

    for (let i = 0; i < sizeOfMatrix; i++) {
        let column = [];
        for (let j = 0; j < sizeOfMatrix; j++) {
            column.push(
                new Dot(
                    colors[getRandomInt(sizeOfMatrix - 1)],
                    startXofDots + i * distanceBetweenDots,
                    startYofDots + j * distanceBetweenDots,
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

console.log(matrix);

function draw() {
    ctx.font = "34px serif";
    ctx.fillStyle = "black";
    ctx.fillText(`${scoreOfMove}`, 600, 30);

    scoreMatrix.forEach((dot) => {
        createCircle(dot.x, dot.y, 15, true, dot.color);
        ctx.font = "18px serif";
        ctx.fillText(`${dot.startScore}`, dot.x - 7.5, dot.textY);
    });

    matrix.forEach((column, columnIndex) =>
        column.forEach((dot, index) => {
            dot && createCircle(dot.x, dot.y, 25, true, dot.color);
            if (!dot) {
                matrix[columnIndex][index] = new Dot(
                    colors[getRandomInt(sizeOfMatrix - 1)],
                    startXofDots + columnIndex * distanceBetweenDots,
                    0,
                    columnIndex
                );
            }

            const finalY = startYofDots + index * distanceBetweenDots;
            if (dot && (dot.y !== finalY || dot.y < finalY)) {
                dot.y += dropSpeed;
                if (dot.y >= finalY) {
                    dot.y = finalY;
                    dot.sound.play();
                }
            }
        })
    );
    if (selectedDots.length >= 2) {
        ctx.beginPath();
        ctx.strokeStyle = startDot.color;
        ctx.lineWidth = 3;
        ctx.moveTo(selectedDots[0].x, selectedDots[0].y);
        for (let i = 1; i < selectedDots.length; i++) {
            ctx.lineTo(selectedDots[i].x, selectedDots[i].y);
        }
        ctx.stroke();
    }
}

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
        matrix.forEach((arr) =>
            arr.forEach((dot) => {
                if (dot) {
                    createCircle(dot.x, dot.y, 25, true, dot.color);
                    if (
                        pointInCircle(dot, mouse2) &&
                        (dot.x === startDot.x || dot.y === startDot.y) &&
                        dot.color === startDot.color
                    ) {
                        if (!selectedDots.includes(startDot)) {
                            selectedDots.push(startDot);
                            new Audio("pepSound1.mp3").play();
                        }

                        startDot = dot;
                    } else if (
                        pointInCircle(dot, mouse2) &&
                        ((dot.x !== startDot.x && dot.y !== startDot.y) ||
                            dot.color !== startDot.color)
                    ) {
                        deleteLine();
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
}

function onMouseUpHandler(event) {
    console.log("upmouse", selectedDots);
    if (selectedDots.length > 1) {
        const color = selectedDots[0].color;
        const scoreDotWithColor = scoreMatrix.find(
            (dot) => dot.color === color
        );
        scoreDotWithColor.setStartScore(
            scoreDotWithColor.startScore - selectedDots.length
        );
        scoreOfMove--;
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

        matrix = newMatrix;
        deleteLine();
        console.log(matrix);
    }
}

window.addEventListener("mousedown", onMouseDownHandler);
window.addEventListener("mouseup", onMouseUpHandler);
canvas.addEventListener("mousemove", (e) => onMoveMouseHandler(canvas, e));

function loop() {
    ctx.clearRect(0, 0, w, h); // очищаем canvas
    draw();
    window.requestAnimationFrame(loop);
}

loop();
