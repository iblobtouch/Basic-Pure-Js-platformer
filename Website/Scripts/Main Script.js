/*jslint plusplus: true */
var c = document.getElementById("game");
var ctx = c.getContext("2d");
//c contains the properties of the canvas, ctx is the context for drawing.
var mousex = 0;
var mousey = 0;
var px = [];
var py = [];
var pxtileoffset = [];
var pytileoffset = [];
var i = 0;
var n1=0;
var tilebounds = 40;
var boxx = (c.width / 2);
var boxy = (c.height / 2);
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
var boxw = 0;
var boxh = 0;
var level=1;
var boximg = new Image();
boximg.src = "images/player.jpg";

boximg.onload = function() {
    "use strict";
    boxw = boximg.width;
    boxh = boximg.height;
};
var levelloaded=false;
var Tileset1 = new Image();
Tileset1.src = "images/Ground Tileset/Tileset1.png";
var errdistance = 0;

function drawmenu(){
    clearInterval(frames);
    ctx.strokeStyle="#000000";
    if((mousey>0)&&(mousey<110)){
        ctx.fillStyle="#888888";
    }else{
        ctx.fillStyle="#FFFFFF";
    }
    ctx.fillRect(20,50,c.width-40,50);
    ctx.strokeRect(20,50,c.width-40,50);
    ctx.fillStyle="#000000";
    ctx.font="30px Arial";
    ctx.fillText("Play",(c.width/2)-30,85,c.width-40);
    document.getElementById("csv").innerHTML=mousex + " " + mousey;
}

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
            for (i = 0; i < px.length; i++) {
                if ((inair === false)&&(px[i]!=boxx+boxw)) {
                    inair = true;
                    pyv = 5;
                
                }
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

function genlevel1() {
    "use strict";
    
    px[0] = 240;
    py[0] = 280;
    pxtileoffset[0] = 0;
    pytileoffset[0] = 120;
    
    px[1] = 240;
    py[1] = 320;
    pxtileoffset[1] = 80;
    pytileoffset[1] = 120;
    
    px[2] = 240;
    py[2] = 360;
    pxtileoffset[2] = 160;
    pytileoffset[2] = 80;
    
    px[3] = 280;
    py[3] = 280;
    pxtileoffset[3] = 80;
    pytileoffset[3] = 160;
    
    px[4] = 320;
    py[4] = 280;
    pxtileoffset[4] = 40;
    pytileoffset[4] = 120;
    
    px[5] = 320;
    py[5] = 320;
    pxtileoffset[5] = 80;
    pytileoffset[5] = 120;
    
    px[6] = 320;
    py[6] = 360;
    pxtileoffset[6] = 160;
    pytileoffset[6] = 80;
    
    px[7] = 360;
    py[7] = 240;
    pxtileoffset[7] = 80;
    pytileoffset[7] = 120;
    
    px[8] = 200;
    py[8] = 180;
    pxtileoffset[8] = 160;
    pytileoffset[8] = 80;
    for (i = 0; i < px.length; i++) {
        if (py[i] < py[lowestpy]) {
            lowestpy = i;
        }
    }
    levelloaded=true;
}
genlevel1();

function boundscheck() {
    for (i = 0; i < px.length; i++) {
        if ((boxx >= px[i]) && (boxx <= px[i] + tilebounds) && (boxy + boxh > py[i]) && (boxy + boxh < py[i] - pyv)) {
            pyv = 0;
            errdistance = ((boxy + boxh) - py[i]);
            inair = false;
            correctpos();
        }
        if ((boxx <= px[i]) && (boxx + boxw >= px[i]) && (boxy + boxh > py[i]) && (boxy + boxh < py[i] - pyv)) {
            pyv = 0;
            errdistance = ((boxy + boxh) - py[i]);
            inair = false;
            correctpos();
        } 
        if ((boxyv === py[i]+tilebounds)&&(pyv>0)) {
            pyv = -0.1;
        } 
        if ((py[i] === boxy + boxh) && (boxx + boxw === px[i])) {
            inair = true;
        }
        if ((py[i] === boxy + boxh) && (boxx === px[i] + tilebounds)) {
            inair = true;
        } 
        if((boxx+boxw==px[i])&&(boxy+boxh>py[i])&&(boxy<py[i]+tilebounds)){
            for (n1 = 0; n1 < px.length; n1++) {
                px[n1]=px[n1]+1;
            }
        }
        if((boxx==px[i]+tilebounds)&&(boxy+boxh>py[i])&&(boxy<py[i]+tilebounds)){
            for (n1 = 0; n1 < px.length; n1++) {
                px[n1]=px[n1]-1;
            }
        }
    }
    if (py[lowestpy] <= 0) {
        genlevel1();
        pyv = 0;
    }
}

function gamedraw() {
    "use strict";
    ctx.clearRect(0, 0, c.width, c.height);
    ctx.drawImage(boximg, boxx, boxy);
    for (i = 0; i < px.length; i++) {
        ctx.drawImage(Tileset1, pxtileoffset[i], pytileoffset[i], tilebounds, tilebounds, px[i], py[i], tilebounds, tilebounds);
        py[i] = py[i] + pyv;
    }
    if (inair === true) {
        pyv = pyv - 0.1;
    }
    if (right === true) {
        for (n1 = 0; n1 < px.length; n1++) {
            px[n1]=px[n1]-1;
        }
    }
    if (left === true) {
        for (n1 = 0; n1 < px.length; n1++) {
                px[n1]=px[n1]+1;
        }   
    }
    boundscheck();
}

function onmove(e){
    "use strict";
    if (!e){ 
        var e = window.event;
    }
    if (e.pageX || e.pageY){
        mousex = e.pageX;
        mousey = e.pageY;
    }else if (e.clientX || e.clientY){
        mousex = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
        mousey = e.clientY + document.body.scrollTop + document.documentElement.scrollTop;
    }
    mousex = mousex-((document.body.clientWidth-c.width)/2);
    mousey = mousey-16;
}

function onclick(e){
    if((mousey>0)&&(mousey<110)){
        clearInterval(menu);
        clearInterval(frames);
        frames=setInterval(gamedraw,10);
    }
}

document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);
c.addEventListener("mousemove", onmove,true);
c.addEventListener("click", onclick,true);
var menu=setInterval(drawmenu,10);
var frames=setInterval(gamedraw,10);