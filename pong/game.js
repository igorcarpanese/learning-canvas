const canvas = document.getElementById('screen')
const ctx = canvas.getContext('2d');

class Ball {
    constructor(x, y, radius, velocity) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.velocity = velocity;
    }

    handleWallCollision() {
        if (this.x - this.radius < 0) {
            this.x = canvas.width / 2;
            this.y = canvas.height / 2;
        }

        if (this.x + this.radius > canvas.width) {
            this.velocity.x *= -1;
            this.x = canvas.width - this.radius;
        }

        if (this.y - this.radius < 0) {
            this.y = this.radius;
            this.velocity.y *= -1;
        }

        if (this.y + this.radius > canvas.height) {  
            this.y = canvas.height - this.radius;
            this.velocity.y *= -1;
        }
    }

    handlePlayerCollision() {
        // TODO: Handle case when the player collides with the ball going
        // upwards and downwards.
        const belowPlayerHead     = this.y + this.radius > player.y;
        const abovePlayerFoot     = this.y - this.radius < player.y + player.h;
        const inFrontOnPlayerBack = this.x - this.radius > player.x;
        const behindPlayerFront   = this.x - this.radius < player.x + player.w;

        if (belowPlayerHead && abovePlayerFoot && inFrontOnPlayerBack && behindPlayerFront) {
            ball.velocity.x *= -1;
        }
    }

    draw() {
        ctx.fillStyle = "#fff";
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        ctx.fill()
    }

    update() {
        if (pause) return;

        this.x += this.velocity.x;
        this.y += this.velocity.y;

        this.handleWallCollision();
        this.handlePlayerCollision();
    }
}

class Player {
    constructor(x, y, w, h, velocity) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.velocity = velocity;
        this.movingDown = false;
        this.movingUp = false;
    }

    draw() {
        ctx.fillStyle = "#fff";
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        ctx.rect(this.x, this.y, this.w, this.h);
        ctx.fill()
    }

    update() {
        if (pause) return;

        if (this.movingUp) {
            this.y = Math.max(0, this.y - this.velocity);
        } else if (this.movingDown) {
            this.y = Math.min(canvas.height - this.h, this.y + this.velocity);
        }
    }
}

let ball;
let player;
let pause = false;

function init() {
    canvas.width = 600;
    canvas.height = 600;

    ball = new Ball(canvas.width / 2, canvas.height / 2, 5, {x: 2, y: 1});
    player = new Player(20, canvas.height / 2 - 50, 5, 100, 5);

    document.addEventListener('keyup', (event) => {
        console.log(event.code)
        if (event.code == 'Space') {
            pause = ~pause;
        }

        if (event.code == 'NumpadAdd') {
            if (ball.velocity.x > 0) ball.velocity.x++;
            else ball.velocity.x--;

            if (ball.velocity.y > 0) ball.velocity.y++;
            else ball.velocity.y--;
        }
        
        if (event.code == 'NumpadSubtract') {
            if (ball.velocity.x > 0) ball.velocity.x--;
            else ball.velocity.x++;
            
            if (ball.velocity.y > 0) ball.velocity.y--;
            else ball.velocity.y++;
        }

        if (event.code == 'ArrowUp') {
            player.movingUp = false;
        }
        
        if (event.code == 'ArrowDown') {
            player.movingDown = false;
        }
    })

    document.addEventListener('keydown', (event) => {
        if (event.code == 'ArrowUp') {
            player.movingUp = true;
        }
        
        if (event.code == 'ArrowDown') {
            player.movingDown = true;
        }
    })
}

function update() {
    requestAnimationFrame(update);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.rect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#000'; 
    ctx.fill();
    
    if (pause) {
        // TODO: Use a 8-bit custom font.
        ctx.fillStyle = '#fff'; 
        ctx.textAlign = "center";
        ctx.font = "30px Inconsolata";
        ctx.fillText("PAUSE", canvas.width / 2, canvas.height / 2);
    }

    ball.update();
    ball.draw();

    player.update();
    player.draw();
}

init();
update();