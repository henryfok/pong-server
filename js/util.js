function scale(num, in_min, in_max, out_min, out_max) {
	return (num - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
}

function degToRad(deg) {
	return deg * (Math.PI / 180);
}

function getRandomArbitrary(min, max) {
	return Math.random() * (max - min) + min;
}

function flashElement(wallEl) {
	document.querySelector(wallEl).style.transitionTimingFunction = "cubic-bezier(0.25, 1, 0.25, 1)";
	document.querySelector(wallEl).style.transitionDuration = "0.1s"
	document.querySelector(wallEl).style.opacity = 1;
	setTimeout(function() {
		document.querySelector(wallEl).style.transitionTimingFunction = "linear";
		document.querySelector(wallEl).style.transitionDuration = "0.5s"
		document.querySelector(wallEl).style.opacity = 0;
	}, 100);
}

function animateCSS(element, animationName, callback) {
	const node = document.querySelector(element)
	node.classList.add('animated', animationName)

	function handleAnimationEnd() {
		node.classList.remove('animated', animationName)
		node.removeEventListener('animationend', handleAnimationEnd)

		if (typeof callback === 'function') callback()
	}

	node.addEventListener('animationend', handleAnimationEnd)
}