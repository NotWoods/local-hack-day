class WordInput {
	constructor(id = 'wordInput') {
		this.value = '';

		const input = document.getElementById('wordInput');
		input.addEventListener('change', (e) => {
			this.value = e.target.value;
			// TODO
		});
	}
}
