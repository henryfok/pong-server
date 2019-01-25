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
				console.log('new player!: ' + numPlayers);
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
		}
	});
});