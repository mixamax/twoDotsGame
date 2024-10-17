// const canvas = document.querySelector("canvas");
// const ctx = canvas.getContext("2d");
let w: number;
let h: number;
const sizeOfMatrix = 5;
const distanceBetweenDots = 75;
const startYofDots = 150;
let startXofDots: number;
let matrix: (Dot | null)[][] = [];
let radiusOfDot = 25;
const TWO_PI = Math.PI * 2;
const dropSpeed = 10;
let mouse2 = { x: 0, y: 0 };
let canDrawLine = false;
let startDot: Dot;
let selectedDots: Dot[] = [];
const colors = ["#FFB6C1", "#87CEFA", "#FFD700", "#98FB98"];
let scoreOfMove: number;
export let scoreMatrix: scoreDot[] = [];

function getRandomInt(max: number) {
    return Math.floor(Math.random() * max);
}

export function init(
    canvas: HTMLCanvasElement,
    width: number,
    initMove: number
) {
    w = canvas.width = width;
    h = canvas.height = 500;
    startXofDots = w / 2 - ((sizeOfMatrix - 1) * distanceBetweenDots) / 2;
    matrix = createMatrix();
    scoreMatrix = createScoreMatrix();
    scoreOfMove = initMove;
    return scoreMatrix;
}

export class scoreDot {
    color: string;
    x: number;
    y: number;
    textY: number;
    startScore: number;
    constructor(color: string, x: number) {
        this.color = color;
        this.x = x;
        this.y = 20;
        this.textY = 50;
        this.startScore = 15;
    }
    setStartScore(score: number) {
        if (score < 0) {
            this.startScore = 0;
        } else {
            this.startScore = score;
        }
    }
}

export class Dot {
    color: string;
    x: number;
    private _y: number;
    column: number;
    sound: HTMLAudioElement;
    constructor(color: string, x: number, y: number, column: number) {
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
    let startX = w / 2 - ((sizeOfMatrix - 1) * distanceBetweenDots) / 2;
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

function createCircle(
    x: number,
    y: number,
    rad: number,
    fill: boolean,
    color: string,
    ctx: CanvasRenderingContext2D
) {
    ctx.fillStyle = ctx.strokeStyle = color;
    ctx.beginPath();
    ctx.arc(x, y, rad, 0, TWO_PI);
    ctx.closePath();
    fill ? ctx.fill() : ctx.stroke();
}

function draw(ctx: CanvasRenderingContext2D) {
    matrix.forEach((column, columnIndex) =>
        column.forEach((dot, index) => {
            dot &&
                createCircle(dot.x, dot.y, radiusOfDot, true, dot.color, ctx);
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

function pointInCircle(dot: Dot, mouse: typeof mouse2) {
    let dx = dot.x - mouse.x;
    let dy = dot.y - mouse.y;
    let dist = Math.sqrt(dx * dx + dy * dy);

    if (dist < 25) return true;
    return false;
}

function onMousePos(canvas: HTMLCanvasElement, evt: MouseEvent) {
    let ClientRect = canvas.getBoundingClientRect();
    mouse2.x = Math.round(evt.clientX - ClientRect.left);
    mouse2.y = Math.round(evt.clientY - ClientRect.top);
}
export function onMoveMouseHandler(
    canvas: HTMLCanvasElement,
    evt: MouseEvent,
    ctx: CanvasRenderingContext2D
) {
    onMousePos(canvas, evt);
    if (canDrawLine) {
        matrix.forEach((arr) =>
            arr.forEach((dot) => {
                if (dot) {
                    createCircle(dot.x, dot.y, 25, true, dot.color, ctx);
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
    return selectedDots;
}

export function onMouseDownHandler(ctx: CanvasRenderingContext2D) {
    matrix.forEach((arr) =>
        arr.forEach((dot) => {
            if (dot) {
                createCircle(dot.x, dot.y, 25, true, dot.color, ctx);
                if (pointInCircle(dot, mouse2)) {
                    // console.log("mouse:", mouse2, "dot:", dot);
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

export function onMouseUpHandler() {
    if (selectedDots.length > 1) {
        const color = selectedDots[0].color;
        const scoreDotWithColor = scoreMatrix.find(
            (dot) => dot.color === color
        );
        if (scoreDotWithColor) {
            scoreDotWithColor.setStartScore(
                scoreDotWithColor.startScore - selectedDots.length
            );
        }

        scoreOfMove--;
        const newMatrix = matrix.map((column) =>
            // @ts-ignore
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
    }
    return { scoreMatrix, scoreOfMove };
}

export function loop(ctx: CanvasRenderingContext2D) {
    ctx.clearRect(0, 0, w, h); // очищаем canvas
    draw(ctx);
    window.requestAnimationFrame(() => loop(ctx));
}
