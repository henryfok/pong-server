var scorePlayer = {
	elem: document.querySelector('.score-player'),
	value: 0
};

var scoreEnemy = {
	elem: document.querySelector('.score-enemy'),
	value: 0
};

function scoreAddOne(player) {
	// player.value += 1;
	socket.emit('update score', player);
}

function sendScore() {
	var score = {
		player: scorePlayer.value,
		enemy: scoreEnemy.value
	}
	socket.emit('update score', score);
}

socket.on('update score', function(score) {
	console.log('update score: ' + score.green + ' - ' + score.blue);
	scorePlayer.value = score.green;
	scoreEnemy.value = score.blue;
	scorePlayer.elem.innerHTML = scorePlayer.value;
	scoreEnemy.elem.innerHTML = scoreEnemy.value;
});