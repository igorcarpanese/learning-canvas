const canvas = document.getElementById('screen')
const ctx = canvas.getContext('2d');

class Ball {
    constructor(x, y, radius, velocity) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.velocity = {
            x: 2,
            y: 1
        };
    }

    draw() {
        ctx.fillStyle = "#fff";
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        ctx.fill()
    }

    update() {
        this.x += this.velocity.x;
        this.y += this.velocity.y;

        if (this.x > canvas.width  || this.x < 0) this.velocity.x *= -1;
        if (this.y > canvas.height || this.y < 0) this.velocity.y *= -1;
    }
}

let ball;

function init() {
    canvas.width = 600;
    canvas.height = 600;

    ball = new Ball(canvas.width / 2, canvas.height / 2, 5, 5);
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