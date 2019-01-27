var express = require('express');
var app = express();

var http = require('http').Server(app);
var io = require('socket.io')(http);

const port=process.env.PORT || 3000

http.listen(port, function() {
	console.log('listening on *:' + port);
});

app.use('/css', express.static(__dirname + '/css'));
app.use('/js', express.static(__dirname + '/js'));
app.use('/snd', express.static(__dirname + '/snd'));

app.get('/', function(req, res) {
	res.sendFile(__dirname + '/index.html');
});

var numPlayers = 0;
var greenChosen = false;
var blueChosen = false;

io.on('connection', function(socket) {
	console.log('a user connected');
	socket.on('disconnect', function(){
		console.log('socket colour: ' + socket.colour);
		if (socket.colour === 'green') {
			greenChosen = false;
			numPlayers--;
			console.log('removing green...');
		} else if (socket.colour === 'blue') {
			blueChosen = false;
			numPlayers--;
			console.log('removing blue...');
		}
		console.log('numPlayers: ' + numPlayers);
		console.log('user disconnected');
	});

	socket.on('choose paddle', function(colour) {
		if (socket.colour == null) {
				numPlayers++;
				console.log('new player!');
		}
		console.log('colour: ' + colour);
		if (colour === 'green') {
			socket.colour = colour;
			console.log('socket colour: ' + socket.colour);
			console.log('numPlayers: ' + numPlayers);
			greenChosen = true;
			socket.broadcast.emit('choose paddle', 'green');
		} else if (colour === 'blue') {
			socket.colour = colour;
			console.log('socket colour: ' + socket.colour);
			console.log('numPlayers: ' + numPlayers);
			blueChosen = true;
			socket.broadcast.emit('choose paddle', 'blue');
		}
		if (numPlayers === 2) {
			console.log('game ready!')
			io.emit('game status', 'ready');
			io.emit('rand ball angle', getRandomArbitrary(-50, 50));
		}
	});

	socket.on('new ball ang', function() {
		console.log('new ball angle');
		io.emit('rand ball angle', getRandomArbitrary(-50, 50));
	});

	socket.on('green move status', function(status) {
		console.log('green status: ' + status);
		socket.broadcast.emit('green location', status);
	});

	socket.on('blue move status', function(status) {
		console.log('blue status: ' + status);
		socket.broadcast.emit('blue move status', status);
	});

	socket.on('green location', function(y) {
		console.log('green location: ' + y);
		socket.broadcast.emit('green location', y);
	});

	socket.on('blue location', function(y) {
		console.log('blue location: ' + y);
		socket.broadcast.emit('blue location', y);
	});
});

function getRandomArbitrary(min, max) {
	return Math.random() * (max - min) + min;
}