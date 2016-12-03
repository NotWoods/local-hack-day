// https://jakearchibald.com/2013/animated-line-drawing-svg/

/**
 * @param {number} time (usings seconds as units)
 * @param {string} [fuseID] ID of the fuse element
 */
function animateFuse(time, fuseID = 'fuse') {
	const path = document.getElementById(fuseID);
	const length = path.getTotalLength();

	path.style.strokeDasharray = `${length}`;
	path.style.strokeDashoffset = 0;

	path.getBoundingClientRect();
	path.style.transition = `stroke-dashoffset ${time}s linear`;
	path.style.strokeDashoffset = length;
}
