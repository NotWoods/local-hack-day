const server = require('./src/server.js');
server.start().then(() => console.log(`Server running at ${server.info.uri}`));