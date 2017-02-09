/**
 * Function to observe redux store and activate callback when
 * changes are detected.
 * @param {Redux.Store} store
 * @param {function} selector state => T
 * @param {function} onChange T => void, called when selected state changes.
 */
export default function observeStore(store, selector, onChange) {
	let currentState;

	function handleChange() {
		const nextState = selector(store.getState());
		if (nextState !== currentState) {
			currentState = nextState;
			onChange(currentState);
		}
	}

	const unsubscribe = store.subscribe(handleChange);
	handleChange();
	return unsubscribe;
}
