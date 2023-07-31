var canvas = document.getElementById("c", { alpha: false });


/**
 * @type {CanvasRenderingContext2D}
 */
var ctx = canvas.getContext('2d');

function setCanvasSize() {
    var size = Math.min(window.innerWidth, window.innerHeight - 205);

    w = canvas.width = size;
    h = canvas.height = size;
    draw();
}
window.addEventListener("resize", raf);
window.addEventListener("orientationchange", raf);
window.addEventListener("mousedown", onMouseDown);
window.addEventListener("mouseup", onMouseUp);
window.addEventListener("mousemove", onMouseMove);


/**
 * Description
 * @param {Array<T>} array
 * @returns {T}
 */
function pickRandom(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}


/**
 * Description
 * @param {Array<T>} array
 * @param {number} index
 * @returns {T}
 */
function modInto(arr, index) {
    return arr[index % arr.length];
}

function xor(a, b) {
    return !a != !b;
}


let HALF_PI = Math.PI * .5;
let PI = Math.PI;
let TAU = Math.PI * 2;


let sz = 50;


/**
 * @typedef {Object} ElemDef - defines a square of the pattern grid
 * @property {number} x - x position (top left)
 * @property {number} y - y position (top left)
 * @property {number} i - index into the elem array
 * @property {number} angle - rotation of the letter
 * @property {number} size - size of the letter
 * @property {String} char - what is drawn
 * @property {String} colourX - what is drawn
 * @property {String} colourY - what is drawn
 * @property {boolean} isDrawn -is it drawn or skipped
 */

/**
 * Description
 * @param {number} x
 * @param {number} y
 * @returns {ElemDef[]}
 */
function getElementsAtPos(x, y) {
    return elems.filter(e => e.x < x && e.x + sz > x && e.y < y && e.y + sz > y);
}



let charSequence = "aaeeaaaee";


let coloursX = ["rgba(0,0,0,1)", "rgba(255,255,255,1)"]; //i
let coloursY = ["rgba(255,0,0,.5)", "rgba(255,0,255,.5)"]; //i


let anglesX = [12, 82, 171, 280];
let anglesY = [270, 180, 90, 0];

let isDrawnsX = [true];
let isDrawnsY = [false];


let sizesX = [1,];
let sizesY = [0,];
// let sizesX = [1, -1, 1, -1];
// let sizesY = [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, .8, .9, 1];


/**
 * @type {ElemDef[]}
 */
var elems = [];

function genPattern() {
    elems = [];

    var k = 0;
    for (var j = 1; j + 2 < h / sz; j++) {
        for (var i = 1; i + 2 < w / sz; i++) {
            const elem = {
                x: i * sz + (w % sz) / 2,
                y: j * sz + (h % sz) / 2,
                i: k++,
                angle: (modInto(anglesX, i) + modInto(anglesY, j)) * Math.PI / 180, // pickRandom([90, 270, 0, 180, 0]) * Math.PI / 180,
                // angle: Math.random() * 360 * Math.PI / 180,
                char: modInto(charSequence, k - 1),
                // char: pickRandom(["a", "e", "o"]),
                isDrawn: xor(modInto(isDrawnsX, i), modInto(isDrawnsY, j)), //Math.random() > .125,
                colourX: modInto(coloursX, i),
                colourY: modInto(coloursY, j),
                size: Math.abs(modInto(sizesX, i) - modInto(sizesY, j)),
            };
            elems.push(elem);
        }
    }
}

let mouseClicked = false;

/**
 * Description
 * @param {MouseEvent?} ev
 * @returns {void}
 */
function onMouseUp(ev) {
    mouseClicked = false;
    lastEditedI = null;
}


/**
 * Description
 * @param {MouseEvent?} ev
 * @returns {void}
 */
function onMouseDown(ev) {

    mouseClicked = true;
}

/**
 * @type {number?}
 */
let lastEditedI = null;

/**
 * Description
 * @param {MouseEvent?} ev
 * @returns {void}
 */
function onMouseMove(ev) {

    if (mouseClicked) {
        let clicked = getElementsAtPos(ev.pageX, ev.pageY);



        for (const c of clicked) {
            if (c.i == lastEditedI) continue;
            c.angle = c.angle + 90 * Math.PI / 180;
            // c.char = pickRandom(["a", "e", "o"]);
            // c.isDrawn = Math.random() > .125;
            lastEditedI = c.i;
        }





        draw();
    }

}



function draw() {
    ctx.clearRect(0, 0, w, h);

    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, w, h);

    ctx.fillStyle = "black";


    var fr = x => Math.floor(Math.random() * x);
    var setFont = x => ctx.font = Math.round(x).toString() + 'px monospace';




    ctx.textAlign = "center";


    setFont(25);

    for (const p of elems) {
        ctx.save();
        var x = p.x;
        var y = p.y;
        var s = sz;
        const fontSize = sz * p.size;
        setFont(fontSize)


        // var char = pickRandom(["a", "e", "i"][p.i % 3]);

        ctx.translate(x + s * .5, y + s * .5);
        ctx.rotate(p.angle);
        // ctx.rotate(pickRandom([90, 270, 0, 180, 0]) * Math.PI / 180);
        // ctx.rotate(([90, 270, 0, 180, 0][p.i % 5]) * Math.PI / 180);

        // ctx.fillRect(0, 0, 5, 5);
        if (p.isDrawn) {

            ctx.fillStyle = p.colourX;
            ctx.fillText(p.char, 0, fontSize * .25);
            ctx.globalCompositeOperation = "difference";
            ctx.fillStyle = p.colourY;
            ctx.fillText(p.char, 0, fontSize * .25);
            ctx.globalCompositeOperation = "source-over";
        }
        ctx.restore();
    }
}


//TODO: perf would be better if we did the two colour passes completely, rather than interleaving them
// or even better! and look nicer! if we did the colour math ourselves & just rendered it once

/**
 * @type {HTMLTextAreaElement}
 */
var codeDiv = document.getElementById("code");

/**
 * Description
 * @param {Event} ev
 * @returns {void}
 */
function onCodeChange(ev) {
    try {
        eval(codeDiv.value);
        codeDiv.style = "background-color: powderblue;";
    } catch (e) {
        console.log(" error: ", e.message);
        codeDiv.style = "background-color: plum;";
    }

    genPattern();
    draw();

}

function listenToCodeBlock() {



    codeDiv.addEventListener("input", onCodeChange);
    onCodeChange();
}

setCanvasSize();
listenToCodeBlock();

function raf() {
    setCanvasSize();
    genPattern();
    draw();
    // requestAnimationFrame(raf);
}
// raf();



