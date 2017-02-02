export default function observeState(selector, callback) {
	let last;
	return (state) => {
		const next = selector(state);
		if (next !== last) {
			callback(next);
			last = next;
		}
	}
}
