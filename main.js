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

function op(a, b, op) {
    switch (op) {
        case "xor":
            return xor(a, b);
        case "and":
            return and(a, b);
        case "or":
            return or(a, b);
        case "nor":
            return nor(a, b);
    }
}

function xor(a, b) {
    return !a != !b;
}

function and(a, b) {
    return a && b;
}

function or(a, b) {
    return a || b;
}

function nor(a, b) {
    return !(a == b);
}


let HALF_PI = Math.PI * .5;
let PI = Math.PI;
let TAU = Math.PI * 2;




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
 * @property {boolean} isHorizFlipped -is it flipped on the X axis
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


let charSequence = "1234567890";

let writingMode = 0;
// 0 is ltr
// 1 is rtl
// 2 is vertical down
// 3 is vertical up
// 4 is bouphestron



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
let isDrawnsOp = "xor";


let sizesX = [1,];
let sizesY = [0,];
// let sizesX = [1, -1, 1, -1];
// let sizesY = [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, .8, .9, 1];

let countX = 10;
let countY = 10;


let fontStyle = "";

/**
 * @type {ElemDef[]}
 */
var elems = [];

function genPattern() {
    elems = [];

    var k = 0;
    const spacingX = w / (countX + 2);
    const spacingY = h / (countY + 2);
    for (var j = 0; j < countY; j++) {
        for (var i = 0; i < countX; i++) {

            const elem = {
                x: (i + 1) * spacingX,
                y: (j + 1) * spacingY,
                i: k++,
                angle: (resolve(modInto(anglesX, i)) + resolve(modInto(anglesY, j))) * Math.PI / 180, // pickRandom([90, 270, 0, 180, 0]) * Math.PI / 180,
                // angle: Math.random() * 360 * Math.PI / 180,
                char: resolve(modInto(charSequence, getCharSequenceIndex(i, j, countX, countY, writingMode))),
                // char: pickRandom(["a", "e", "o"]),
                isDrawn: op(resolve(modInto(isDrawnsX, i)), resolve(modInto(isDrawnsY, j)), isDrawnsOp), //Math.random() > .125,
                colourX: resolve(modInto(coloursX, i)),
                colourY: resolve(modInto(coloursY, j)),
                size: Math.abs(resolve(modInto(sizesX, i)) - resolve(modInto(sizesY, j))),
                isHorizFlipped: writingMode == 5 && (j % 2 == 1)
            };
            elems.push(elem);
        }
    }
}

function getCharSequenceIndex(x, y, width, height, writingMode) {
    switch (writingMode) {
        case 0: //ltr
            return x + y * width;

        case 1: //rtl
            return (width - x - 1) + y * width;
        case 2: //top to bottom
            return y + x * height;
        case 3: //bottom to top
            return (height - y - 1) + (width - x - 1) * height;

        case 4: //pacing bull
        case 5: //pacing bull, authentic
            if (y % 2 == 0) {
                return x + y * width;
            }
            else {
                return (width - x - 1) + y * width;
            }

        case 6:
            x = Math.round(x - width * .5);
            y = Math.round(y - height * .5);
            let p;
            if (y * y >= x * x) {
                p = 4 * y * y - y - x;
                if (y < x) {
                    p = p - 2 * (y - x);
                }
            }
            else {
                p = 4 * x * x - y - x;
                if (y < x) {
                    p = p + 2 * (y - x)
                }
            }
            return p;


        default:
            break;
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


    const spacingX = w / (countX + 2);
    const spacingY = h / (countY + 2);

    for (const p of elems) {
        ctx.save();
        var x = p.x;
        var y = p.y;
        const fontSize = Math.min(spacingX, spacingY) * p.size;
        setFont(fontSize)


        // var char = pickRandom(["a", "e", "i"][p.i % 3]);

        ctx.translate(x + spacingX * .5, y + spacingY * .5);
        ctx.rotate(p.angle);
        if (p.isHorizFlipped) {
            ctx.scale(-1, 1);
        }
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

//preincludes generic fonts
let loadedFonts = ["monospace", "serif", "sans-serif",

    "Barriecito",
    "EB Garamond",
    "Xanh Mono",
    "IBM Plex Mono",
    "Inter Tight",
    "Nunito",
    "Oswald",
    "Sono",
    "Gluten",
    "Old Standard TT",
    "BIZ UDPMincho",
    "Zen Old Mincho",
    "Instrument Serif",
    //local
    "Select Mono",
    "JGS",
    "Basteleur",
    "Lithops",
    "Sligoil",
    "Pilowlava",
    "PicNic",
    "TINY",
    "Avara",
    "Kaeru Kaeru",
    "Bluu Next",
    "Savate",
    "Nyght Serif",
    "Nyght Serif Italic",
    "Piscolabis",
    "Roubaix Industrielle",
    "Picaflor",
    "Generale Station",
];

/**
 * Description
 * @this HTMLSelectElement
 * @param {Event} ev
 * @returns {void}
 */
function onFontDropdownChanged(ev) {
    font = this.value;

    try {
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
    } catch {

    }

    setTimeout(() => {
        genPattern();
        draw();
    }, 100);


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

    const fonts = ["monospace",
        "serif",
        "sans-serif",
        //google fonts
        "Barriecito",
        "EB Garamond",
        "Xanh Mono",
        "IBM Plex Mono",
        "Inter Tight",
        "Nunito",
        "Oswald",
        "Sono",
        "Gluten",
        "Old Standard TT",
        "BIZ UDPMincho",
        "Zen Old Mincho",
        "Instrument Serif",
        //local
        "Select Mono",
        "JGS",
        "Basteleur",
        "Lithops",
        "Sligoil",
        "Pilowlava",
        "PicNic",
        "TINY",
        "Avara",
        "Kaeru Kaeru",
        "Bluu Next",
        "Savate",
        "Nyght Serif",
        "Nyght Serif Italic",
        "Piscolabis",
        "Roubaix Industrielle",
        "Picaflor",
        "Generale Station",
    ];

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



