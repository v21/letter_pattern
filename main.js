var canvas = document.getElementById("c", { alpha: false });


/**
 * @type {CanvasRenderingContext2D}
 */
var ctx = canvas.getContext('2d');

function setCanvasSize() {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
    gen();
}
setCanvasSize();
window.addEventListener("resize", setCanvasSize);
window.addEventListener("orientationchange", setCanvasSize);
window.addEventListener("click", gen);


/**
 * Description
 * @param {Array<T>} array
 * @returns {T}
 */
function pickRandom(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

function gen() {
    ctx.clearRect(0, 0, w, h);
    const sz = 60;
    var fr = x => Math.floor(Math.random() * x);
    var setFont = x => ctx.font = Math.round(x).toString() + 'px sans-serif';

    var ps = [];
    for (var i = 1; i + 2 < w / sz; i++) {
        for (var j = 1; j + 2 < h / sz; j++) {
            ps.push({ x: i, y: j, size: 1 });
        }
    }


    ctx.textAlign = "center";


    setFont(25);

    for (const p of ps) {
        var x = p.x * sz + (w % sz) / 2;
        var y = p.y * sz + (h % sz) / 2;
        var s = p.size * sz;
        // ctx.strokeRect(x + 3, y + 3, s - 3, s - 3);
        const fontSize = p.size * 150;
        setFont(fontSize)


        var char = pickRandom(["a", "e"]);
        ctx.fillText(char, x + s * .5, y + fontSize * .5);
    }
}