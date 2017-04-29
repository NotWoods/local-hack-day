import io from 'socket.io-client';
import { parsed } from 'document-promises';
import { getNamespace, getServerURL } from './socket/index.js';
import createClientStore from './store/client.js';
import createUIListeners from './ui/index.js';

async function main() {
	const socket = io(`${getServerURL()}${getNamespace()}`);
	const store = createClientStore(socket);

	await parsed;
	createUIListeners(store);
}

main();

