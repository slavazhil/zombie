let zombies = [];
let score = 0;
let image = new Image();
let sound = new Audio("src/shot.mp3");
sound.volume = 0.1;
image.src = "images/sprite.png";
let time = {"then": 0, "now": 0, "passed": 0, "step": 25};
let sprite = {"width": 500, "height": 213, "radius": 50, "step": time.step * 4};

let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");
canvas.width  = window.innerWidth;
canvas.height = window.innerHeight;

window.addEventListener("resize", function() {
	canvas.width  = window.innerWidth;
	canvas.height = window.innerHeight;
}, false);

class Zombie {
    constructor(x, y) {
        this.cx = x;
        this.cy = y;
        this.sx = 0;
        this.sy = 0;
        this.dead = false;
        this.time = 0;
        this.speed = 150; // px/sec
    }
}

function startGame() {
    document.getElementById("start").style.display = "none";
    document.getElementById("restart").style.display = "none";
    canvas.addEventListener("click", killZombie);
    zombies = [];
    score = 0;
    time.then = Date.now();
    addZombie();
    nextFrame();
}

function nextFrame() {
	time.now = Date.now();
    time.passed += time.now - time.then;
    moveZombies();
	drawFrame();
	time.then = time.now;
    window.requestAnimationFrame(nextFrame);
}

function drawFrame() {
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    for (let z = 0; z < zombies.length; z++) {
        ctx.drawImage(image, zombies[z].sx, zombies[z].sy, sprite.width, sprite.height, zombies[z].cx, zombies[z].cy, sprite.width, sprite.height)
    }

    ctx.font = "15px sans-serif";
    ctx.fillStyle = "#000000";
	ctx.fillText("Score: " + score, 15, 30);
}

function stopGame(z) {
    if (zombies[z].cx >= canvas.width) {
        zombies.splice(z, 1);
        document.getElementById("restart").style.display = "flex";
        document.getElementById("score").innerHTML = "Score: " + score;
        canvas.removeEventListener("click", killZombie);
    }
}

function addZombie() {
    let x = - sprite.width;
    let y = Math.floor(Math.random() * (canvas.height - sprite.height));
    zombies.push(new Zombie(x, y));        
}

function moveZombies() {
    while (time.passed >= time.step) {
        time.passed -= time.step;
        for (let z = 0; z < zombies.length; z++) {
            if (!zombies[z].dead) {
                zombies[z].cx += zombies[z].speed * time.step / 1000;
            }
            nextSprite(z);
            stopGame(z);            
        }
    }
}

function nextSprite(z) {
    zombies[z].time += time.step;
    if (zombies[z].time != sprite.step) {return;}

    zombies[z].time = 0;
    zombies[z].sy += sprite.height;

    if (zombies[z].dead) {
        if (zombies[z].sy == sprite.height * 9) {zombies[z].sy = sprite.height * 8;}
    } else {
        if (zombies[z].sy == sprite.height * 10) {zombies[z].sy = 0;}
    }  

}

function killZombie(event) {
    sound.currentTime = 0;
    sound.play();
    for (let z = 0; z < zombies.length; z++) {
        if (zombies[z].dead) {continue;}
        let x = zombies[z].cx + sprite.width/2;
        let y = zombies[z].cy + sprite.height/2;
        let r = sprite.radius;

        if (x-r <= event.x && event.x <= x+r && y-r <= event.y && event.y <= y+r) {
            zombies[z].dead = true;
            zombies[z].time = 0;
            zombies[z].sy = 0;
            zombies[z].sx += sprite.width;
            score++;
            addZombie();
            addZombie();
        }
    }
}

function removeZombie(index) {
    zombies.splice(index, 1);
}
