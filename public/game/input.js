const { Manager, Swipe, DIRECTION_ALL } = Hammer; // import Hammer;

class Game {
	constructor(inputId = 'wordInput', textId = 'letterSet', fuseId = 'fuse', bombId = 'bomb') {
		this.value = '';

		const input = document.getElementById(inputId);
		input.addEventListener('change', (e) => {
			var value = e.target.value;
			this.valid = fetch(`../checkword/{value}`, { method: HEAD })
				.then(response => response.ok);
		});

		this.text = document.getElementById(textId);
		this.fuse = document.getElementById(fuseId);

		const bomb = document.getElementById(bombId);
		const mc = new Manager(bomb);
		mc.add(new Swipe({ direction: DIRECTION_ALL }));

		mc.on('swipe', (e) => this.valid.then(() => {

		}));
	}

	setText(newLetters) {
		this.text.textContent = newLetters;

	}

	clearInput() {
		this.input.reset();
	}

	setFuse(percent) {

	}
}
