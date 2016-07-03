//JavaScript Breakout Game

// To start adding things to the canvas, the first thing to do is make a reference to the ID that was define in the <canvas> tag 
	var canvas = document.getElementById("myCanvas");
	
// ctx is the variable responsible for storing the 2D rendering context
	var ctx = canvas.getContext("2d");

// ballRadius is a variable created for make calculations to add the collision detection of the game 
	var ballRadius = 10;

// x and y will define the position of the ball starting the game 
	var x = canvas.width/2;
	var y = canvas.height-30;

// asigning values to dx and dy will give the ball the ilusion of movement 
	var dx = 2;
	var dy = -2;

// The 3 variables below define the paddle used to hit the ball 
	var paddleHeight = 10;
	var paddleWidth = 75;
	var paddleX = (canvas.width-paddleWidth)/2;

// These 2 variable will storage the information on whether the left or right control button is pressed, the value false is the default, means that the buttons are not pressed 
	var rightPressed = false;
	var leftPressed = false;

// This variables will define the shape of the bricks 
	var brickRowCount = 5;
	var brickColumnCount = 3;
	var brickWidth = 75;
	var brickHeight = 20;
	var brickPadding = 10;
	var brickOffsetTop = 30;
	var brickOffsetLeft = 30;

// Variables to define the score that will be starting in 0, and the life that the user is going to have, in this case: 3 
	var score = 0;
	var lives = 3;

// To create a new brick when the game is over a loop has been created 
	var bricks = [];
		for(c=0; c<brickColumnCount; c++) {
			bricks[c] = [];
		for(r=0; r<brickRowCount; r++) {

// By adding 'status' parameter to declare that the object can be remove or draw in the canvas 
		bricks[c][r] = { x: 0, y: 0, status: 1 };
		}
	}

// Adding some addEventListener. The keyDownHandler will be executed when the button is pressed (true) (information sent by keydown). The keyup will be executed when the button is released (true) (information sent by keyup) 
	document.addEventListener("keydown", keyDownHandler, false);
	document.addEventListener("keyup", keyUpHandler, false);

// The event 'mousemove' will state that the mouse will be acepted in the game 
	document.addEventListener("mousemove", mouseMoveHandler, false);

// The number 39 is the right cursor and the 37 is the right cursor, when the variable is equal to one of the numbers it'll change to true, and the function will be executed 
	function keyDownHandler(e) {
		if(e.keyCode == 39) {
			rightPressed = true;
		}
		else if(e.keyCode == 37) {
			leftPressed = true;
		}
	}
	function keyUpHandler(e) {
		if(e.keyCode == 39) {
			rightPressed = false;
		}
		else if(e.keyCode == 37) {
			leftPressed = false;
		}
	}

// This function will allow the mouse move the paddle only left and right 
	function mouseMoveHandler(e) {
		var relativeX = e.clientX - canvas.offsetLeft;
		if(relativeX > 0 && relativeX < canvas.width) {
			paddleX = relativeX - paddleWidth/2;
		}
	}

// The collision is when the ball hits one of the bricks, for this to happen is necessary to add a calculation.
// The calculation: the 'x' position of the ball is < than the 'x' position of the brick. The 'x' position of the ball is > than the 'x' position of the brick + its width. The 'y' position of the ball is greater than the 'y' position of the brick. The 'y' position of the ball is less than the 'y' position of the brick plus its height 
	function collisionDetection() {
		for(c=0; c<brickColumnCount; c++) {
			for(r=0; r<brickRowCount; r++) {
				var b = bricks[c][r];
				if(b.status == 1) {
					if(x > b.x && x < b.x+brickWidth && y > b.y && y < b.y+brickHeight) {
						dy = -dy;
						b.status = 0;
// Adding the score inside this function will increase 1 to the score every time a brick is hit  
						score++;
// With this condition if every brick is hit a message will appear. Through a simple calculation, 'score' can know if there is some brick left, if is not, then it'll show a message, there the user will have the option to reload the game 
						if(score == brickRowCount*brickColumnCount) {
							alert("YOU WON!");
							document.location.reload();
						}
					}
				}
			}
		}
	}

// The drawBall function define the shape of the ball 
	function drawBall() {
		ctx.beginPath();
		ctx.arc(x, y, ballRadius, 0, Math.PI*2);
		ctx.fillStyle = "blue";
		ctx.fill();
		ctx.closePath();
	}

// The drawPaddle function define the shape of the paddle 
	function drawPaddle() {
		ctx.beginPath();
		ctx.rect(paddleX, canvas.height-paddleHeight, paddleWidth, paddleHeight);
		ctx.fillStyle = "purple";
		ctx.fill();
		ctx.closePath();
	}

// Adding 1 to the status parameter wil make the brick show in the canvas, otherwhise if the brick was hit by the ball it will change its value to 0 and will be hidden 
	function drawBricks() {
		for(c=0; c<brickColumnCount; c++) {
			for(r=0; r<brickRowCount; r++) {
				if(bricks[c][r].status == 1) {
					var brickX = (r*(brickWidth+brickPadding))+brickOffsetLeft;
					var brickY = (c*(brickHeight+brickPadding))+brickOffsetTop;
					bricks[c][r].x = brickX;
					bricks[c][r].y = brickY;
					ctx.beginPath();
					ctx.rect(brickX, brickY, brickWidth, brickHeight);
					ctx.fillStyle = "green";
					ctx.fill();
					ctx.closePath();
				}
			}
		}
	}

// This will set the score and will place it at the top left of the canvas 
	function drawScore() {
		ctx.font = "18px Arial";
		ctx.fillStyle = "black";
		ctx.fillText("Score: "+score, 8, 20);
	}

// This will set the lives and will place it at the top right of the canvas 
	function drawLives() {
		ctx.font = "18px Arial";
		ctx.fillStyle = "black";
		ctx.fillText("Lives: "+lives, canvas.width-65, 20);
	}

// Calling all the functions inside the main dra function will activate them in every new frame when playing 
	function draw() {
// clearRect() will clear any content previosly draw 
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		drawBricks();
		drawBall();
		drawPaddle();
		drawScore();
		drawLives();
		collisionDetection();

// The code below will make the ball bounce in the walls (Left, Top and Right) and it'll send the ball in the oposite direction 
    if(x + dx > canvas.width-ballRadius || x + dx < ballRadius) {
        dx = -dx;
    }
    if(y + dy < ballRadius) {
        dy = -dy;
    }

	// This condition is to state the collision between the paddele and the ball. Otherwise if the ball touch the bottom of the canvas a message saying 'Game Over' will display  
    else if(y + dy > canvas.height-ballRadius) {
        if(x > paddleX && x < paddleX + paddleWidth) {
            dy = -dy;
        }
        else {
// When the user lose a life it'll decrease 1 in the 'lives', when there's no more life it'll display the message 'Game Over' 
            lives--;
            if(!lives) {
                alert("GAME OVER");
                document.location.reload();
            }
            else {
                x = canvas.width/2;
                y = canvas.height-30;
                dx = 3;
                dy = -3;
                paddleX = (canvas.width-paddleWidth)/2;
            }
        }
    }

// This simple codeis going to give movement to the paddles. When the right paddle is pressed is going to move 7 pixels to the right, and the same with the left. Adding 'paddleX < canvas.width-paddleWidth' the paddle it'll stay inside the canvas 
    if(rightPressed && paddleX < canvas.width-paddleWidth) {
        paddleX += 7;
    }
    else if(leftPressed && paddleX > 0) {
        paddleX -= 7;
    }
	
// Adding x += dx and y += dy will give a new position to the ball on every update 
    x += dx;
    y += dy;
    
// requestAnimationFrame(draw) is a function that will run over and over the frame 
	requestAnimationFrame(draw);
	}

	draw();

