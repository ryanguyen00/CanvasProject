var canvas = document.createElement("canvas");
var ctx = canvas.getContext("2d");
canvas.width = 800;
canvas.height = 800;
document.body.appendChild(canvas);


var bgReady = false;
var bgImage = new Image();
bgImage.onload = function () {
	bgReady = true;
};
bgImage.src = "images/sand.png";

//hero image
var heroReady = false;
var heroImage = new Image();
heroImage.onload = function () {
    heroReady = true;
};
heroImage.src = "images/3.png";

// Monster image
var monsterReady = false;
var monsterImage = new Image();
monsterImage.onload = function () {
    monsterReady = true;
};
monsterImage.src = "images/rock.png";



let soundPickUp = document.getElementById('soundPickUp');
let soundWin = document.getElementById('soundWin');


let rows = 4;
var cols = 3;
//second row for the right movement (counting the index from 0)
let trackDown = 0;
let trackLeft = 1;
let trackRight = 2;
let trackUp = 3; 
//third row for the left movement (counting the index from 0)

  // not using up and down in this version, see next 
//version

let spriteWidth = 216; // also  spriteWidth/cols;
let spriteHeight = 415;  // also spriteHeight/rows;
let width = spriteWidth / cols;
let height = spriteHeight / rows;
let curXFrame = 0; // start on left side
let frameCount = 3;  // 3 frames per row
//x and y coordinates of the overall sprite image to get the single frame  
// we want
let srcX = 0;  // our image has no borders or other stuff
let srcY = 0;

let left = false;
let right = false;
let up = false;
let down = true;

let counter = 0;




//setting up images

//background image


//Game Objects

var hero = {
	speed: 256, // movement in pixels per second
	x: 0,
	y: 0
};
var monster = {
	x: 0,
	y: 0
};

var monstersCaught = 0;

// Player Input

var keysDown = {};

addEventListener("keydown", function (e) {
	keysDown[e.keyCode] = true;
}, false);

addEventListener("keyup", function (e) {
	delete keysDown[e.keyCode];
}, false);

//Reset Game

var reset = function () {
	hero.x = canvas.width / 2;
	hero.y = canvas.height / 2;

	// Throw the monster somewhere on the screen randomly
	monster.x = 32 + (Math.random() * (canvas.width - 120));
	monster.y = 32 + (Math.random() * (canvas.height - 92));

	if(monstersCaught > 5) {
		alert("game over");
		
	}
};


// Update game objects
// Border detection
var update = function (modifier) {

	//ctx.clearRect(hero.x,hero.y,width,height)
	left = false;
	right = false;
	down = false;
	up = false;

	if (38 in keysDown) { // Player holding up
		hero.y -= hero.speed * modifier;
			
		if(hero.y < 25) {
				hero.y = 25;
		}

		left = false;
		right = false;
		down = false;
		up = true;
	}
	if (40 in keysDown) { // Player holding down
		hero.y += hero.speed * modifier;
			
		if(hero.y > (800-120)){
				hero.y = 800-120;
			}

		left = false;
		right = false;
		down = true;
		up = false;
	}
	if (37 in keysDown) { // Player holding left
		hero.x -= hero.speed * modifier;

		if(hero.x < 22){
			hero.x = 22;
		}
		left = true;
		right = false;
		down = false;
		up = false;
	}
	if (39 in keysDown) { // Player holding right
		hero.x += hero.speed * modifier;

		if(hero.x > (710)) {
			hero.x = 710;
		}
		left = false;
		right = true;
		down = false;
		up = false;
	}

	// Are they touching?
	if (
		hero.x <= (monster.x + 60)
		&& monster.x <= (hero.x + 77)
		&& hero.y <= (monster.y + 32)
		&& monster.y <= (hero.y + 85)
	) {
		soundPickUp.play();
		++monstersCaught;
		reset();
	}
	if (counter == 70) {  // adjust this to change "walking speed" of 

		curXFrame = ++curXFrame % frameCount; //Updating the sprite 
	
		// it will count 0,1,2,0,1,2,0, etc
		counter = 0;
		} else {
		counter++;
	}
	
	srcX = curXFrame * width;   //Calculating the x coordinate for 
	
	//if left is true,  pick Y dim of the correct row
	if (left) {
	//calculate srcY
	srcY = trackLeft * height;
	}
	//if the right is true,   pick Y dim of the correct row
	if (right) {
	//calculating y coordinate for spritesheet
	srcY = trackRight * height;
	}
	
	if (up)  {
		srcY = trackUp * height;
	}
	
	if (down)  {
		srcY = trackDown * height;
	}
	
	
	if (left == false && right == false && up == false && down == false) {
	srcX = 1 * width;
	srcY = 2 * height;
	}
};

//curXFrame = ++curXFrame % frameCount; //Updating the sprite frame index
// it will count 0,1,2,0,1,2,0, etc



// Draw everything
var render = function () {
	if (bgReady) {
		ctx.drawImage(bgImage, 0, 0);
	}

	if (heroReady) {
		//ctx.drawImage(heroImage, hero.x, hero.y);
		ctx.drawImage(heroImage, srcX, srcY, width, height, hero.x, hero.y, width, height);
		}

	if (monsterReady) {
		ctx.drawImage(monsterImage, monster.x, monster.y);
	}

	//Score
	if (monstersCaught < 5) {
		ctx.fillStyle = "rgb(250, 250, 250)";
		ctx.font = "24px Helvetica";
		ctx.textAlign = "left";
		ctx.textBaseline = "top";
		ctx.fillText("Rocks collected: " + monstersCaught, 32, 32); 
	}
	
	else {
		ctx.shadowColor = "rgb(190, 190, 190)";
		ctx.shadowOffsetX = 10;
		ctx.shadowOffsetY = 10
		ctx.shadowBlur = 10;
		ctx.font = "50px arial";
		var gradient = ctx.createLinearGradient(0, 0, 150, 100);
		gradient.addColorStop(0, "rgb(255, 0, 128)");
		gradient.addColorStop(1, "rgb(255, 153, 51)");
		ctx.fillStyle = gradient;
		ctx.fillText("Game Over! You win", 250, 300);
		soundWin.play();
	}



};

//own running function independent of main() function.

var countdownTime = 5;
var Timer = setInterval(function(){
  if(countdownTime < 0 && monstersCaught < 5){
	clearInterval(Timer);
	document.getElementById("countdown").innerHTML = "You lose!";

  } 
  else if (countdownTime >= 0 && monstersCaught >= 5) {
	clearInterval(Timer);
	document.getElementById("countdown").innerHTML = "You win!";

  }
  else {
   document.getElementById("countdown").innerHTML = countdownTime + " seconds remaining";
  }
  countdownTime -= 1;
  
}, 1000);






	
var main = function () {
	var now = Date.now();
	var delta = now - then;

	update(delta / 1000);
	render();

	then = now;

	

	if (monstersCaught < 5 && countdownTime >= 0) {
		requestAnimationFrame(main);
	}
	
	// Request to do this again ASAP

};




var then = Date.now();
reset();
main();


