var bombLocations = [];
let flagged = false;
let clickedAmount = 0;
let flaggedBombs = 0;
let time = 0;

let highScore = document.cookie

if (highScore == "" || highScore == 0) {
    message = 'No highscore yet'
    highScore = 1000000000000000000000000000000000
} else {
    message = highScore + ' seconds'
}

document.getElementById('highScore').innerHTML = message

function create() {
    document.getElementById('controls').style.display = 'none';
    document.getElementById('gameControls').style.display = 'grid';

    sizeX = document.getElementById('sizeX').value;
    sizeY = document.getElementById('sizeY').value;
    bombsPercent = document.getElementById('bombInput').value;
    bombs = Math.floor(sizeX * sizeY * (bombsPercent / 100));
    if (bombs == 0) {
        bombs = 1;
    }
    bombsFix = bombs

    document.getElementById('flaggedBombs').innerHTML = 'Flags: ' + bombs

    for (let i = 0; i < bombs; i++) {
        newBombLocation = Math.round(Math.random() * (sizeX * sizeY))
        for (let l = 0; l < bombLocations.length; l++) {
            if (newBombLocation == bombLocations[l]) {
                bombs++;
                newBombLocation = -100 - i;
            }
        }
        bombLocations.push(newBombLocation);
    }

    let posX = 0;
    let posY = 0;

    var gameContainer = document.getElementById('container');
    gameContainer.addEventListener('contextmenu', event => event.preventDefault());

    gameContainer.style.width = sizeX * 20 + "px";
    gameContainer.style.height = sizeY * 20 + "px";
    gameContainer.style.gridTemplateRows = `repeat(${sizeY}, 20px)`;
    gameContainer.style.gridTemplateColumns = `repeat(${sizeX}, 20px)`;

    for (let i = 0; i < (sizeX * sizeY); i++) {
        var newButton = document.createElement('button');
        newButton.id = i;
        newButton.classList.add('spotBtn');
        newButton.addEventListener('mouseup', function(e) {
            var e = e || window.event;
            var btnCode = e.button;

            switch (btnCode) {
                case 0:
                    checkHit();
                    break;
                case 2:
                    placeFlag();
                    break;
                default:
            }
        });
        if (posX == sizeX) {
            posX = 0;
            posY++;
        } else {
            posX++;
        }
        newButton.style.grid = posX + '/' + posY;
        gameContainer.appendChild(newButton);
    }
    setInterval(timer, 1000);
}

function checkHit() {
    clicked = event.target.id;
    clickedBtn = event.target
    clickedXY = clicked / sizeX + 1.1
    let bombsNear = 0;
    let direction = 0;
    let fraction = 1 / sizeX;
    onBegin = (clickedXY - 0.1 - Math.floor(clickedXY)).toFixed(1) == 0
    onEnd = (clickedXY - 1.1 - Math.floor(clickedXY - 1.1)).toFixed(4) == (1 - fraction).toFixed(4);

    for (let i = 0; i < bombLocations.length; i++) {
        bombXY = (bombLocations[i] / sizeX + 1.1).toFixed(4)

        if (onBegin) {
            checkFront = 1;
            checkBack = 1000000000000000000000000000;
        } else if (onEnd) {
            checkFront = 1000000000000000000000000000;
            checkBack = 1;
        } else {
            checkFront = 1;
            checkBack = 1;
        }
        
        for (let l = 0; l < 8; l++) {

            if (l == 0) {direction = (-1 - fraction) * checkBack;} 
            else if (l == 1) {direction = -1;}
            else if (l == 2) {direction = (-1 + fraction) * checkFront;}
            else if (l == 3) {direction = (-fraction) * checkBack;}
            else if (l == 4) {direction =  fraction * checkFront;}
            else if (l == 5) {direction = (1 - fraction) * checkBack;}
            else if (l == 6) {direction = 1;}
            else if (l == 7) {direction = (1 + fraction) * checkFront;}

            checkPos = (clickedXY + direction).toFixed(4)

            if (checkPos == bombXY) {
                bombsNear++;
            }
        }
    }

    for (let i = 0; i < bombLocations.length; i++) {
        if (clicked == bombLocations[i]) {
            endGame(false);
            bombsNear = "";
            clickedBtn.classList.add('boom')
        } else if (clicked != bombLocations[i]) {
            clickedBtn.classList.add('safe')
            
            if (bombsNear == 0) {
                bombsNear = "";
            }
            clickedBtn.innerHTML = bombsNear;
        }
    }

    if ((clickedBtn.name) != 'safe') {
        clickedAmount++;
        clickedBtn.name = 'safe';
    }
    

    if (clickedAmount == (sizeX * sizeY - bombs)) {
        endGame(true)
    }
}

function placeFlag() {
    clicked = event.target;
    flagged = clicked.name == 'flag';
    
    if (flagged == true) {
        clicked.classList.remove('flag')
        clicked.name = ''
        flaggedBombs--;
    } else if (flagged == false) {
        clicked.classList.add('flag')
        clicked.name = 'flag'
        flaggedBombs++;
    }

    document.getElementById('flaggedBombs').innerHTML = 'Flags: ' + (bombsFix - flaggedBombs);
}

function timer() {
    time++;
    document.getElementById('timer').innerHTML = 'Time: ' + (time);
}

function resetScore() {
    document.cookie = 0;
    reset();
}

function endGame(win) {
    if (win) {
        setTimeout(function() {
            var username = window.prompt("What's your name?")
            if (username.toLowerCase() == 'merijn' || username.toLowerCase() == 'kryda') {
                window.alert('You won babe!\n love youuuu!!!')
            } else {
                window.alert(`You won ${username}!`)
            }
            if (time < highScore) {
                document.cookie = time;
            }
            reset();
        }, 100);
    } else if (win == false) {
        setTimeout(function() {
            window.alert('You lost!')
            reset();
        }, 100);
    }
}

function reset() {
    location.reload()
}