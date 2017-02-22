import test from 'blue-tape';
import getNamespace from '../src/socket/getNamespace.js';

test('returns the first subfolder in the path', (t) => {
	t.equal(getNamespace('/abcd'), '/abcd');
	t.equal(getNamespace('/abcd/subpath'), '/abcd');
	t.equal(getNamespace('/ABCD/subpath'), '/ABCD');

	t.end();
});

test('Uses root if provided', (t) => {
	t.equal(getNamespace('/game/abcd', '/game'), '/abcd');
	t.equal(getNamespace('/game/abcd/subpath', '/game'), '/abcd');
	t.equal(getNamespace('/game/ABCD/subpath', '/game'), '/ABCD');

	t.end();
});

test('Uses window.location.pathname by default', (t) => {
	global.window = { location: { pathname: '' } };
	const setPathname = name => global.window.location.pathname = name;

	setPathname('/abcd');
	t.equal(getNamespace(), '/abcd');
	setPathname('/abcd/subpath');
	t.equal(getNamespace(), '/abcd');
	setPathname('/ABCD/subpath');
	t.equal(getNamespace(), '/ABCD');

	t.end();
});
