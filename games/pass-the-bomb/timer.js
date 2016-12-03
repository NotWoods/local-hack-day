// https://jakearchibald.com/2013/animated-line-drawing-svg/

/**
 * @param {number} time (usings seconds as units)
 * @param {string} [fuseID] ID of the fuse element
 * @param {boolean} nolistener if true, doesn't listen for animation end.
 * @returns {Promise<void>} resolves when animation ends.
 * If nolistener is set, resolves immediately.
 */
function animateFuse(time, fuseID = 'fuse', nolistener = false) {
	const path = document.getElementById(fuseID);
	const length = path.getTotalLength();
	path.style.transition = 'none';

	path.style.strokeDasharray = `${length}`;
	path.style.strokeDashoffset = 0;

	path.getBoundingClientRect();
	path.style.transition = `stroke-dashoffset ${time}s linear`;
	path.style.strokeDashoffset = length;

	if (nolistener) return Promise.resolve();
	return new Promise(resolve =>
		path.addEventListener('transitionend', resolve, { once: true })
	);
}
