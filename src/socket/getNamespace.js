const sitepath = (process.env.WEBSITE_PATH || '').split('/');

/**
 * Returns path with sitepath prefix removed
 * @param {string} path
 * @returns {string}
 */
function getSubfolder(path) {
	const parts = path.split('/');

	const test = parts.every((folder, i) => (sitepath[i]
		? sitepath[i] === folder
		: true));

	if (!test) {
		throw new Error(`${path} does not start with ${sitepath.join('/')}`);
	}

	return parts.filter((f, i) => sitepath[i]).join('/');
}

/**
 * Gets the namespace string from the URL.
 * For example, 'game.com/snefsd/player' => 'snefsd'
 * @returns {string}
 */
export default function getNamespace() {
	const currentPath = window.location.pathname;
	const subfolder = getSubfolder(currentPath);

	const [namespace] = subfolder.split('/', 1);
	if (!namespace) throw new Error(`${currentPath} is at root`);
	return namespace;
}
