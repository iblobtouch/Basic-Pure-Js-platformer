/*jslint plusplus: true */
var c = document.getElementById("game");
var ctx = c.getContext("2d");
//c contains the properties of the canvas, ctx is the context for drawing.
var px = [];
var py = [];
var pw = [];
var ph = [];
var i = 0;
var n1 = 0;
var n2 = 0;
var n3 = 0;
//boxw and boxh are the width and height of the box.
var boxx = (c.width / 2);
var boxy = (c.height / 2);
//boxx and boxy are the cords of the player boxes top left corner.
var boxw = 50;
var boxh = 50;
var tw = 0;
var th = 0;
var right = false;
var left = false;
var up = false;
//Is the player pressing the d,a or w key?
var inair = true;
//Is the player currently in the air, and should they be going up?
var pyv = 0;
//pyv is the players vertical velocity.
var lowestpy = 2;
//The platform with the highest y value.
var boximg = new Image();
boximg.src = "images/player.jpg";
boximg.onload = function () {
    "use strict";
	boxw = boximg.width;
	boxh = boximg.height;
};
var underground = new Image();
underground.src = "images/Ground Tileset/underground.jpg";
var aboveground = new Image();
aboveground.src = "images/Ground Tileset/aboveground.png";
var belowground = new Image();
belowground.src = "images/Ground Tileset/belowground.png";
var leftground = new Image();
leftground.src = "images/Ground Tileset/leftground.png";
var rightground = new Image();
rightground.src = "images/Ground Tileset/rightground.png";
underground.onload = function () {
    "use strict";
	tw = underground.width;
	th = underground.height;
};
var errdistance = 0;
function correctpos(){
	for(n=0;n<px.length;n++){
		py[n]=(py[n]+errdistance)-1;
	}
}
function boundscheck() {
    "use strict";
	for (i = 0; i < px.length; i++) {
		if ((boxx >= px[i]) && (boxx <= px[i] + pw[i]) && (boxy + boxh >= py[i]) && (boxy + boxh < py[i] - pyv)) {
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
		if((boxx>=px[i])&&(boxx<=px[i]+pw[i])&&(boxy<=py[i]+ph[i])&&(boxy>=py[i]+pyv)&&(pyv>0)){
			pyv=-0.1;
			inair=true;
		}
		if((boxx<=px[i])&&(boxx+boxw>=px[i])&&(boxy<=py[i]+ph[i])&&(boxy>=py[i]+pyv)&&(pyv>0)){
			pyv=-0.1;
			inair=true;
		}
		if((boxx==px[i]+pw[i])&&(boxy+boxh>=py[i])&&(boxy+boxh<=py[i]+2)||(boxx+boxw==px[i])&&(boxy+boxh>=py[i])&&(boxy+boxh<=py[i]+2)){
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
			for(n2=0;pw[n1]-(tw*n2)>0;n2++){
				ctx.drawImage(aboveground,(px[n1]+(tw*n2)),py[n1],tw,th);
				for(n3=1;ph[n1]-(th*n3)>0;n3++){
                    if(ph[n1]-(th*n3)==th){
                       ctx.drawImage(belowground,(px[n1]+(tw*n2)),(py[n1]+(th*n3)),tw,th);
                    }else if(n2==0){
                        ctx.drawImage(leftground,(px[n1]+(tw*n2)),(py[n1]+(th*n3)),tw,th);
                    }else if(pw[n1]-(tw*n2)==tw){
                        ctx.drawImage(rightground,(px[n1]+(tw*n2)),(py[n1]+(th*n3)),tw,th);
                    }else{
					   ctx.drawImage(underground,(px[n1]+(tw*n2)),(py[n1]+(th*n3)),tw,th);
                    }
				}
			}
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
	pw[0]=50;
	ph[0]=10;
	px[1]=-100;
	py[1]=500;
	pw[1]=500;
	ph[1]=50;
	px[2]=100;
	py[2]=400;
	pw[2]=50;
	ph[2]=50;
	for(i=0;i<px.length;i++){
		if(py[i]>py[lowestpy]){
			lowestpy=i;
		}
	}
}
genplat();