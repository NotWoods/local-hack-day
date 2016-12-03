class Game {
	constructor(inputId = 'wordInput', textId = 'letterSet', fuseId = 'fuse') {
		this.value = '';

		const input = document.getElementById(inputId);
		input.addEventListener('change', (e) => {
			this.value = e.target.value;
			// TODO
		});

		this.text = document.getElementById(textId);
		this.fuse = document.getElementById(fuseId);
	}

	setText(newLetters) {
		this.text.textContent = newLetters;
	}

	clearInput() {
		this.input.reset();
	}
}
