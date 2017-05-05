import * as io from 'socket.io-client';
import { parsed } from 'document-promises';
import { getNamespace, getServerURL } from './socket/';
import createClientStore from './store/client';
import createUIListeners from './ui/';

async function main() {
	const socket = io(`${getServerURL()}${getNamespace()}`);
	const store = createClientStore(socket);

	await parsed;
	createUIListeners(socket, store);
}

main();

