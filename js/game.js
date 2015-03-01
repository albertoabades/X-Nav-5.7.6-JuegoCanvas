// Original game from:
// http://www.lostdecadegames.com/how-to-make-a-simple-html5-canvas-game/
// Slight modifications by Gregorio Robles <grex@gsyc.urjc.es>
// to meet the criteria of a canvas class for DAT @ Univ. Rey Juan Carlos

// Create the canvas
var canvas = document.createElement("canvas");
var ctx = canvas.getContext("2d");
canvas.width = 512;
canvas.height = 480;
document.body.appendChild(canvas);

// Background image
var bgReady = false;
var bgImage = new Image();
bgImage.onload = function () {
	bgReady = true;
};
bgImage.src = "images/background.png";

// Hero image
var heroReady = false;
var heroImage = new Image();
heroImage.onload = function () {
	heroReady = true;
};
heroImage.src = "images/hero.png";

// princess image
var princessReady = false;
var princessImage = new Image();
princessImage.onload = function () {
	princessReady = true;
};
princessImage.src = "images/princess.png";

// stone image
var stoneReady = false;
var stoneImage = new Image();
stoneImage.onload = function(){
	stoneReady = true;
};
stoneImage.src = "images/stone.png";

//monster image
var monsterReady = false;
var monsterImage = new Image();
monsterImage.onload = function(){
	monsterReady = true;
};
monsterImage.src = "images/monster.png"

// Game objects
var hero = {
	speed: 256 // movement in pixels per second
};
var monster = {
	speed: 30
};
var lives = 3;
var princess = {};
var princessesCaught = 0;
//var stone = {};
var stoneCollection = [];
var maxStones = 5;

// Handle keyboard controls
var keysDown = {};

addEventListener("keydown", function (e) {
	keysDown[e.keyCode] = true;
}, false);

addEventListener("keyup", function (e) {
	delete keysDown[e.keyCode];
}, false);

// Reset the game when the player catches a princess
var reset = function () {
	hero.x = canvas.width / 2;
	hero.y = canvas.height / 2;

	// Throw the princess somewhere on the screen randomly
	princess.x = 32 + (Math.random() * (canvas.width - 64));
	if(princess.x<32){
		princess.x=32;
	}else if(princess.x>canvas.width-64){
		princess.x=canvas.width-64;
	}
	princess.y = 32 + (Math.random() * (canvas.height - 64));
	if(princess.y < 32){
		princess.y = 32;
	}else if(princess.y>canvas.height-64){
		princess.y = canvas.height - 64;
	}

	// Throw the monster somewhere on the screen randomly
	monster.x = 32 + (Math.random() * (canvas.width - 64));
	while(((monster.x < ((canvas.width/2) + 34)) && (monster.x > ((canvas.width/2) - 34))) || 
		((monster.x < (princess.x + 34)) && (monster.x > (princess.x - 34)))){
			monster.x = 30 + (Math.random() * (canvas.width - 62));
	}
	if(monster.x<32){
		monster.x = 32;
	}else if(monster.x > canvas.width - 64){
		monster.x = canvas.width - 64;
	}
	monster.y = 32 + (Math.random() * (canvas.height - 64));
	while(((monster.y < ((canvas.height/2) + 34)) && (monster.y > ((canvas.height/2) - 34))) || 
		((monster.y < (princess.y + 34)) && (monster.y > (princess.y - 34)))){
			monster.y= 30 + (Math.random() * (canvas.width - 62));
	}
	if(monster.y<32){
		monster.y = 32;
	}else if(monster.y > canvas.height - 62){
		monster.y = canvas.height - 62;
	}

	// Throw the stones somewhere on the screen randomly
	var i = 0;
	while(i < maxStones){
		var stone = {};
		stone.x = 30 + (Math.random() * (canvas.width - 62));
		while(((stone.x < ((canvas.width/2) + 34)) && (stone.x > ((canvas.width/2) - 34))) || 
			((stone.x < (princess.x + 34)) && (stone.x > (princess.x - 34))) ||
			((stone.x < (monster.x + 34)) && (stone.x > (monster.x - 34)))
			){
			stone.x = 30 + (Math.random() * (canvas.width - 62));
		}
		if(stone.x<32){
			stone.x=32;
		}else if(stone.x>canvas.width-62){
			stone.x = canvas.width-62;
		}
		stone.y = 30 + (Math.random() * (canvas.height - 62));
		while(((stone.y < ((canvas.height/2) + 34)) && (stone.y > ((canvas.height/2) -34))) || 
			((stone.y < (princess.y + 34)) && (stone.y > (princess.y - 34))) ||
			((stone.y < (monster.y + 34)) && (stone.y > (monster.y - 34)))
			){
			stone.y = 30 + (Math.random() * (canvas.height - 62));
		}
		if(stone.y<32){
			stone.y=32;
		}else if(stone.y>canvas.height-62){
			stone.y=canvas.height-62;
		}
		if(i == 0){
			stoneCollection[i]=stone;
			i++;
		}else{
			var j = 0;
			var be = false;
			while((j<i) && (be == false)){
				if(((stoneCollection[j].x < (stone.x + 32)) && ((stoneCollection[j].x + 32) > stone.x)) || 
					((stoneCollection[j].y < (stone.y + 32)) && ((stoneCollection[j].y + 32) > stone.y))){
					be = true;
				}
				j++;
			}
			if(be == false){
				stoneCollection[i]= stone;
				i++;
			}
		}
		
	}
};

var colideHero = function(){
	for(var i=0;i<maxStones;i++){
		if((stoneCollection[i].x<=(hero.x+30)) &&
			(hero.x<=(stoneCollection[i].x+30)) &&
			(stoneCollection[i].y <= (hero.y+30)) &&
			(hero.y<=(stoneCollection[i].y+30))
			){
				return true;
		}
	}
	return false;
}

var colideMonster = function(){
	for(var i=0;i<maxStones;i++){
		if((stoneCollection[i].x<=(monster.x+30)) &&
			(monster.x<=(stoneCollection[i].x+30)) &&
			(stoneCollection[i].y <= (monster.y+30)) &&
			(monster.y<=(stoneCollection[i].y+30))
			){
				return true;
		}
	}
	return false;
}

var monsterMove = function(modifier){
	ejeX = monster.x - hero.x;
	ejeY = monster.y - hero.y;
	if(ejeY<0){
		monster.y += monster.speed * modifier;
		if(colideMonster()){
			monster.y -= monster.speed * modifier;
		}
	}
	if(ejeY>0){
		monster.y -= monster.speed * modifier;
		if(colideMonster()){
			monster.y += monster.speed * modifier;
		}
	}
	if(ejeX<0){
		monster.x += monster.speed * modifier;
		if(colideMonster()){
			monster.x -= monster.speed * modifier;
		}
	}
	if(ejeX>0){
		monster.x -= monster.speed * modifier;
		if(colideMonster()){
			monster.x += monster.speed * modifier;
		}
	}
}

// Update game objects
var update = function (modifier) {
	monsterMove(modifier);
	if (38 in keysDown) { // Player holding up
		hero.y -= hero.speed * modifier;
		if(colideHero() == true){
			hero.y += hero.speed * modifier;
		}
		if(hero.y<32){
			hero.y=32;
		}
	}
	if (40 in keysDown) { // Player holding down
		hero.y += hero.speed * modifier;
		if(colideHero() == true){
			hero.y -= hero.speed * modifier;
		}
		if(hero.y>canvas.height-64){
			hero.y=canvas.height - 64;	
		}
	}
	if (37 in keysDown) { // Player holding left
		hero.x -= hero.speed * modifier;
		if(colideHero() == true){
			hero.x += hero.speed * modifier;
		}
		if(hero.x < 32){
			hero.x = 32;
		}
	}
	if (39 in keysDown) { // Player holding right
		hero.x += hero.speed * modifier;
		if(colideHero() == true){
			hero.y -= hero.speed * modifier;
		}
		if(hero.x>canvas.width-64){
			hero.x = canvas.width-64;
		}
	}

	// Are they touching?
	if (
		hero.x <= (princess.x + 16)
		&& princess.x <= (hero.x + 16)
		&& hero.y <= (princess.y + 16)
		&& princess.y <= (hero.y + 32)
	) {
		++princessesCaught;
		reset();
	}

	// Are hero dead?
	if(
		hero.x <= (monster.x + 16)
		&& monster.x <= (hero.x + 16) 
		&& hero.y <= (monster.y + 16) 
		&& monster.y <= (hero.y + 32)
		){
			--lives;
			reset();
	}
};

// Draw everything
var render = function () {
	if (bgReady) {
		ctx.drawImage(bgImage, 0, 0);
	}

	if (heroReady) {
		ctx.drawImage(heroImage, hero.x, hero.y);
	}

	if (princessReady) {
		ctx.drawImage(princessImage, princess.x, princess.y);
	}

	if(monsterReady){
		ctx.drawImage(monsterImage, monster.x, monster.y);
	}

	if (stoneReady){
		for(var i=0; i<maxStones ; i++){
			var stx = stoneCollection[i].x;
			var sty = stoneCollection[i].y;
			ctx.drawImage(stoneImage, stx, sty);
		}
	}

	// Score
	ctx.fillStyle = "rgb(250, 250, 250)";
	ctx.font = "24px Helvetica";
	ctx.textAlign = "left";
	ctx.textBaseline = "top";
	ctx.fillText("Princesses caught: " + princessesCaught, 0, 0);
	ctx.fillText("Lives: " + lives, 0, 448);
};

// The main game loop
var main = function () {
	var now = Date.now();
	var delta = now - then;

	update(delta / 1000);
	render();

	then = now;
};

// Let's play this game!
reset();
var then = Date.now();
//The setInterval() method will wait a specified number of milliseconds, and then execute a specified function, and it will continue to execute the function, once at every given time-interval.
//Syntax: setInterval("javascript function",milliseconds);
setInterval(main, 1); // Execute as fast as possible
