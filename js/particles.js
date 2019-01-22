// ----------------------------------------
// Particle Constructor
// ----------------------------------------

function Particle( x, y, radius ) {
	this.init( x, y, radius );
}

Particle.prototype = {

	init: function( x, y, radius ) {

		this.alive = true;

		this.radius = radius || 10;
		this.wander = 0.15;
		this.theta = random( TWO_PI );
		this.drag = 0.92;
		this.color = '#fff';

		this.x = x || 0.0;
		this.y = y || 0.0;

		this.vx = 0.0;
		this.vy = 0.0;
	},

	move: function() {

		this.x += this.vx;
		this.y += this.vy;

		this.vx *= this.drag;
		this.vy *= this.drag;

		this.theta += random( -0.5, 0.5 ) * this.wander;
		this.vx += sin( this.theta ) * 0.1;
		this.vy += cos( this.theta ) * 0.1;

		this.radius *= 0.96;
		this.alive = this.radius > 0.5;
	},

	draw: function( ctx ) {

		ctx.beginPath();
		ctx.arc( this.x, this.y, this.radius, 0, TWO_PI );
		ctx.fillStyle = this.color;
		ctx.fill();
	}
};

// ----------------------------------------
// Config
// ----------------------------------------

var MAX_PARTICLES = 200;
// var RAND_COLOURS = [ '#69D2E7', '#A7DBD8', '#E0E4CC', '#F38630', '#FA6900', '#FF4E50', '#F9D423' ];
var COLOURS = [ '#33FF55', '#33BBFF', '#FF333F' ];
var GREEN_PADDLE_COLOUR = [ '#33FF55', '#FFF' ];

var particles = [];
var pool = [];

// ballParticles.setup = function() {
// 	// Set off some initial particles.
// 	var i, x, y;
// 	for ( i = 0; i < 20; i++ ) {
// 		x = ( ballParticles.width * 0.5 ) + random( -100, 100 );
// 		y = ( ballParticles.height * 0.5 ) + random( -100, 100 );
// 		ballParticles.spawn( x, y );
// 	}
// };

var ballParticles = Sketch.create({
	fullscreen: false,
	width: 1280,
	height: 720,
	container: document.querySelector('.pong'),
	retina: 'auto'
});

ballParticles.spawn = function( x, y ) {
	var particle, theta, force;
	if ( particles.length >= MAX_PARTICLES ) {
		pool.push( particles.shift() );
	}

	particle = pool.length ? pool.pop() : new Particle();
	particle.init( x, y, random( 5, 20 ) );

	particle.wander = random( 0.5, 2.0 );
	particle.color = random( COLOURS );
	particle.drag = random( 0.9, 0.99 );

	theta = random( TWO_PI / 2 );
	// particle min/max move speed
	force = random( 2, 8 );

	particle.vx = sin( theta ) * force;
	particle.vy = cos( theta ) * force;

	particles.push( particle );
};

// var chargeParticles = Sketch.create({
// 	fullscreen: false,
// 	width: 1280,
// 	height: 720,
// 	container: document.body,
// 	retina: 'auto'
// });

// chargeParticles.spawn = function( x, y ) {
// 	var particle, theta, force;
// 	if ( particles.length >= MAX_PARTICLES ) {
// 		pool.push( particles.shift() );
// 	}

// 	particle = pool.length ? pool.pop() : new Particle();
// 	particle.init( x, y, random( 5, 20 ) );

// 	particle.wander = random( 0.5, 2.0 );
// 	particle.color = random( GREEN_PADDLE_COLOUR );
// 	particle.drag = random( 0.9, 0.99 );

// 	theta = random( (3 * Math.PI) / 2 );
// 	// particle min/max move speed
// 	force = random( 2, 8 );

// 	particle.vx = sin( theta ) * force;
// 	particle.vy = cos( theta ) * force;

// 	particles.push( particle );
// };

// removes particles
ballParticles.update = function() {
	var i, particle;
	for ( i = particles.length - 1; i >= 0; i-- ) {
		particle = particles[i];
		if ( particle.alive ) particle.move();
		else pool.push( particles.splice( i, 1 )[0] );
	}
};

// draws particles
ballParticles.draw = function() {
	ballParticles.globalCompositeOperation  = 'lighter';
	for ( var i = particles.length - 1; i >= 0; i-- ) {
		particles[i].draw( ballParticles );
	}
};

// ballParticles.mousemove = function() {
// 	var particle, theta, force, touch, max, i, j, n;
// 	for ( i = 0, n = ballParticles.touches.length; i < n; i++ ) {
// 		touch = ballParticles.touches[i], max = random( 1, 4 );
// 		for ( j = 0; j < max; j++ ) {
// 			ballParticles.spawn( touch.x, touch.y );
// 		}
// 	}
// };