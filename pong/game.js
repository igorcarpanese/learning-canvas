const canvas = document.getElementById('screen')
const ctx = canvas.getContext('2d');

class Ball {
    constructor(radius, initialVelocity) {
        this.radius = radius;
        this.initialVelocity = initialVelocity;
        this.resetting = false;
        this.n_hits = 0;

        this.reset()

        document.addEventListener('keyup', (event) => {
            if (event.code == 'NumpadAdd') {
                if (this.velocity.x > 0) this.velocity.x++;
                else this.velocity.x--;
    
                if (this.velocity.y > 0) this.velocity.y++;
                else this.velocity.y--;
            }

            if (event.code == 'NumpadSubtract') {
                if (this.velocity.x > 0) this.velocity.x--;
                else this.velocity.x++;
                
                if (this.velocity.y > 0) this.velocity.y--;
                else this.velocity.y++;
            }
        })
    }

    reset() {
        this.resetting = true;
        this.x = canvas.width / 2;
        this.y = canvas.height / 2;
        this.n_hits = 0;

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
            this.velocity.x *= -1;
            this.n_hits++;
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
            this.velocity.x *= -1;
            this.n_hits++;
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

        if (this.n_hits == 4) {
            if (this.velocity.x > 0) this.velocity.x++;
            else this.velocity.x--;

            if (this.velocity.y > 0) this.velocity.y++;
            else this.velocity.y--;

            this.n_hits = 0;
        }
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
        this.initialY = canvas.height / 2 - this.h / 2;

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
        this.resetting = false;

        this.initialX = canvas.width - this.w - player.initialX;
        this.initialY = canvas.height / 2 - this.h / 2;

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
        this.resetting = false;

        this.initialX = canvas.width - this.w - player.initialX;
        this.initialY = canvas.height / 2 - this.h / 2;

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

class PredictEnemy {
    constructor(w, h, velocity) {
        this.w = w;
        this.h = h;
        this.velocity = velocity;
        this.resetting = false;
        this.relax = true;

        this.initialX = canvas.width - this.w - player.initialX;
        this.initialY = canvas.height / 2 - this.h / 2;

        this.targetY = this.initialY; 

        this.x = this.initialX;
        this.y = this.initialY;
    }

    reset() {
        this.resetting = true;
        this.relax = true;
    }

    draw() {
        ctx.fillStyle = "#fff";
        ctx.beginPath();
        ctx.rect(this.x, this.y, this.w, this.h);
        ctx.fill()
    }

    updateTargetY() {
        const simulationBall = new Ball(ball.radius, {min: 0, max: 0});
        simulationBall.velocity = {...ball.velocity};
        simulationBall.x = ball.x;
        simulationBall.y = ball.y;

        while (simulationBall.x + simulationBall.radius < this.x) {
            simulationBall.update();
        }

        this.targetY = Math.min(
            Math.max(0, simulationBall.y - this.h / 2),
            canvas.height - this.h
        );
    }

    update() {
        const nextRelax = ball.velocity.x < 0 || ball.resetting;
        
        if (this.relax && nextRelax) {
            if (this.y > this.initialY) {
                this.y = Math.max(this.initialY, this.y - this.velocity);
            } else if (this.y < this.initialY) {
                this.y = Math.min(this.initialY, this.y + this.velocity);
            } else {
                this.resetting = false;
            }

            return;
        }

        if (this.relax && !nextRelax) {
            this.updateTargetY();
        }

        if (this.y > this.targetY) {
            this.y = Math.max(this.targetY, this.y - this.velocity);
        } else if (this.y < this.targetY) {
            this.y = Math.min(this.targetY, this.y + this.velocity);
        } else {
            this.resetting = false;
        }

        this.relax = nextRelax;
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
    enemy  = new PredictEnemy(25, 125, 10);

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
            enemy = new WaitEnemy(25, 125, 5);
            score.player = score.enemy = 0;
        }
        
        // TODO: Improve transition of the enemy.
        if (event.code == 'Digit3' || event.code == 'Numpad3') {
            player.reset();
            ball.reset();
            enemy = new PredictEnemy(25, 125, 5);
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