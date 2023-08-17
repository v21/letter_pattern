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
// window.addEventListener("mousedown", onMouseDown);
// window.addEventListener("mouseup", onMouseUp);
// window.addEventListener("mousemove", onMouseMove);


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

let font = "monospace";


let charSequence = "aaeeaaaee";


let coloursX = ["rgba(0,0,0,1)", "rgba(255,255,255,1)"]; //i
let coloursY = ["rgba(255,0,0,.5)", "rgba(255,0,255,.5)"]; //i


/**
 * A number, or a function returning a number.
 * @typedef {(number|() => number)} NumberOrNumberGen
 */


/**
 * @type {NumberOrNumberGen[]}
 */
let anglesX = [12, 82, 171, 280];
/**
 * @type {NumberOrNumberGen[]}
 */
let anglesY = [270, 180, 90, 0];

let isDrawnsX = [true];
let isDrawnsY = [false];


let sizesX = [1,];
let sizesY = [0,];
// let sizesX = [1, -1, 1, -1];
// let sizesY = [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, .8, .9, 1];


let fontStyle = "";

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
                angle: (resolve(modInto(anglesX, i)) + resolve(modInto(anglesY, j))) * Math.PI / 180, // pickRandom([90, 270, 0, 180, 0]) * Math.PI / 180,
                // angle: Math.random() * 360 * Math.PI / 180,
                char: resolve(modInto(charSequence, k - 1)),
                // char: pickRandom(["a", "e", "o"]),
                isDrawn: xor(resolve(modInto(isDrawnsX, i)), resolve(modInto(isDrawnsY, j))), //Math.random() > .125,
                colourX: resolve(modInto(coloursX, i)),
                colourY: resolve(modInto(coloursY, j)),
                size: Math.abs(resolve(modInto(sizesX, i)) - resolve(modInto(sizesY, j))),
            };
            elems.push(elem);
        }
    }
}

/**
 * Description
 * @param {NumberOrNumberGen} val
 * @returns {number}
 */
function resolve(val) {

    if (val instanceof Function) {
        return val();
    } else {
        return val;
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
    var setFont = x => ctx.font = fontStyle + " " + Math.round(x).toString() + 'px ' + font;




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

    sz = Math.max(5, sz);


    genPattern();
    draw();


}

//preincludes generic fonts
let loadedFonts = ["monospace", "serif", "sans-serif"];

/**
 * Description
 * @this HTMLSelectElement
 * @param {Event} ev
 * @returns {void}
 */
function onFontDropdownChanged(ev) {
    font = this.value;

    if (!loadedFonts.includes(font)) {

        WebFont.load({
            google: {
                families: [font],
            },
            classes: false,
            active: function () {
                loadedFonts.push(font);
                genPattern();
                draw();
            },
        },);

    }


    genPattern();
    draw();
}

function listenToCodeBlock() {
    codeDiv.addEventListener("input", onCodeChange);
    onCodeChange();
}

function populateFontDropdown() {
    /**
     * @type {HTMLSelectElement}
     */
    var dropdown = document.getElementById("font-select");

    const fonts = ["monospace", "serif", "sans-serif", "Barriecito", "EB Garamond", "Xanh Mono", "IBM Plex Mono", "Inter Tight", "Nunito", "Oswald", "Sono", "Gluten", "Old Standard TT"];

    for (const font of fonts) {
        const option = document.createElement("option");

        option.value = font;
        option.text = font;
        dropdown.add(option, null);
    }

    dropdown.addEventListener("change", onFontDropdownChanged);
}


setCanvasSize();
listenToCodeBlock();
populateFontDropdown();

function raf() {
    setCanvasSize();
    genPattern();
    draw();
    // requestAnimationFrame(raf);
}
// raf();



