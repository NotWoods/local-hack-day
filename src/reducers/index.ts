import { GlobalState } from './global';
import { PlayerState } from './player';
import { SpectatorState } from './spectator';

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

export { default as global, GlobalState } from './global';
export { default as player, PlayerState } from './player';
export { default as spectator, SpectatorState } from './spectator';


