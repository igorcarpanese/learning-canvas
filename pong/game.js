const canvas = document.getElementById('screen')
const ctx = canvas.getContext('2d');

class Ball {
    constructor(x, y, radius, velocity) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.velocity = velocity;
    }

    handleCollision() {
        if (this.x - this.radius < 0) {
            this.x = this.radius;
            this.velocity.x *= -1;
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

        this.handleCollision();
    }
}

let ball;
let pause = false;

function init() {
    canvas.width = 600;
    canvas.height = 600;

    ball = new Ball(canvas.width / 2, canvas.height / 2, 5, {x: 2, y: 1});

    document.addEventListener('keyup', (event) => {
        if (event.code == 'Space') {
            pause = ~pause;
        }
    })
}

function update() {
    requestAnimationFrame(update);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.rect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#000'; 
    ctx.fill();

    ball.update();
    ball.draw();
}

init();
update();