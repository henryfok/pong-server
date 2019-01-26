// ball size and move speed
var ballWidth = 30;
var ballHeight = 30;
var ballSpeedStart = 15;
var ballSpeed = ballSpeedStart;
// var ballTragSpeed = Math.sqrt(2 * (ballSpeed * ballSpeed));
var ballRotateSpeed = 3;
var randAng = -50;

var ball = {
	// starting ball position and speed
	// vx : horizontal velocity
	// vy : vertical velocity
	elem: document.querySelector('.ball'),
	x: gameWidth / 2 - ballWidth / 2,
	y: gameHeight / 2 - ballHeight / 2,
	vx: ballSpeed,
	vy: ballSpeed,
	r: 0,
	vr: ballRotateSpeed,
	width: ballWidth,
	height: ballHeight
};

socket.on('rand ball angle', function(deg) {
	randAng = deg;
	console.log('randAng: ' + randAng);
});

function randBallStart() {
	socket.emit('new ball ang');
	console.log('Start angle: ' + randAng);
	ballSpeed = ballSpeedStart;
	ball.vx = Math.cos(degToRad(randAng)) * ballSpeed;
	ball.vy = -(Math.sin(degToRad(randAng)) * ballSpeed);
}

function startBall() {
	ball.x = gameWidth / 2 - ballWidth / 2;
	ball.y = gameHeight / 2 - ballHeight / 2;
	ball.vx = 0;
	ball.vy = 0;
	// ball.vx = ballSpeed;
	// ball.vy = ballSpeed;
	randBallStart();
}

function moveBall() {
	// move ball location diagonally
	ballParticles.spawn(ball.x + ball.width/2, ball.y + ball.height/2);
	ball.x += ball.vx;
	ball.y += ball.vy;
}

function rotateBall() {
	ball.r += ball.vr;
}

function containBall() {
	if (ball.y <= 0) {
		// top wall of the ball hit the top border, reverse vertical velocity (down)
		ball.y = 0;
		ball.vy = -ball.vy;
		playWallHitSound();
		flashElement('.wall-top');
	} else if (ball.y + ball.height >= gameHeight) {
		// bottom wall of the ball hit the bottom border, reverse vertical velocity (up)
		ball.y = gameHeight - ball.height;
		ball.vy = -ball.vy;
		playWallHitSound();
		flashElement('.wall-bottom');
	}

	if (ball.x <= 0) {
		// left wall of the ball hit the left border, reverse horizontal velocity (right)
		scoreAddOne(scoreEnemy);
		flashElement('.wall-left');
		// ball.ballSpeed += 1;
		if (scoreEnemy.value !== scoreMax) {
			playEnemyScoreSound();
			dischargeSpike();
			resetBall();
		}
		// ball.x = 0;
		// ball.vx = -ball.vx;
	} else if (ball.x + ball.width >= gameWidth) {
		// right wall of the ball hit the right border, reverse horizontal velocity (left)
		scoreAddOne(scorePlayer);
		flashElement('.wall-right');
		// ball.ballSpeed += 1;
		if (scorePlayer.value !== scoreMax) {
			playPlayerScoreSound();
			dischargeSpike();
			resetBall();
		}
		// ball.x = gameWidth - ball.width;
		// ball.vx = -ball.vx;
	}
}

function checkCollisions() {
	if (aabbCollisionDetect(ball, paddlePlayer)) {
		paddlePlayer.hasHit = true;
		paddleEnemy.hasHit = false;

		if (paddlePlayer.spike === true) {
			playPaddleSpikeSound();
			paddlePlayer.spike = false;
			ballSpeed *= 2;
			ball.x = paddlePlayer.x + paddlePlayer.width + 100;
		} else {
			playPaddleHitSound();
			ball.x = paddlePlayer.x + paddlePlayer.width + 0.5;
			flashPaddle('.paddle-player');
		}
		
		// extend paddle length by 20% before map as player rarely hits the ball on the paddle edge
		
		var playerAngle = scale(ball.y, (paddlePlayer.y - paddleHeight*0.2), (paddlePlayer.y + paddleHeight + paddleHeight*0.2), 50, -50);
		console.log('Player Angle: ' + playerAngle);
		if (Math.sign(playerAngle) === 1) {
			ball.vx = Math.cos(degToRad(playerAngle)) * ballSpeed;
			ball.vy = -(Math.sin(degToRad(playerAngle)) * ballSpeed);
		}
		else if (Math.sign(playerAngle) === -1) {
			ball.vx = Math.cos(degToRad(playerAngle)) * ballSpeed;
			ball.vy = -(Math.sin(degToRad(playerAngle)) * ballSpeed);
		} else {
			ball.vx = ballSpeed;
			ball.vy = 0;
		}
	}

	if (aabbCollisionDetect(ball, paddleEnemy)) {
		ballSpeed = ballSpeedStart;
		paddlePlayer.hasHit = false;
		paddleEnemy.hasHit = true;
		ball.x = paddleEnemy.x - ball.width - 0.5;
		// ball.vx = -ball.vx;
		// ball.vr = -ball.vr;
		var enemyAngle = scale(ball.y, (paddleEnemy.y - paddleHeight*0.2), (paddleEnemy.y + paddleHeight + paddleHeight*0.2), 50, -50);
		console.log('Enemy Angle: ' + enemyAngle);
		if (Math.sign(enemyAngle) === 1) {
			ball.vx = -(Math.cos(degToRad(enemyAngle)) * ballSpeed);
			ball.vy = -(Math.sin(degToRad(enemyAngle)) * ballSpeed);
		}
		else if (Math.sign(enemyAngle) === -1) {
			ball.vx = -(Math.cos(degToRad(enemyAngle)) * ballSpeed);
			ball.vy = -(Math.sin(degToRad(enemyAngle)) * ballSpeed);
		} else {
			ball.vx = -ballSpeed;
			ball.vy = 0;
		}
		playPaddleHitSound();
		flashPaddle('.paddle-enemy');
	}
}

function resetBall() {
	paddlePlayer.hasHit = false;
	paddleEnemy.hasHit = false;
	ball.x = gameWidth / 2 - ballWidth / 2;
	ball.y = gameHeight / 2 - ballHeight / 2;
	ball.vx = 0;
	ball.vy = 0;
	ball.r = 0;
	ball.vr = 0;
	setTimeout(function() {
		// ball.vx = ballSpeed;
		// ball.vy = ballSpeed;
		randBallStart();
		ball.vr = ballRotateSpeed;
	}, 1000);
}

function stopBall() {
	paddlePlayer.hasHit = false;
	paddleEnemy.hasHit = false;
	ball.x = gameWidth / 2 - ballWidth / 2;
	ball.y = gameHeight / 2 - ballHeight / 2;
	ball.vx = 0;
	ball.vy = 0;
}