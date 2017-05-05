import * as ProgressBar from 'progress';
import { Store, Unsubscribe } from 'redux';
import { createSelector } from 'reselect'
import { ServerState } from '../reducers/';
import { observeStore } from '../utils';

const selector = createSelector(
	(state: ServerState) => state.global.letters,
	state => state.global.timeLeft,
	state => state.global.maxTime,
	(letters, timeLeft) => ({ letters, timeLeft }),
);

export default function createLogUpdater(store: Store<ServerState>): Unsubscribe {
	const bar = new ProgressBar(':letters [:bar] :current', {
		complete: ' ',
		incomplete: '=',
		width: 20,
		total: store.getState().global.maxTime,
	});

	return observeStore(store,
		selector,
		({ letters, timeLeft }) => bar.tick(timeLeft, { letters }),
	);
}
