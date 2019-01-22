var scorePlayer = {
	elem: document.querySelector('.score-player'),
	value: 0
};

var scoreEnemy = {
	elem: document.querySelector('.score-enemy'),
	value: 0
};

function scoreAddOne(player) {
	player.value += 1;
}