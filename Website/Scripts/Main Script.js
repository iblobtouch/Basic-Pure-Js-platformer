/*jslint plusplus: true */
var c = document.getElementById("game");
var ctx = c.getContext("2d");
//c contains the properties of the canvas, ctx is the context for drawing.
var px = [];
var py = [];
var pimg = [];
var i = 0;
var n1 = 0;
var n2 = 0;
var n3 = 0;
var tilebounds=40;
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
var middle = new Image();
middle.src = "images/Ground Tileset/underground.jpg";
var topmiddle = new Image();
topmiddle.src = "images/Ground Tileset/aboveground.png";
var belowmiddle = new Image();
belowmiddle.src = "images/Ground Tileset/belowground.png";
var leftmiddle = new Image();
leftmiddle.src = "images/Ground Tileset/leftground.png";
var rightmiddle = new Image();
rightmiddle.src = "images/Ground Tileset/rightground.png";
var errdistance = 0;
function correctpos(){
	for(n=0;n<px.length;n++){
		py[n]=(py[n]+errdistance)-1;
	}
}
function boundscheck() {
    "use strict";
	for (i = 0; i < px.length; i++) {
		if ((boxx >= px[i]) && (boxx <= px[i] + tilebounds) && (boxy + boxh >= py[i]) && (boxy + boxh < py[i] - pyv)) {
			pyv = 0;
			errdistance = ((boxy + boxh) - py[i]);
			inair = false;
			correctpos();
		}
		if((boxx<=px[i])&&(boxx+boxw>=px[i])&&(boxy+boxh>=py[i])&&(boxy+boxh<py[i]-pyv)){
			pyv=0;
			errdistance=((boxy+boxh)-py[i]);
			inair=false;
			correctpos();
		}
		if((boxx>=px[i])&&(boxx<=px[i]+tilebounds)&&(boxy<=py[i]+tilebounds)&&(boxy>=py[i]+pyv)&&(pyv>0)){
			pyv=-0.1;
			inair=true;
		}
		if((boxx<=px[i])&&(boxx+boxw>=px[i])&&(boxy<=py[i]+tilebounds)&&(boxy>=py[i]+pyv)&&(pyv>0)){
			pyv=-0.1;
			inair=true;
		}
	}
	if(py[lowestpy]<=0){
		genplat();
		pyv=0;
	}
}
function draw(){
	ctx.clearRect(0,0,c.width,c.height);
    ctx.drawImage(boximg,boxx,boxy);
		for(n1=0;n1<px.length;n1++){
            ctx.drawImage(pimg[n1],px[n1],py[n1]);
			py[n1]=py[n1]+pyv;
			if(right==true){
				px[n1]--;
			}
			if(left==true){
				px[n1]++;
			}
		}
	if(inair==true){
		pyv=pyv-0.1;
	}
	boundscheck();
}
var frames = setInterval(draw,10);
//frames is the frame rate of the game, in this case each tick is every 10ms.
function keyDownHandler(e) {
    if(e.keyCode == 68) {
        right = true;
    }
    if(e.keyCode == 65) {
        left = true;
    }
	if(e.keyCode == 87) {
        up = true;
		if(inair==false){
			inair=true;
			pyv=5;
		}
    }
}

function keyUpHandler(e) {
    if(e.keyCode == 68) {
        right = false;
    }
    if(e.keyCode == 65) {
        left = false;
    }
	if(e.keyCode == 87) {
        up = false;
    }
}
document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);
function genplat(){
	px[0]=300;
	py[0]=400;
    pimg[0]=middle;
    px[1]=260;
	py[1]=400;
    pimg[1]=leftmiddle;
    px[2]=300;
	py[2]=360;
    pimg[2]=topmiddle;
    px[3]=300;
	py[3]=440;
    pimg[3]=belowmiddle;
    px[4]=340;
	py[4]=400;
    pimg[4]=rightmiddle;
	for(i=0;i<px.length;i++){
		if(py[i]<py[lowestpy]){
			lowestpy=i;
		}
	}
}
genplat();