/*jslint plusplus: true */
var c = document.getElementById("game");
var ctx = c.getContext("2d");
//c contains the properties of the canvas, ctx is the context for drawing.
var px = [];
var py = [];
var pxtileoffset = [];
var pytileoffset = [];
var i = 0;
var tilebounds = 40;
var boxx = (c.width / 2);
var boxy = (c.height / 2);
//boxx and boxy are the cords of the player boxes top left corner.
var boxw = 50;
var boxh = 50;
var right = false;
var left = false;
var up = false;
//Is the player pressing the d,a or w key?
var inair = true;
//Is the player currently in the air, and should they be going up?
var pyv = 0;
//pyv is the players vertical velocity.
var lowestpy = 0;
//The platform with the highest y value.
var boximg = new Image();
boximg.src = "images/player.jpg";
boximg.onload = function () {
    "use strict";
    boxw = boximg.width;
    boxh = boximg.height;
};
var Tileset1 = new Image();
Tileset1.src = "images/Ground Tileset/Tileset1.png";
var errdistance = 0;

function correctpos() {
    "use strict";
    for (i = 0; i < px.length; i++) {
        py[i] = (py[i] + errdistance);
    }
}
function keyDownHandler(e) {
    "use strict";
    if (e.keyCode === 68) {
        right = true;
    }
    if (e.keyCode === 65) {
        left = true;
    }
    if (e.keyCode === 87) {
        up = true;
        if (inair === false) {
            inair = true;
            pyv = 5;
        }
    }
}

function keyUpHandler(e) {
    "use strict";
    if (e.keyCode === 68) {
        right = false;
    }
    if (e.keyCode === 65) {
        left = false;
    }
    if (e.keyCode === 87) {
        up = false;
    }
}
document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);

function genplat() {
    "use strict";
    px[0] = 260;
    py[0] = 360;
    pxtileoffset[0] = 0;
    pytileoffset[0] = 0;
    px[1] = 300;
    py[1] = 360;
    pxtileoffset[1] = 40;
    pytileoffset[1] = 0;
    px[2] = 340;
    py[2] = 360;
    pxtileoffset[2] = 80;
    pytileoffset[2] = 0;
    px[3] = 260;
    py[3] = 400;
    pxtileoffset[3] = 0;
    pytileoffset[3] = 40;
    px[4] = 300;
    py[4] = 400;
    pxtileoffset[4] = 40;
    pytileoffset[4] = 40;
    px[5] = 340;
    py[5] = 400;
    pxtileoffset[5] = 80;
    pytileoffset[5] = 40;
    px[6] = 260;
    py[6] = 440;
    pxtileoffset[6] = 0;
    pytileoffset[6] = 80;
    px[7] = 300;
    py[7] = 440;
    pxtileoffset[7] = 40;
    pytileoffset[7] = 80;
    px[8] = 340;
    py[8] = 440;
    pxtileoffset[8] = 80;
    pytileoffset[8] = 80;
    for (i = 0; i < px.length; i++) {
        if (py[i] < py[lowestpy]) {
            lowestpy = i;
        }
    }
}
genplat();

function boundscheck() {
    "use strict";
    for (i = 0; i < px.length; i++) {
        if ((boxx >= px[i]) && (boxx <= px[i] + tilebounds) && (boxy + boxh >= py[i]) && (boxy + boxh < py[i] - pyv)) {
            pyv = 0;
            errdistance = ((boxy + boxh) - py[i]);
            inair = false;
            correctpos();
        }
        if ((boxx <= px[i]) && (boxx + boxw >= px[i]) && (boxy + boxh >= py[i]) && (boxy + boxh < py[i] - pyv)) {
            pyv = 0;
            errdistance = ((boxy + boxh) - py[i]);
            inair = false;
            correctpos();
        }
        if ((boxx >= px[i]) && (boxx <= px[i] + tilebounds) && (boxy <= py[i] + tilebounds) && (boxy >= py[i] + pyv) && (pyv > 0)) {
            pyv = -0.1;
            inair = true;
        }
        if ((boxx <= px[i]) && (boxx + boxw >= px[i]) && (boxy <= py[i] + tilebounds) && (boxy >= py[i] + pyv) && (pyv > 0)) {
            pyv = -0.1;
            inair = true;
        }
        if ((py[i] === boxy + boxh) && (boxx + boxw === px[i])) {
            inair = true;
        }
        if ((py[i] === boxy + boxh) && (boxx === px[i] + tilebounds)) {
            inair = true;
        }
    }
    if (py[lowestpy] <= 0) {
        genplat();
        pyv = 0;
    }
}
function draw() {
    "use strict";
    ctx.clearRect(0, 0, c.width, c.height);
    ctx.drawImage(boximg, boxx, boxy);
    for (i = 0; i < px.length; i++) {
        ctx.drawImage(Tileset1, pxtileoffset[i], pytileoffset[i], tilebounds, tilebounds, px[i], py[i], tilebounds, tilebounds);
        py[i] = py[i] + pyv;
        if (right === true) {
            px[i]--;
        }
        if (left === true) {
            px[i]++;
        }
    }
    if (inair === true) {
        pyv = pyv - 0.1;
    }
    boundscheck();
}
var frames = setInterval(draw, 10);
//frames is the frame rate of the game, in this case each tick is every 10ms.