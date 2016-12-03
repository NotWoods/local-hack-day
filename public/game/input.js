const { Manager, Swipe, DIRECTION_ALL } = Hammer; // import Hammer;

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
		input.addEventListener('change', (e) => {
			var value = e.target.value;
			this.valid = fetch(`../checkword/${value}`, { method: HEAD })
				.then(response => response.ok);
		});

		const text = document.getElementById(textId);
		const fuse = document.getElementById(fuseId);

		const fuseLength = fuse.getTotalLength();
		fuse.style.transition = 'none';
		fuse.style.strokeDasharray = `${fuseLength}`;
		fuse.style.strokeDashoffset = 0;

		const bomb = document.getElementById(bombId);
		const mc = new Manager(bomb);
		mc.add(new Swipe({ direction: DIRECTION_ALL }));

		mc.on('swipe', (e) => this.valid.then(
			() => {
				// TODO submit
			},
			() => {
				// TODO error
			})
		);
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
