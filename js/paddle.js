// window size
var gameWidth = 1280;
var gameHeight = 720;

// paddle size and move speed
var paddleWidth = 30;
var paddleHeight = 120;
var paddleSpeed = 16;

var paddlePlayer = {
	// default player1 paddle position data
	elem: document.querySelector('.paddle-player'),
	x: 0,
	y: gameHeight / 2 - paddleHeight / 2,
	width: paddleWidth,
	height: paddleHeight,
	speed: paddleSpeed,
	moveUp: false,
	moveDown: false,
	hasHit: false,
	spike: false,
	charging: false,
	spikeCharge: 0,
	spikeSpeed: 25
};

var paddleEnemy = {
	// default player2 paddle position data
	elem: document.querySelector('.paddle-enemy'),
	x: gameWidth - paddleWidth,
	y: gameHeight / 2 - paddleHeight / 2,
	width: paddleWidth,
	height: paddleHeight,
	speed: paddleSpeed,
	moveUp: false,
	moveDown: false,
	difficulty: 1,
	hasHit: false
};

function flashPaddle(paddleEl) {
	var colour = document.querySelector(paddleEl).style.background;
	// document.querySelector(paddleEl).style.transitionTimingFunction = "cubic-bezier(0.25, 1, 0.25, 1)";
	// document.querySelector(paddleEl).style.transitionDuration = "0.1s"
	document.querySelector(paddleEl).style.background = '#FFF';
	setTimeout(function() {
		// document.querySelector(paddleEl).style.transitionTimingFunction = "linear";
		// document.querySelector(paddleEl).style.transitionDuration = "0.5s"
		document.querySelector(paddleEl).style.background = colour;
	}, 100);
}

function updatePaddlePOV() {
	var newPlayerPOV = scale(paddlePlayer.y, 0, (gameHeight - paddleHeight), -20, 120);
	var newEnemyPOV = scale(paddleEnemy.y, 0, (gameHeight - paddleHeight), -20, 120);
	paddlePlayer.elem.style.perspectiveOrigin = '200% ' + newPlayerPOV + '%';
	paddleEnemy.elem.style.perspectiveOrigin = '-100% ' + newEnemyPOV + '%';

}

function dischargeSpike() {
	paddlePlayer.spikeCharge = 0;
	document.querySelector('.spike-charge').style.transform = 'scaleX(' + paddlePlayer.spikeCharge + ')';
}

function paddleSpike() {
	if (paddlePlayer.charging === false && paddlePlayer.spikeCharge > 0.8 && paddlePlayer.x < 100) {
		paddlePlayer.x += 20;
		if (paddlePlayer.spikeCharge > 0.8) {
			paddlePlayer.spike = true;
		}
	} else if (paddlePlayer.x > 0) {
		paddlePlayer.x -= 25;
		if (paddlePlayer.x < 50) {
			document.querySelector('.paddle-player').style.background = '#33FF55';
			paddlePlayer.spike = false;
		}
	}
}