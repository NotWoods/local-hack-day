const { Manager, Swipe, Tap } = Hammer; // import Hammer;

const FUSE_LENGTH = 415;

class Game {
	constructor(
		inputId = 'wordInput',
		textId = 'letterSet',
		fuseId = 'fuse',
		bombId = 'bomb'
	) {
		this.valid = Promise.resolve(false);
		this.letters = '';

		const input = document.getElementById(inputId);
		const text = document.getElementById(textId);
		const fuse = document.getElementById(fuseId);
		fuse.style.strokeDashoffset = 0;

		const bomb = document.getElementById(bombId);
		const mc = new Manager(bomb);
		mc.add(new Swipe({ direction: Hammer.DIRECTION_ALL }));
		mc.add(new Tap());

		Object.assign(this, { input, text, fuse, bomb, mc });

		const onSubmit = (e) => this.valid.then((isValid) => {
			if (!isValid) {
				this.bomb.style.animationName = 'shake';
				return;
			}

			// TODO submit

			let animationName;
			switch (e.direction) {
				case Hammer.DIRECTION_LEFT:
					animationName = 'slideLeft';
					break;
				case Hammer.DIRECTION_RIGHT:
					animationName = 'slideRight';
					break;
				case Hammer.DIRECTION_UP:
					animationName = 'slideUp';
					break;
				case Hammer.DIRECTION_NONE:
				case Hammer.DIRECTION_DOWN:
				default:
					animationName = 'slideDown';
					break;
			}

			this.bomb.style.animationName = animationName;
		});

		mc.on('swipe', onSubmit);
		mc.on('tap', onSubmit);

		input.addEventListener('change', (e) => {
			var value = e.target.value;
			if (!this.containsLetters(value)) {
				this.valid = Promise.resolve(false);
				return;
			}

			this.valid = fetch(`../checkword/${value}`, { method: 'HEAD' })
				.catch(err => ({ ok: false }))
				.then(response => response.ok)
		});
		bomb.addEventListener('animationend',
			() => this.bomb.style.animationName = '');
	}

	setText(newLetters) {
		this.letters = newLetters.toUpperCase();
		this.text.textContent = this.letters;
	}

	clearInput() {
		this.input.reset();
	}

	setFuse(percent) {
		this.fuse.style.strokeDashoffset = percent * this.fuseLength;
	}

	containsLetters(value) {
		return value.toUpperCase().includes(this.letters);
	}
}

new Game().setText('ke');
