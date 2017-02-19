const denodeify = require('denodeify');
const glob = denodeify(require('glob'));
const runTest = require('./runTest.js');

function testAll(dir) {
	return glob(`${dir}/**`, { nodir: true })
		.then(filenames => Promise.all(filenames.map(runTest)));
}

if (require.main === module) {
	const [,, dir] = process.argv;
	testAll(dir || './tests').catch(console.error.bind(console));
} else {
	module.exports = runTest;
}
