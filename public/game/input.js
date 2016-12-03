const { Manager, Swipe, DIRECTION_ALL } = Hammer; // import Hammer;
var bombMovable = false

class Game {
	constructor(inputId = 'wordInput', textId = 'letterSet', fuseId = 'fuse', bombId = 'bomb') {
		this.value = '';

		const input = document.getElementById(inputId);
		input.addEventListener('change', (e) => {
			var value = e.target.value;
			fetch('/checkword/' + value).then(function () {
				bombMovable = true
			}, function () {
				bombMovable = false
			})
		})

		this.text = document.getElementById(textId);
		this.fuse = document.getElementById(fuseId);

		const bomb = document.getElementById(bombId);
		const mc = new Manager(bomb);
		mc.add(new Swipe({ direction: DIRECTION_ALL }));

		mc.on('swipe', (e) => {

		});
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
