const defaultServer: string | undefined = process.env.SERVER;

/**
 * Retrieves the server URL from settings. Defaults to process.env.SERVER
 */
export default function getServerURL(): string {
	const url = localStorage.getItem('SERVER');
	if (url) return url;
	else if (defaultServer) return defaultServer;
	else throw new Error('No server specified');
}
