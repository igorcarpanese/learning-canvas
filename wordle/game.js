canvas = document.getElementById("screen");
ctx = canvas.getContext('2d');

// grid = [['A', 'B', 'C', 'D', 'E'],
//         ['F', 'G', 'H', 'I', 'J'],
//         ['K', 'L', 'M', 'N', 'O'],
//         ['P', 'Q', 'R', 'S', 'T'],
//         ['U', 'V', 'W', 'X', 'Y'],
//         ['Z', '', '', '', '']]

const grid = [['', '', '', '', ''],
              ['', '', '', '', ''],
              ['', '', '', '', ''],
              ['', '', '', '', ''],
              ['', '', '', '', ''],
              ['', '', '', '', '']]

const feedback = [[null, null, null, null, null],
                  [null, null, null, null, null],
                  [null, null, null, null, null],
                  [null, null, null, null, null],
                  [null, null, null, null, null],
                  [null, null, null, null, null]]

let answer = 'TESTE';
let round = 0;
let pos = 0;
const boxSize = {
    h: 58,
    w: 58
};

function drawWords() {
    let x0 = canvas.width / 2 - (grid[0].length / 2 * boxSize.w) - boxSize.w / 2;
    let y0 = canvas.height / 2 - (grid.length / 2 * boxSize.h);

    for (let i = 0; i < grid.length; i++) {
        for (let j = 0; j < grid[i].length; j++) {
            ctx.fillStyle = '#fff';
            ctx.textAlign = "center";
            ctx.textBaseline = "middle"; 
            ctx.font = '36px Georgia';

            let x = x0 + (j+1) * boxSize.w;
            let y = y0 + (i+1) * boxSize.h + 4;
            ctx.fillText(grid[i][j], x, y);
        }
    }
}

function drawWordsBox() {
    let x0 = canvas.width / 2 - (grid[0].length / 2 * boxSize.w) - boxSize.w;
    let y0 = canvas.height / 2 - (grid.length / 2 * boxSize.h) - boxSize.h / 2;

    for (let i = 0; i < grid.length; i++) {
        for (let j = 0; j < grid[i].length; j++) {
            let x = x0 + (j+1) * boxSize.w;
            let y = y0 + (i+1) * boxSize.h;

            if (i < round) {
                ctx.beginPath();
                ctx.fillStyle = feedback[i][j];
                ctx.rect(x, y, boxSize.w, boxSize.h);
                ctx.fill();

                ctx.beginPath();
                ctx.strokeStyle = '#fff';
                ctx.strokeRect(x, y, boxSize.w, boxSize.h);
            } else {
                ctx.beginPath();
                ctx.strokeStyle = '#fff';
                ctx.strokeRect(x, y, boxSize.w, boxSize.h);
            }
        }
    }
}

function drawAuxLines() {
    let x0 = canvas.width / 2 - (grid[0].length / 2 * boxSize.w);
    let xf = canvas.width / 2 - (grid[0].length / 2 * boxSize.w) + (grid[0].length * boxSize.w);

    let y0 = canvas.height / 2 - (grid.length / 2 * boxSize.h) + boxSize.h / 2;
    let yf = canvas.height / 2 - (grid.length / 2 * boxSize.h) + boxSize.h / 2 + (grid.length * boxSize.w);

    ctx.beginPath();
    ctx.strokeStyle = '#555';
    ctx.moveTo(x0, canvas.height / 2 - 2 * boxSize.w);
    ctx.lineTo(xf, canvas.height / 2 - 2 * boxSize.w);
    ctx.stroke();

    ctx.beginPath();
    ctx.strokeStyle = '#555';
    ctx.moveTo(x0, canvas.height / 2 - boxSize.w);
    ctx.lineTo(xf, canvas.height / 2 - boxSize.w);
    ctx.stroke();

    ctx.beginPath();
    ctx.strokeStyle = '#555';
    ctx.moveTo(x0, canvas.height / 2 + boxSize.w);
    ctx.lineTo(xf, canvas.height / 2 + boxSize.w);
    ctx.stroke();

    ctx.beginPath();
    ctx.strokeStyle = '#555';
    ctx.moveTo(x0, canvas.height / 2 + 2 * boxSize.w);
    ctx.lineTo(xf, canvas.height / 2 + 2 * boxSize.w);
    ctx.stroke();

    ctx.beginPath();
    ctx.strokeStyle = '#555';
    ctx.moveTo(x0, canvas.height / 2 + 3 * boxSize.w);
    ctx.lineTo(xf, canvas.height / 2 + 3 * boxSize.w);
    ctx.stroke();

    ctx.beginPath();
    ctx.strokeStyle = '#555';
    ctx.moveTo(x0, canvas.height / 2);
    ctx.lineTo(xf, canvas.height / 2);
    ctx.stroke();

    ctx.beginPath();
    ctx.strokeStyle = '#555';
    ctx.moveTo(canvas.width / 2, y0);
    ctx.lineTo(canvas.width / 2, yf);
    ctx.stroke();
}

function getFeedback() {
    const guess = grid[round].join('');
    
    for (let i = 0; i < guess.length; i++) {
        if (guess[i] == answer[i]) feedback[round][i] = '#79a352';
        else if (answer.includes(guess[i])) feedback[round][i] = '#c7b265';
        else feedback[round][i] = '#7a7c7e';
    }
}

function init() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    document.addEventListener('keyup', (event) => {
        if (round == 6) return;

        if (event.code == 'Backspace') {
            pos = Math.max(0, pos - 1);
            grid[round][pos] = '';
        } else if (event.code == 'Enter' || event.code == 'NumpadEnter') {
            if (pos == 5) {
                getFeedback();
                round++;
                pos = 0;
            }
        } if (event.code.startsWith('Key') && event.code.length == 4) {
            if (pos == 5) return;

            const letter = event.code[3];           
            grid[round][pos++] = letter;
        }
    });
}

function update() {
    requestAnimationFrame(update);

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.rect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#000'; 
    ctx.fill();

    drawWordsBox();
    drawWords();
    drawAuxLines();
}

init();
update();