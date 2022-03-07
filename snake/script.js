let direction = '';
let pressedKey = '';
let headLocation = 10.50;
let snakeLocations = [0];
let snakeLength = 0;
let newCorrectDotLocation = 0.05;
let oldDotLocation = 0.05;
let newInterval = 0;
let startGameInterval = 0;

function createGame() {
    document.getElementById('startPage').style.display = 'none'
    startGameInterval = 1000 - ((document.getElementById('startInterval').value - 1) * 100)
    if (startGameInterval < 100) {
        window.alert('Invalid game speed')
        location.reload()
    }
    interval = setInterval(gameTick, startGameInterval) 
    document.addEventListener('keydown', function(e) {
        pressedKey = e.key
    });

    var container = document.getElementById('container')
    container.style.display = 'grid';

    for (let i = 1; i <= 400; i++) {
        var newSpot = document.createElement('div');
        newSpot.id = (i / 20).toFixed(2);
        newSpot.classList.add('spot');
        container.appendChild(newSpot);

        var posX = 0;
        var posY = 0;

        if (posX > 20) {
            posY++;
            posX = 0;
        } else {
            posX++;
        }

        newSpot.style.grid = posX + '/' + posY;
    }
    document.getElementById(headLocation.toFixed(2)).classList.add('head')

    createNewDot();
}
    
function createNewDot() {
    oldDotLocation = newCorrectDotLocation;
    newDotLocation = Math.floor(Math.random() * 400);
    for (let i = 0; i < snakeLocations.length; i++) {
        if (newDotLocation == snakeLocations[i]) {
            createNewDot();
            newCorrectDotLocation = null;
        } else {
            newCorrectDotLocation = newDotLocation / 20;
        }
    }
    console.log('HIT')
    document.getElementById(oldDotLocation.toFixed(2)).classList.remove('dot')
    document.getElementById(newCorrectDotLocation.toFixed(2)).classList.add('dot')
}

function gameTick() {
    document.getElementById(headLocation.toFixed(2)).classList.remove('head')
    console.log(document.getElementById(headLocation.toFixed(2)))
    if (pressedKey == 'a' && direction == 'd') {
        pressedKey = 'd';
    } else if (pressedKey == 'd' && direction == 'a') {
        pressedKey = 'a';
    } else if (pressedKey == 'w' && direction == 's') {
        pressedKey = 's';
    } else if (pressedKey == 's' && direction == 'w') {
        pressedKey = 'w';
    }

    snakeLocations = {}

    var oldHeadLocation = headLocation
    
    if (pressedKey == 'w' && direction != 's') {
        headLocation--;
    } else if (pressedKey == 'a' && direction != 'd') {
        headLocation -= 0.05;
    } else if (pressedKey == 's' && direction != 'w') {
        headLocation++;
    } else if (pressedKey == 'd' && direction != 'a') {
        headLocation += 0.05;
    }

    direction = pressedKey;

    if ((headLocation- 0.05) > 20 || headLocation < 0 || 
    ((Math.floor(headLocation - 0.04) < Math.floor(oldHeadLocation - 0.04)) && direction == 'a') || 
    ((Math.floor(headLocation - 0.04) > Math.floor(oldHeadLocation -  0.04)) && direction == 'd')) 
    {
        window.alert('You lost!')
        location.reload()
    }
    document.getElementById(headLocation.toFixed(2)).classList.add('head')

    console.log(headLocation.toFixed(2), newCorrectDotLocation.toFixed(2))

    if (headLocation == newCorrectDotLocation) {
        createNewDot();
        changeInterval();
        snakeLength++
    }
}

function changeInterval() {
    if (newInterval < (10 - document.getElementById('startInterval').value)) {
        newInterval++;
    }
    
    newCorrectInterval = startGameInterval - (newInterval * 100)

    clearInterval(interval)
    interval = setInterval(gameTick, newCorrectInterval)
}