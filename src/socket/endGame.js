import { GAME_OVER } from '../messages.js';
import { currentLead } from '../selectors.js';

export default function endGame(emit, getState) {
	emit({
		type: GAME_OVER,
		payload: { winner: currentLead(getState()) }
	});
}
