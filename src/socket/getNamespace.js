/**
 * Returns path with sitepath prefix removed
 * @param {string} path window.location.pathname
 * @param {string} [root] root pathname, defaults to '/'
 * @returns {string}
 */
function getSubfolder(path, root = '/') {
	const sitepath = root.split('/');
	const parts = path.split('/');

	const test = parts.every((folder, i) => (sitepath[i]
		? sitepath[i] === folder
		: true));

	if (!test) {
		throw new Error(`${path} does not start with ${sitepath.join('/')}`);
	}

	return parts.filter((f, i) => !sitepath[i]).join('/');
}

/**
 * Gets the namespace string from the URL.
 * For example, 'game.com/snefsd/player' => 'snefsd'
 * @param {string} [root]
 * @returns {string}
 */
export default function getNamespace(pathname = window.location.pathname, root) {
	const subfolder = getSubfolder(pathname, root);

	const [namespace] = subfolder.split('/', 1);
	if (!namespace) throw new Error(`${pathname} is at root`);
	return `/${namespace}`;
}
