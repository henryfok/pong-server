var session = {
	chosenSide: null,
	enemySide: null
};

$('#multiplayer-green').on('click', function(event) {
	event.preventDefault();
	console.log($('#multiplayer-green').text());
	socket.emit('choose paddle', 'green');
	session.chosenSide = paddlePlayer;
	session.enemySide = paddleEnemy;
	$('#multiplayer-blue').off();
	$('#multiplayer-green').off();
	$('#multiplayer-green').css('color', '#808080');
});

$('#multiplayer-blue').on('click', function(event) {
	event.preventDefault();
	console.log($('#multiplayer-blue').text());
	socket.emit('choose paddle', 'blue');
	session.chosenSide = paddleEnemy;
	session.enemySide = paddlePlayer;
	$('#multiplayer-green').off();
	$('#multiplayer-blue').off();
	$('#multiplayer-blue').css('color', '#808080');
});

function checkBtnStatus() {
	socket.on('choose paddle', function(colour) {
		console.log('colour clicked: ' + colour);
		if (colour === 'green') {
			$('#multiplayer-green').off();
			$('#multiplayer-green').css('color', '#808080');
		} else if (colour === 'blue') {
			$('#multiplayer-blue').off();
			$('#multiplayer-blue').css('color', '#808080');
		}
	});
}

function checkGameStatus() {
	socket.on('game status', function(status) {
		console.log('game status: ' + status);
		if (status === 'ready') {
			animateCSS('.multiplayer', 'bounceOut', function() {
				document.querySelector('.multiplayer').style.visibility = 'hidden';
				start();
			});
		}
	});
}

var scoreMax = 8;

var screen = {
	elem: document.querySelector('.pong'),
	rx: 0,
	ry: 0
}

var keyPressed = {32: false, 38: false, 40: false};

function rotateScreen() {
	screen.rx = scale(ball.y, 0, 720, -15, 15);
	screen.ry = scale(ball.x, 0, 1280, -15, 15);
	// console.log(screen.rx + ":" + screen.ry);
}

// KeyW 87 / ArrowUp 38
// KeyS 83 / ArrowDown 40
// Space 32

function addEventListeners() {
	playerElem = session.chosenSide;
	console.log('chosen player: ' + playerElem.colour);
	window.addEventListener('keydown', function(keycode) {
		keyPressed[keycode.keyCode] = true;
		if (keyPressed[38]) {
			playerElem.moveUp = true;
		}
		if (keyPressed[40]) {
			playerElem.moveDown = true;
		}
		if (keyPressed[32]) {
			playerElem.charging = true;
		}
		if (keyPressed[38] && keyPressed[32]) {
			playerElem.moveUp = true;
			playerElem.charging = true;
		}
		if (keyPressed[40] && keyPressed[32]) {
			playerElem.moveDown = true;
			playerElem.charging = true;
		}
	});

	window.addEventListener('keyup', function(keycode) {
		keyPressed[keycode.keyCode] = false;
		if (!keyPressed[38]) {
			playerElem.moveUp = false;
			playerMovingUp = false;
			if (!playerNotMoving) {
				playerNotMoving = true;
				sendPaddleLocation(playerElem.colour, playerElem.y);
				sendPaddleStatus(playerElem.colour, 'none');
			}
		}
		if (!keyPressed[40]) {
			playerElem.moveDown = false;
			playerMovingDown = false;
			if (!playerNotMoving) {
				playerNotMoving = true;
				sendPaddleLocation(playerElem.colour, playerElem.y);
				sendPaddleStatus(playerElem.colour, 'none');
			}
		}
		if (!keyPressed[32]) {
			playerElem.charging = false;
		}
		if (keyPressed[32]) {
			playerElem.charging = true;
		}
	});
}

function chargeSpike() {
	if (paddlePlayer.charging === true && paddlePlayer.spikeCharge < 1) {
		paddlePlayer.speed = paddleSpeed * Math.min(1, (1.1 - paddlePlayer.spikeCharge));
		paddlePlayer.spikeCharge += 0.01;
		if (paddlePlayer.spikeCharge > 0.8) {
			document.querySelector('.paddle-player').style.background = '#FFF';
		} else {
			document.querySelector('.paddle-player').style.background = '#33FF55';
		}
		document.querySelector('.spike-charge').style.transform = 'scaleX(' + paddlePlayer.spikeCharge + ')';
	} else if (paddlePlayer.charging === false && paddlePlayer.spikeCharge > 0) {
		document.querySelector('.paddle-player').style.background = '#33FF55';
		paddlePlayer.speed = paddleSpeed;
		paddlePlayer.spikeCharge -= 0.1;;
		document.querySelector('.spike-charge').style.transform = 'scaleX(' + paddlePlayer.spikeCharge + ')';
	}
}

var playerMovingUp = false;
var playerMovingDown = false;
var playerNotMoving = true;
var enemyMovingUp = false;
var enemyMovingDown = false;
var enemyNotMoving = true;

function movePlayer() {
	playerElem = session.chosenSide
	playerColour = session.chosenSide.colour;
	if (playerElem.moveUp) {
		playerNotMoving = false;
		playerElem.y -= playerElem.speed;
		if (!playerMovingUp) {
			playerMovingUp = true;
			playerMovingDown = false;
			sendPaddleStatus(playerColour, 'up')
		}
	} else if (playerElem.moveDown) {
		playerNotMoving = false;
		playerElem.y += playerElem.speed;
		if (!playerMovingDown) {
			playerMovingUp = false;
			playerMovingDown = true;
			sendPaddleStatus(playerColour, 'down')
		}
	}
}

function moveEnemy() {
	enemyElem = session.enemySide;
	enemyColour = session.enemySide.colour;
	if (enemyMovingUp) {
		enemyNotMoving = false;
		enemyElem.y -= enemyElem.speed;
	} else if (enemyMovingDown) {
		enemyNotMoving = false;
		enemyElem.y += enemyElem.speed;
	}
}

receivePaddleLocation();
receivePaddleStatus();

function sendPaddleLocation(paddleColour, y) {
	socket.emit(paddleColour + ' location', y);
}

function receivePaddleLocation() {
	socket.on('green location', function(y) {
		console.log('green location: ' + y);
		paddlePlayer.y = y;
	});
	socket.on('blue location', function(y) {
		console.log('blue location: ' + y);
		paddleEnemy.y = y;
	});
}

function sendPaddleStatus(paddleColour, status) {
	socket.emit(paddleColour + ' move status', status);
}

function receivePaddleStatus() {
	socket.on('green move status', function(status) {
		console.log('green move status: ' + status);
		if (status === 'up') {
			enemyMovingDown = false;
			enemyMovingUp = true;
		}
		else if (status === 'down') {
			enemyMovingUp = false;
			enemyMovingDown = true;
		}
		else if (status === 'none') {
			enemyMovingUp = false;
			enemyMovingDown = false;
		}
	});
	socket.on('blue move status', function(status) {
		console.log('blue move status: ' + status);
		if (status === 'up') {
			enemyMovingDown = false;
			enemyMovingUp = true;
		}
		else if (status === 'down') {
			enemyMovingUp = false;
			enemyMovingDown = true;
		}
		else if (status === 'none') {
			enemyMovingUp = false;
			enemyMovingDown = false;
		}
	});
}

function containPaddles() {
	// top
	paddlePlayer.y = Math.max(0, paddlePlayer.y);
	// bottom
	paddlePlayer.y = Math.min(gameHeight - paddlePlayer.height, paddlePlayer.y);

	paddleEnemy.y = Math.max(0, paddleEnemy.y);
	paddleEnemy.y = Math.min(gameHeight - paddleEnemy.height, paddleEnemy.y);
}

function checkWinState() {
	if (scorePlayer.value === scoreMax) {
		console.log('Player win');
		playPlayerWinSound();
		cancelAnimationFrame(loopReq);
		chargeSpike();
		stopBall();
		
		document.querySelector('.results-title').innerHTML = "You win!";
		document.querySelector('.results-title').style.color = "#33FF55";
		document.querySelector('.results-player').innerHTML = scorePlayer.value;
		document.querySelector('.results-enemy').innerHTML = scoreEnemy.value;
		
		showResults();
	} else if (scoreEnemy.value === scoreMax) {
		console.log('Enemy win');
		playEnemyWinSound();
		cancelAnimationFrame(loopReq);
		chargeSpike();
		stopBall();
		
		document.querySelector('.results-title').innerHTML = "You lose";
		document.querySelector('.results-title').style.color = "#33BBFF";
		document.querySelector('.results-player').innerHTML = scorePlayer.value;
		document.querySelector('.results-enemy').innerHTML = scoreEnemy.value;
		
		showResults();
	}
}

function showResults() {
	document.querySelector('.results').style.visibility = 'visible';
	animateCSS('.results', 'zoomIn', function() {
		document.querySelector('.results').classList.add('delay-1s');
		animateCSS('.results', 'zoomOut', function() {
			document.querySelector('.results').style.visibility = 'hidden';
			resetGame();
		});
	});
}

function resetGame() {
	ballSpeed = ballSpeedStart;
	scorePlayer.value = 0;
	scoreEnemy.value = 0;
	init();
}

var gameStarted = false;
var musicStarted = false;

function init() {
	document.querySelector('.menu').style.visibility = 'visible';
	animateCSS('.menu', 'bounceIn', function() {});
	if (!musicStarted) {
		musicStarted = true;
		playMusic();
	}
	gameStarted = false;
	render();
	preGameParticles();
	window.addEventListener('keydown', function(keycode) {
		if ((keycode.code === 'ArrowUp' || keycode.code === 'KeyW' ||
			keycode.code === 'ArrowDown' || keycode.code === 'KeyS') && !gameStarted) {
			matchmaking();
		}
	});
}

var preGameReq;

function preGameParticles() {
	ballParticles.spawn(Math.floor(Math.random() * gameWidth), Math.floor(Math.random() * gameHeight));
	preGameReq = requestAnimationFrame(preGameParticles);
}

function matchmaking() {
	console.log("matchmaking");
	animateCSS('.menu', 'bounceOut', function() {
		document.querySelector('.menu').style.visibility = 'hidden';
		document.querySelector('.multiplayer').style.visibility = 'visible';
		animateCSS('.multiplayer', 'bounceIn');
	});
}

function start() {
	console.log("start");
	gameStarted = true;
	cancelAnimationFrame(preGameReq);
	animateCSS('.menu', 'bounceOut', function() {
		document.querySelector('.menu').style.visibility = 'hidden';
		lowerVolMusic();
		addEventListeners();
		startBall();
		loop();
	});
}

var loopReq;

function loop() {
	loopReq = requestAnimationFrame(loop);
	update();
	render();
}

function update() {
	// console.log("update");
	moveBall();
	rotateBall();
	// rotateScreen();
	movePlayer();
	chargeSpike();
	paddleSpike();
	moveEnemy();
	updatePaddlePOV();
	containBall();
	containPaddles();
	checkCollisions();
	checkWinState();
}

function render() {
	paddlePlayer.elem.style.transform =
		'translate3d(' + paddlePlayer.x + 'px, ' + paddlePlayer.y + 'px, 1px)';

	paddleEnemy.elem.style.transform =
		'translate3d(' + paddleEnemy.x + 'px, ' + paddleEnemy.y + 'px, 1px)';

	ball.elem.style.transform =
		'translate3d(' + ball.x + 'px, ' + ball.y + 'px, 2px) rotateZ(' + ball.r + 'deg)';

	screen.elem.style.transform =
		'scale(1) rotateX(' + screen.rx + 'deg) rotateY(' + screen.ry + 'deg)';

	scorePlayer.elem.innerHTML = scorePlayer.value;
	scoreEnemy.elem.innerHTML = scoreEnemy.value;
}

init();
checkBtnStatus();
checkGameStatus();