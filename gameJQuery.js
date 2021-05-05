var mapsLibrary = [
	[
		[3,0,0],
		[0,0,0],
		[0,0,2]
	],
	[
		[3,0,0,0],
		[1,1,1,0],
		[2,0,1,0],
		[0,0,0,0]
	],
	[
		[3,0,0,0,1,1,1],
		[1,1,1,0,0,0,1],
		[1,0,1,1,1,0,1],
		[1,0,0,0,0,0,1],
		[1,1,1,0,0,1,1],
		[2,0,1,1,0,1,0],
		[1,0,0,0,0,0,0]
	]
]

var main;
var path;
var playerPosition = {x: 0, y: 0};
var currentMap;
var gameEnded = true;
var loadedMapIndex = 0;

const boxWidth = 80;
const boxMargin = 5;
const boxBorder = 1;

$(document).keydown(function(e) {
	switch (e.keyCode) {
		case 37: //left
			if (loadedMapIndex > 0) {
				loadedMapIndex--;
			}
			console.log(loadedMapIndex);
			initLevel(mapsLibrary[loadedMapIndex]);
			break;

		case 39: //right
			if (loadedMapIndex < mapsLibrary.length - 1) {
				loadedMapIndex++;
			}
			initLevel(mapsLibrary[loadedMapIndex]);
			break;
	}

	$("h1").html("Level " + Number(loadedMapIndex + 1)).show();
	setTimeout(function() {
		$("h1").hide();
	}, 2000);
	$("nav.controls").off("click");
	$("nav.controls").click(buttonPressed);
});

$(function() {
	main = $("main");
	path = $("nav.path");
	initLevel(mapsLibrary[loadedMapIndex]);
	$("nav.controls").click(buttonPressed);
});

function initLevel(map) {
	$("h1").hide();
	main.empty();
	path.empty();
	var rowElements = map[0].length;
	var containerWidth = rowElements * (boxWidth + 2*boxBorder + 2*boxMargin);
	main.css({width: containerWidth + "px"});
	for (var i in map) {
		var row = map[i];
		for (var j in row) {
			if (row[j] == 3) {
				playerPosition.x = i;
				playerPosition.y = j;
			}
			main.append(createBlock(row[j]));
		}
	}
	currentMap = map;
}

function createBlock(type) {
	var block = $(document.createElement("div"));
	switch (type) {
		case 1:
			block.addClass("wall");
			break;

		case 2:
			block.addClass("exit");
			break;

		case 3:
			block.addClass("player");
			break;
	}

	return block;
}

function buttonPressed(e) {
	var btn = $(e.target);
	var action = btn.data("action");
	var step = createPathStep(action);
	path.append(step);
}

function createPathStep(type) {
	var step = $(document.createElement("i"));
	step.data("action", type);

	switch (type) {
		case "left":
			step.addClass("fa fa-chevron-circle-left");
			break;

		case "up":
			step.addClass("fa fa-chevron-circle-up");
			break;

		case "down":
			step.addClass("fa fa-chevron-circle-down");
			break;

		case "right":
			step.addClass("fa fa-chevron-circle-right");
			break;

		case "go":
			step.addClass("fa fa-play-circle");
			$("nav.controls").off("click");
			tracePath();
			break;
	}

	return step;
}

function tracePath() {
	gameEnded = false;
	path.children().each(function(idx, step) {
		setTimeout(function() {
			if (!gameEnded) {
				var move = $(step).addClass("played").data("action");
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
							case 1: //wall
								gameEnded = endGame(false);
								break;

							case 2: //exit
								gameEnded = endGame(true);
							default:
								$(".player", main).removeClass("player");
								var idx = currentMap[0].length * playerPosition.y + playerPosition.x;
								$($("div", main).get(idx)).addClass("player");
								break;
						}
					}
				} catch (e) {
					console.log(e);
					gameEnded = endGame(false);
				}
			}
		}, idx * 500);
	});
}

function endGame(type)
{
	var lbl = $("h1");
	if (type) {
		lbl.html("You win!");
	} else {
		lbl.html("You lose!");
	}

	lbl.show();
	return true;
}


