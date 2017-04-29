import { GlobalState } from './global.js';
import { PlayerState } from './player.js';
import { SpectatorState } from './spectator.js';

export interface State {
	global: GlobalState
}

export interface ClientState {
	global: GlobalState,
	player: PlayerState,
}

export interface ServerState {
	global: GlobalState,
	spectator: SpectatorState
}

export { default as global, GlobalState } from './global.js';
export { default as player, PlayerState } from './player.js';
export { default as spectator, SpectatorState } from './spectator.js';


