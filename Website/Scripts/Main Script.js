/*jslint plusplus: true */
var c = document.getElementById("game");
var ctx = c.getContext("2d");
//c contains the properties of the canvas, ctx is the context for drawing.
var px = [];
var py = [];
var pxtileoffset = [];
var pytileoffset = [];
var i = 0;
var n1 = 0;
var mousex = 0;
var mousey = 0;
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
var canright=true;
var canleft=true;
var inair = true;
//Is the player currently in the air, and should they be going up?
var pyv = 0;
var pxv = 1;
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
        canleft=true;
        canright=true;
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
    px[9] = 300;
    py[9] = 320;
    pxtileoffset[9] = 40;
    pytileoffset[9] = 40;
    px[10] = 300;
    py[10] = 220;
    pxtileoffset[10] = 40;
    pytileoffset[10] = 40;
    for (i = 0; i < px.length; i++) {
        if (py[i] > py[lowestpy]) {
            lowestpy = i;
        }
    }
    clearInterval(collisioncheck);
    collisioncheck=setInterval(boundscheck,10);
}

function boundscheck() {
    "use strict";
    for (i = 0; i < px.length; i++) {
        if(((boxy+boxh-pyv>=py[i])&&(boxx<=px[i])&&(boxx+boxw>px[i])&&(pyv<0)&&(boxy+boxh<=py[i]))||((boxy+boxh-pyv>=py[i])&&(boxx>=px[i])&&(boxx<=px[i]+tilebounds)&&(pyv<0)&&(boxy<=py[i]))){
            var pyi=py[i];
            for(n1 = 0; n1 < px.length; n1++){
                py[n1]=py[n1]-(pyi-(boxy+boxh));
                inair=false;
                pyv=0;
            }  
        }
        if((boxx+boxw-pyv>=px[i])&&(boxy+boxh>=py[i]+tilebounds)&&(boxy<=py[i]+tilebounds)&&(right===true)&&(boxx<px[i])){
            var pxi=px[i];
            for(n1 = 0; n1 < px.length; n1++){
                px[n1]=px[n1]-(pxi-(boxx+boxw));
                canright=false;
            } 
        }
        if(((boxx+boxw-pyv>=px[i])&&(boxy<=py[i])&&(boxy+boxh>=py[i])&&(right===true)&&(boxx<px[i]))){
            var pxi=px[i];
            for(n1 = 0; n1 < px.length; n1++){
                px[n1]=px[n1]-(pxi-(boxx+boxw));
                canright=false;
            } 
        }
        if(((boxx-pyv<=px[i]+tilebounds)&&(boxy+boxh>=py[i]+tilebounds)&&(boxy<=py[i]+tilebounds)&&(left===true))||((boxx-pyv<=px[i]+tilebounds)&&(boxy<=py[i])&&(boxy+boxh>py[i])&&(left===true))){
            var pxi=px[i];
            for(n1 = 0; n1 < px.length; n1++){
                //px[n1]=px[n1]-(pxi-(boxx+boxw));
                //canleft=false;
            } 
        }
    }
    if (py[lowestpy] <= 0) {
        genplat();
        pyv = 0;
        canright=true;
        canleft=true;
    }
}

function gamedraw() {
    "use strict";
    clearInterval(menu);
    ctx.clearRect(0, 0, c.width, c.height);
    ctx.drawImage(boximg, boxx, boxy);
    for (i = 0; i < px.length; i++) {
        py[i] = py[i] + pyv;
        if ((right === true)&&(canright===true)) {
            pxv=-1;
            px[i]= px[i] + pxv;
            canleft=true;
        }
        if ((left === true)&&(canleft===true)) {
            pxv=1;
            px[i]= px[i] + pxv;
            canright=true;
        }
        if((left===false)&&(right===false)){
            pxv=0;
        }
        ctx.drawImage(Tileset1, pxtileoffset[i], pytileoffset[i], tilebounds, tilebounds, px[i], py[i], tilebounds, tilebounds);
    }
    if (inair === true) {
        pyv = pyv - 0.1;
    }
}

function drawmenu() {
    "use strict";
    document.getElementById("pxi").innerHTML = (c.width / 2+boxw);
    clearInterval(frames);
    ctx.strokeStyle = "#000000";
    if ((mousey > 0) && (mousey < 110) && (mousey > 55)) {
        ctx.fillStyle = "#888888";
    } else {
        ctx.fillStyle = "#FFFFFF";
    }
    ctx.fillRect(20, 50, c.width - 40, 50);
    ctx.strokeRect(20, 50, c.width - 40, 50);
    ctx.fillStyle = "#000000";
    ctx.font = "30px Arial";
    ctx.fillText("Play", (c.width / 2) - 30, 85, c.width - 40);
}

function onmove(e) {
    "use strict";
    if (!e) {
        e = window.event;
    }
    if (e.pageX || e.pageY) {
        mousex = e.pageX;
        mousey = e.pageY;
    } else if (e.clientX || e.clientY) {
        mousex = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
        mousey = e.clientY + document.body.scrollTop + document.documentElement.scrollTop;
    }
    mousex = mousex - ((document.body.clientWidth - c.width) / 2);
    mousey = mousey - 8;
    document.getElementById("csv").innerHTML = mousex + " " + mousey;
}

function onclick(e) {
    "use strict";
    if ((mousey > 0) && (mousey < 110) && (mousey > 55)) {
        clearInterval(menu);
        clearInterval(frames);
        genplat();
        frames = setInterval(gamedraw, 10);
    }
}
document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);
c.addEventListener("mousemove", onmove, true);
c.addEventListener("click", onclick, true);
var menu = setInterval(drawmenu, 10);
var frames;
var collisioncheck;