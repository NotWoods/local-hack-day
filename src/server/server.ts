import * as express from 'express';
import * as socket from 'socket.io';

export const app = express();

export const server = app.listen(8082, () =>
	console.log(`Server running at port ${server.address().port}`)
);

export const io = socket(server);
