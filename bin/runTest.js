const { rollup } = require('rollup');
const requireFromString = require('require-from-string');
const pkg = require('../package.json');

function runTest(filename) {
	return rollup({
		entry: filename,
		external: [
			...Object.keys(pkg.dependencies),
			...Object.keys(pkg.devDependencies),
		],
		onwarn: console.warn.bind(console),
	})
	.then(bundle => bundle.generate({ format: 'cjs' }).code)
	.then(code => requireFromString(code, filename));
}

if (require.main === module) {
	const [,, filename] = process.argv;
	runTest(filename).catch(console.error.bind(console));
} else {
	module.exports = runTest;
}
