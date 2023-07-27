var canvas = document.getElementById("c", { alpha: false });


/**
 * @type {CanvasRenderingContext2D}
 */
var ctx = canvas.getContext('2d');

function setCanvasSize() {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
    draw();
}
window.addEventListener("resize", setCanvasSize);
window.addEventListener("orientationchange", setCanvasSize);
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


let HALF_PI = Math.PI * .5;
let PI = Math.PI;
let TAU = Math.PI * 2;


const sz = 25;


/**
 * @typedef {Object} ElemDef - defines a square of the pattern grid
 * @property {number} x - x position (top left)
 * @property {number} y - y position (top left)
 * @property {number} i - index into the elem array
 * @property {number} angle - rotation of the letter
 * @property {number} size - size of the letter
 * @property {String} char - what is drawn
 * @property {String} colour - what is drawn
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



let angles = [0, 90, 0, 90, 0, 90, 45, 90,];  //j
let chars = ["a", "e", "o"]; //i
let isDrawns = [true, true, true, true, false]; //j
let colours = ["rgba(0,0,0,1)", "rgba(0,0,0,.5)", "rgba(0,0,0,1)"]; //i
let sizes = [2.5, 1, 1.5, 1, 0.5]; //j


/**
 * @type {ElemDef[]}
 */
var elems = [];

function genPattern() {
    elems = [];

    var k = 0;
    for (var i = 1; i + 2 < w / sz; i++) {
        for (var j = 1; j + 2 < h / sz; j++) {
            const elem = {
                x: i * sz + (w % sz) / 2,
                y: j * sz + (h % sz) / 2,
                i: k++,
                angle: modInto(angles, j) * Math.PI / 180, // pickRandom([90, 270, 0, 180, 0]) * Math.PI / 180,
                // angle: Math.random() * 360 * Math.PI / 180,
                char: modInto(chars, i),
                // char: pickRandom(["a", "e", "o"]),
                isDrawn: modInto(isDrawns, j), //Math.random() > .125,
                colour: modInto(colours, i),
                size: modInto(sizes, j),
            };
            elems.push(elem);
        }
    }
}

let mouseClicked;

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
    var setFont = x => ctx.font = Math.round(x).toString() + 'px sans-serif';




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

            ctx.fillStyle = p.colour;
            ctx.fillText(p.char, 0, fontSize * .25);
        }
        ctx.restore();
    }
}



setCanvasSize();
genPattern();
draw();