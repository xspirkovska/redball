// RequestAnimFrame: a browser API for getting smooth     animations
window.requestAnimFrame = (function(){
return  window.requestAnimationFrame       || 
window.webkitRequestAnimationFrame || 
window.mozRequestAnimationFrame    || 
window.oRequestAnimationFrame      || 
window.msRequestAnimationFrame     ||  
function( callback ){
return window.setTimeout(callback, 1000 / 60);
};
})();
window.cancelRequestAnimFrame = ( function() {
return window.cancelAnimationFrame          ||
window.webkitCancelRequestAnimationFrame    ||
window.mozCancelRequestAnimationFrame       ||
window.oCancelRequestAnimationFrame     ||
window.msCancelRequestAnimationFrame        ||
clearTimeout
} )();

// Initialize canvas and required variables
var canvas = document.getElementById("canvas"),
// Create canvas context
ctx = canvas.getContext("2d"),
// Window's width
W = window.innerWidth, 
// Window's height
H = window.innerHeight,
// Ball object
ball = {}, 
// Array containing two paddles
paddles = [2], 
// Mouse object to store it's current position
mouse = {}, 
// Varialbe to store points
points = 0, 
// Max FPS (frames per second)
fps = 60, 
// Start button object
startBtn = {}, 
// Restart button object
restartBtn = {}, 
// flag varialbe, cahnged when the game is over
over = 0, 
// variable to initialize animation
init, 
paddleHit;

// Add mousemove and mousedown events to the canvas
canvas.addEventListener("mousemove", trackPosition, true);
canvas.addEventListener("mousedown", btnClick, true);

// Set the canvas's height and width to full screen
canvas.width = W;
canvas.height = H;

// Function to paint canvas
function paintCanvas() {
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, W, H);
}

// Function for creating paddles
function Paddle(pos) {
    // Height and width
    this.h = 25;
    this.w = 200;
    // Paddle's position
    this.x = W/2 - this.w/2;
    this.y = (pos == "top") ? 0 : H - this.h;
}

// Push two new paddles into the paddles[] array
paddles.push(new Paddle("bottom"));
paddles.push(new Paddle("top"));

// Ball object
ball = {
    x: 75,
    y: 75, 
    r: 20,
    c: "red",
    vx: 4,
    vy: 8,

    // Function for drawing ball on canvas
    draw: function() {
        ctx.beginPath();
        ctx.fillStyle = this.c;
        ctx.arc(this.x, this.y, this.r, 0, Math.PI*2, false);
        ctx.fill();
    }
};

// Start Button object
startBtn = {
    w: 100,
    h: 50,
    x: W/2 - 50,
    y: H/2 - 25,
    
    draw: function() {
        ctx.strokeStyle = "black";
        ctx.lineWidth = "2";
        ctx.strokeRect(this.x, this.y, this.w, this.h);
        ctx.font = "22px 'Gloria Hallelujah'";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillStlye = "black";
        ctx.fillText("START", W/2, H/2 );
    }
};

// Restart Button object
restartBtn = {
    w: 100,
    h: 50,
    x: W/2 - 50,
    y: H/2 - 50,
    
    draw: function() {
        ctx.strokeStyle = "black";
        ctx.lineWidth = "2";
        ctx.strokeRect(this.x, this.y, this.w, this.h);
        ctx.font = "20px 'Gloria Hallelujah'";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillStlye = "black";
        ctx.fillText("RESTART", W/2, H/2 - 25 );
    }
};

// Draw everything on canvas
function draw() {
    paintCanvas();
    
    for(var i = 0; i < paddles.length; i++) {
        p = paddles[i];
        ctx.fillStyle = "black";
        ctx.fillRect(p.x, p.y, p.w, p.h);
    }
    
    ball.draw();
    update();
}

// Track the position of mouse cursor
function trackPosition(e) {
    mouse.x = e.pageX;
    mouse.y = e.pageY;
}

// Main Game Logic; Function to update positions and score
function update() {
    
    // Update scores
    updateScore(); 
    
    // Move the paddles on mouse move
    if(mouse.x && mouse.y) {
        for(var i = 1; i < paddles.length; i++) {
            p = paddles[i];
            p.x = mouse.x - p.w/2;
        }    
    }

// Move the ball
    ball.x += ball.vx;
    ball.y += ball.vy;

// Collision with paddles
    p1 = paddles[1];
    p2 = paddles[2];

// If the ball strikes with paddles,
// invert the y-velocity vector of ball,
// increment the points
// and change the multiplier
    if(collides(ball, p1)) {
        collideAction(ball, p1);
    }

    else if(collides(ball, p2)) {
        collideAction(ball, p2);
    } 

// If the ball hits the top/bottom walls, run gameOver() function
    else {
        if(ball.y + ball.r > H) {
            ball.y = H - ball.r;
            gameOver();
        } 

        else if(ball.y < 0) {
            ball.y = ball.r;
            gameOver();
        }

// If ball strikes the vertical walls, invert the x-velocity vector of ball
        if(ball.x + ball.r > W) {
            ball.vx = -ball.vx;
            ball.x = W - ball.r;
        }    

        else if(ball.x -ball.r < 0) {
            ball.vx = -ball.vx;
            ball.x = ball.r;
        }
    }
}



//Function to check collision between ball and one of the paddles
function collides(b, p) {
    if(b.x + ball.r >= p.x && b.x - ball.r <=p.x + p.w) {
        
        if(b.y >= (p.y - p.h) && p.y > 0){
            paddleHit = 1;
            return true;
        }

        else if(b.y <= p.h && p.y == 0) {
            paddleHit = 2;
            return true;
        }

        else return false;
    }
}

//Do this when collides == true
function collideAction(ball, p) {
    ball.vy = -ball.vy;

    if(paddleHit == 1) {
        ball.y = p.y - p.h;
    }

    else if(paddleHit == 2) {
        ball.y = p.h + ball.r;
    }

    points++;

    if(collision) {
        if(points > 0) 
        collision.pause();
        collision.currentTime = 0;
        collision.play();
    }
}

// Function for updating score
function updateScore() {
    ctx.fillStlye = "black";
    ctx.font = "16px 'Gloria Hallelujah'";
    ctx.textAlign = "left";
    ctx.textBaseline = "top";
    ctx.fillText("SCORE: " + points, 20, 20 );
}

// Function to run when the game overs
function gameOver() {
    ctx.fillStlye = "black";
    ctx.font = "20px 'Gloria Hallelujah'";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("Game Over - You scored "+points+" points!", W/2, H/2 + 25 );

// Stop the Animation
    cancelRequestAnimFrame(init);

// Set the over flag
    over = 1;

// Show the restart button
    restartBtn.draw();
}

// Function for running the whole animation
function animloop() {
    init = requestAnimFrame(animloop);
    draw();
}

// Function to execute at startup
function startScreen() {
    draw();
    startBtn.draw();
}

// On button click (Restart and start)
    function btnClick(e) {
    
    // Variables for storing mouse position on click
        var 
        mx = e.pageX,
        my = e.pageY;
    
    // Click start button
        if(mx >= startBtn.x && mx <= startBtn.x + startBtn.w) {
            animloop();
        // Delete the start button after clicking it
            startBtn = {};
        }
    
    // If the game is over, and the restart button is clicked
        if(over == 1) {
            if(mx >= restartBtn.x && mx <= restartBtn.x + restartBtn.w) {
                    ball.x = 20;
                    ball.y = 20;
                    points = 0;
                    ball.vx = 4;
                    ball.vy = 8;
                    animloop();
                    over = 0;
                }
        }
    }

// Show the start screen
    startScreen();
