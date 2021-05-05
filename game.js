var mapsLibrary = [
    [
        [3, 0, 0],
        [0, 0, 0],
        [0, 0, 2]
    ],
    [
        [3, 0, 0, 0],
        [1, 1, 1, 0],
        [2, 0, 1, 0],
        [0, 0, 0, 0]
    ],
    [
        [3, 0, 0, 0, 1, 1, 1],
        [1, 1, 1, 0, 0, 0, 1],
        [1, 0, 1, 1, 1, 0, 1],
        [1, 0, 0, 0, 0, 0, 1],
        [1, 1, 1, 0, 0, 1, 1],
        [2, 0, 1, 1, 0, 1, 0],
        [1, 0, 0, 0, 0, 0, 0]
    ]
];

// console.log(mapsLibrary);

var main;
var path = [];
var playerPosition = {
    x: 0,
    y: 0
};
var currentMap;
var gameEnded = true;
var loadedMapIndex = 0;

const boxWidth = 80;
const boxMargin = 5;
const boxBorder = 1;

// switching between levels
document.addEventListener("keydown", function (event) {
    switch (event.keyCode) {
        // left keyboard arrow
        case 37:
            if (loadedMapIndex > 0) {
                loadedMapIndex--;
            }
            initLevel(mapsLibrary[loadedMapIndex]);
            break;
        // right keyboard arrow    
        case 39:
            if (loadedMapIndex < mapsLibrary.length - 1) {
                loadedMapIndex++;
            }
            initLevel(mapsLibrary[loadedMapIndex]);
            break;
    }
    var h1 = document.querySelector("h1");
    h1.style.display = "block";
    h1.innerHTML = `Level ${Number(loadedMapIndex + 1)}`;
    setTimeout(function () {
        h1.style.display = "none";
    }, 2000);
    var navControls = document.querySelector("nav.controls");
    var navControlsChildren = [...navControls.children];
    navControlsChildren.forEach(navControlsChild => {
        navControlsChild.addEventListener("click", buttonPressed);
    });
});

function buttonPressed(event) {
    var btn = event.target;
    var action = btn.dataset["action"];
    var step = createPathStep(action);
    var path = document.querySelector("nav.path");
    path.appendChild(step);
    if (step.classList.contains("fa-play-circle")) {
        var navControls = document.querySelector("nav.controls");
        var navControlsChildren = [...navControls.children];
        navControlsChildren.forEach(navControlsChild => {
            navControlsChild.removeEventListener("click", buttonPressed);
        });
        tracePath();
    }
}

window.onload = function () {
    initLevel(mapsLibrary[loadedMapIndex]);
    var navControls = document.querySelector("nav.controls");
    var navControlsChildren = [...navControls.children];
    navControlsChildren.forEach(navControlsChild => {
        navControlsChild.addEventListener("click", buttonPressed);
    });
}

function initLevel(map) {
    var h1 = document.querySelector("h1");
    h1.style.display = "none";
    var main = document.querySelector("main");
    while (main.lastChild) {
        main.removeChild(main.lastChild);
    }
    var path = document.querySelector("nav.path");
    while (path.lastChild) {
        path.removeChild(path.lastChild);
    }
    var rowElements = map[0].length;
    var containerWidth = rowElements * (boxWidth + 2 * boxBorder + 2 * boxMargin);
    main.style.width = containerWidth + "px";
    for (var i in map) {
        var row = map[i];
        for (var j in row) {
            if (row[j] == 3) {
                playerPosition.x = i;
                playerPosition.y = j;
            }
            var blockToCreate = createBlock(row[j]);
            main.appendChild(blockToCreate);
        }
    }
    currentMap = map;
}

function createBlock(type) {
    var block = document.createElement("div");
    switch (type) {
        case 1:
            block.classList.add("wall");
            break;
        case 2:
            block.classList.add("exit");
            break;
        case 3:
            block.classList.add("player");
            break;
    }

    return block;
}

function createPathStep(type) {
    var step = document.createElement("i");
    step.setAttribute("data-action", type);

    switch (type) {
        case "left":
            step.classList.add("fa");
            step.classList.add("fa-chevron-circle-left");
            break;
        case "up":
            step.classList.add("fa");
            step.classList.add("fa-chevron-circle-up");
            break;
        case "down":
            step.classList.add("fa");
            step.classList.add("fa-chevron-circle-down");
            break;
        case "right":
            step.classList.add("fa");
            step.classList.add("fa-chevron-circle-right");
            break;
        case "go":
            step.classList.add("fa");
            step.classList.add("fa-play-circle");
            break;
        case "go":
            step.classList.add("fa");
            step.classList.add("fa-play-circle");
            break;
    }
    return step;
}

function tracePath() {
    gameEnded = false;
    var path = document.querySelector("nav.path");
    var pathChildren = [...path.children];
    pathChildren.forEach((step, idx) => {
        setTimeout(() => {
            step.style.color = "#807186";
            var move = step.dataset["action"];
            switch (move) {
                case "left":
                    playerPosition.x--;
                    break;
                case "up":
                    playerPosition.y--;
                    break;
                case "down":
                    playerPosition.y++;
                    break;
                case "right":
                    playerPosition.x++;
                    break;
            }
            try {
                var blockType = currentMap[playerPosition.y][playerPosition.x];
                if (typeof blockType == "undefined") {
                    gameEnded = endGame(false);
                } else {
                    switch (blockType) {
                        case 1:
                            //wall
                            animatePlayer();
                            gameEnded = endGame(false);
                            break;
                        case 2:
                            //exit
                            animatePlayer();
                            gameEnded = endGame(true);
                            break;
                        default:
                            animatePlayer();
                            break;
                    }
                }
            } catch (e) {
                console.log(e);
                gameEnded = endGame(false);
            }
            if (idx == pathChildren.length - 1 && currentMap[playerPosition.y][playerPosition.x] == 0) {
                gameEnded = endGame(false);
            }
        }, idx * 500);
    });
}

function endGame(type) {
    var lbl = document.querySelector("h1");
    lbl.innerHTML = " ";
    lbl.style.display = "block";
    if (type) {
        setTimeout(function () {
            lbl.innerHTML = "You win!";
        }, 1000);
    } else {
        setTimeout(function () {
            lbl.innerHTML = "You lose!";
        }, 1000);
    }

    return true;
}

function animatePlayer() {
    var player = document.querySelector("div.player");
    player.classList.remove("player");
    var index = currentMap[0].length * Number(playerPosition.y) + Number(playerPosition.x);
    var main = document.querySelector("main");
    var newPlayerSet = main.children[index];
    newPlayerSet.classList.add("player");
}