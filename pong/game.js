const canvas = document.getElementById('screen')
const ctx = canvas.getContext('2d');

class Ball {
    constructor(radius, initialVelocity) {
        this.radius = radius;
        this.initialVelocity = initialVelocity;
        this.resetting = false;

        this.reset()

        document.addEventListener('keyup', (event) => {
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
        })
    }

    reset() {
        this.resetting = true;
        this.x = canvas.width / 2;
        this.y = canvas.height / 2;

        function randomVelocity(initialVelocity) {
            const min = initialVelocity.min;
            const max = initialVelocity.max;

            const directions = [
                Math.ceil(Math.random() * ( max - min) + ( min)),
                Math.ceil(Math.random() * (-max + min) + (-min))
            ]

            const randomIndex = Math.round(Math.random());

            return directions[randomIndex];

        }

        this.velocity = {
            x: randomVelocity(this.initialVelocity),
            y: randomVelocity(this.initialVelocity)
        };
    }

    handleWallCollision() {
        if (this.x - this.radius < 0) {
            this.reset();
            player.reset();
            enemy.reset();
            score.enemy++;
        }
        
        if (this.x + this.radius > canvas.width) {
            this.reset();
            player.reset();
            enemy.reset();
            score.player++;
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

    handleEnemyCollision() {
        // TODO: Handle case when the player collides with the ball going
        // upwards and downwards.
        const belowEnemyHead     = this.y + this.radius > enemy.y;
        const aboveEnemyFoot     = this.y - this.radius < enemy.y + enemy.h;
        const inFrontOnEnemyBack = this.x + this.radius < enemy.x + enemy.w;
        const behindEnemyFront   = this.x + this.radius > enemy.x;

        if (belowEnemyHead && aboveEnemyFoot && inFrontOnEnemyBack && behindEnemyFront) {
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
        if (this.resetting) {
            if (player.resetting || enemy.resetting) return;
            else this.resetting = false;
        }

        this.x += this.velocity.x;
        this.y += this.velocity.y;

        this.handleWallCollision();
        this.handlePlayerCollision();
        this.handleEnemyCollision();
    }
}

class Player {
    constructor(w, h, velocity) {
        this.w = w;
        this.h = h;
        this.velocity = velocity;
        this.movingDown = false;
        this.movingUp = false;
        this.resetting = false;

        this.initialX = 20;
        this.initialY = canvas.height / 2 - 50;

        this.x = this.initialX;
        this.y = this.initialY;

        document.addEventListener('keyup', (event) => {
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

    reset() {
        this.resetting = true;
    }

    draw() {
        ctx.fillStyle = "#fff";
        ctx.beginPath();
        ctx.rect(this.x, this.y, this.w, this.h);
        ctx.fill()
    }

    update() {
        if (this.resetting) {
            const velocity = Math.min(this.velocity, enemy.velocity);

            if (this.y > this.initialY) {
                this.y = Math.max(this.initialY, this.y - velocity);
            } else if (this.y < this.initialY) {
                this.y = Math.min(this.initialY, this.y + velocity);
            } else {
                this.resetting = false;
            }

            return;
        }

        if (this.movingUp) {
            this.y = Math.max(0, this.y - this.velocity);
        } else if (this.movingDown) {
            this.y = Math.min(canvas.height - this.h, this.y + this.velocity);
        }
    }
}

class NaiveEnemy {
    constructor(w, h, velocity) {
        this.w = w;
        this.h = h;
        this.velocity = velocity;
        this.movingDown = false;
        this.movingUp = false;
        this.resetting = false;

        this.initialX = canvas.width - 20 - 5;
        this.initialY = canvas.height / 2 - 50;

        this.x = this.initialX;
        this.y = this.initialY;
    }

    reset() {
        this.resetting = true;
    }

    draw() {
        ctx.fillStyle = "#fff";
        ctx.beginPath();
        ctx.rect(this.x, this.y, this.w, this.h);
        ctx.fill()
    }

    update() {
        if (this.resetting) {
            const velocity = Math.min(this.velocity, player.velocity);

            if (this.y > this.initialY) {
                this.y = Math.max(this.initialY, this.y - velocity);
            } else if (this.y < this.initialY) {
                this.y = Math.min(this.initialY, this.y + velocity);
            } else {
                this.resetting = false;
            }

            return;
        }

        if (ball.y < this.y + this.h / 2) {
            this.y = Math.max(
                0,
                this.y - this.velocity,
                ball.y - this.h / 2
            );
        } else {
            this.y = Math.min(
                canvas.height - this.h,
                this.y + this.velocity,
                ball.y - this.h / 2
            );
        }
    }
}

class WaitEnemy {
    constructor(w, h, velocity) {
        this.w = w;
        this.h = h;
        this.velocity = velocity;
        this.movingDown = false;
        this.movingUp = false;
        this.resetting = false;

        this.initialX = canvas.width - 20 - 5;
        this.initialY = canvas.height / 2 - 50;

        this.x = this.initialX;
        this.y = this.initialY;
    }

    reset() {
        this.resetting = true;
    }

    draw() {
        ctx.fillStyle = "#fff";
        ctx.beginPath();
        ctx.rect(this.x, this.y, this.w, this.h);
        ctx.fill()
    }

    update() {
        const waiting = ball.velocity.x < 0 || ball.resetting;

        if (waiting) {
            if (this.y > this.initialY) {
                this.y = Math.max(this.initialY, this.y - this.velocity);
            } else if (this.y < this.initialY) {
                this.y = Math.min(this.initialY, this.y + this.velocity);
            } else {
                this.resetting = false;
            }
        } else {
            if (ball.y < this.y + this.h / 2) {
                this.y = Math.max(
                    0,
                    this.y - this.velocity,
                    ball.y - this.h / 2
                );
            } else {
                this.y = Math.min(
                    canvas.height - this.h,
                    this.y + this.velocity,
                    ball.y - this.h / 2
                );
            }
        }
    }
}

let ball;
let player, enemy;
let paused = false;
let score = {
    player: 0,
    enemy: 0
};

function init() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const font = new FontFace('Pixeboy', 'url(assets/fonts/pixeboy/Pixeboy.ttf)');
    document.fonts.add(font);    

    ball   = new Ball(7, {min: 8, max: 12});
    player = new Player(25, 125, 10);
    // enemy  = new NaiveEnemy(5, 100, 15);
    enemy  = new WaitEnemy(25, 125, 10);

    document.addEventListener('keyup', (event) => {
        if (event.code == 'Space') {
            paused = ~paused;
        }

        // TODO: Improve transition of the enemy.
        if (event.code == 'Digit1' || event.code == 'Numpad1') {
            player.reset();
            ball.reset();
            enemy = new NaiveEnemy(25, 125, 15);
            score.player = score.enemy = 0;
        }
        
        // TODO: Improve transition of the enemy.
        if (event.code == 'Digit2' || event.code == 'Numpad2') {
            player.reset();
            ball.reset();
            enemy = new WaitEnemy(5, 100, 5);
            score.player = score.enemy = 0;
        }
    })
}

function update() {
    requestAnimationFrame(update);

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.rect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#000'; 
    ctx.fill();
    
    if (paused) {
        // TODO: Use a 8-bit custom font.
        ctx.fillStyle = '#fff'; 
        ctx.textAlign = "center";
        ctx.textBaseline = "hanging";
        ctx.font = "60px Pixeboy";
        ctx.fillText("PAUSE", canvas.width / 2, canvas.height / 2);
    }

    ball.draw();
    player.draw();
    enemy.draw();

    ctx.beginPath();
    ctx.strokeStyle = '#fff';
    ctx.setLineDash([15, 20]);
    ctx.moveTo(canvas.width / 2, 0);
    ctx.lineTo(canvas.width / 2, canvas.height);
    ctx.stroke();

    ctx.fillStyle = '#fff'; 
    ctx.textAlign = "center";
    ctx.textBaseline = "hanging";
    ctx.font = "175px Pixeboy";
    ctx.fillText(score.player, canvas.width * 1 / 4, canvas.height / 100);
    ctx.fillText(score.enemy, canvas.width * 3 / 4, canvas.height  / 100);

    if (!paused) {
        ball.update();
        player.update();
        enemy.update();
    }
}

init();
update();