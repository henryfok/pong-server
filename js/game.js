var scoreMax = 3;

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
	window.addEventListener('keydown', function(keycode) {
		keyPressed[keycode.keyCode] = true;
		if (keyPressed[38]) {
			paddlePlayer.moveUp = true;
		}
		if (keyPressed[40]) {
			paddlePlayer.moveDown = true;
		}
		if (keyPressed[32]) {
			paddlePlayer.charging = true;
		}
		if (keyPressed[38] && keyPressed[32]) {
			paddlePlayer.moveUp = true;
			paddlePlayer.charging = true;
		}
		if (keyPressed[40] && keyPressed[32]) {
			paddlePlayer.moveDown = true;
			paddlePlayer.charging = true;
		}
	});

	window.addEventListener('keyup', function(keycode) {
		keyPressed[keycode.keyCode] = false;
		if (!keyPressed[38]) {
			paddlePlayer.moveUp = false;
		}
		if (!keyPressed[40]) {
			paddlePlayer.moveDown = false;
		}
		if (!keyPressed[32]) {
			paddlePlayer.charging = false;
		}
		if (keyPressed[32]) {
			paddlePlayer.charging = true;
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

function movePlayer() {
	if (paddlePlayer.moveUp) {
		paddlePlayer.y -= paddlePlayer.speed;
	} else if (paddlePlayer.moveDown) {
		paddlePlayer.y += paddlePlayer.speed;
	}
}

function moveEnemy() {
	if ((Math.random() < paddleEnemy.difficulty) && !paddleEnemy.hasHit) {
		paddleEnemy.moveUp = false;
		paddleEnemy.moveDown = false;
		if (ball.y + ballHeight < paddleEnemy.y + paddleEnemy.height / 2) {
			paddleEnemy.moveUp = true;
		} else if (ball.y > paddleEnemy.y + paddleEnemy.height / 2) {
			paddleEnemy.moveDown = true;
		}
		
		if (paddleEnemy.moveUp) {
			paddleEnemy.y -= paddleEnemy.speed;
		} else if (paddleEnemy.moveDown) {
			paddleEnemy.y += paddleEnemy.speed;
		}
	}
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