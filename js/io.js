var socket = io();

$('#multiplayer-green').on('click', function(event) {
	event.preventDefault();
	console.log($('#multiplayer-green').text());
	socket.emit('choose paddle', 'green');
	$('#multiplayer-blue').off();
	$('#multiplayer-green').off();
	$('#multiplayer-green').css('color', '#808080');
});

$('#multiplayer-blue').on('click', function(event) {
	event.preventDefault();
	console.log($('#multiplayer-blue').text());
	socket.emit('choose paddle', 'blue');
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

checkBtnStatus();
checkGameStatus();