const { Manager, Swipe, DIRECTION_ALL } = Hammer; // import Hammer;

const FUSE_LENGTH = 415;

class Game {
	constructor(
		inputId = 'wordInput',
		textId = 'letterSet',
		fuseId = 'fuse',
		bombId = 'bomb'
	) {
		this.value = '';
		this.valid = Promise.reject();

		const input = document.getElementById(inputId);
		const text = document.getElementById(textId);
		const fuse = document.getElementById(fuseId);
		fuse.style.strokeDashoffset = 0;

		const bomb = document.getElementById(bombId);
		const mc = new Manager(bomb);
		mc.add(new Swipe({ direction: DIRECTION_ALL }));

		Object.assign(this, { input, text, fuse, bomb, mc });

		mc.on('swipe', (e) => this.valid
			.then(() => {
				// TODO submit
			})
			.catch(() => this.bomb.style.animationName = 'shake')
		);
		input.addEventListener('change', (e) => {
			var value = e.target.value;
			this.valid = fetch(`../checkword/${value}`, { method: HEAD })
				.then(response => response.ok);
		});
		bomb.addEventListener('animationEnd',
			() => this.bomb.style.animationName = '');
	}

	setText(newLetters) {
		this.text.textContent = newLetters;

	}

	clearInput() {
		this.input.reset();
	}

	setFuse(percent) {
		this.fuse.style.strokeDashoffset = percent * this.fuseLength;
	}
}
