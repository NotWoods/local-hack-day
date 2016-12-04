exports.publicFiles = [
	{
		method: 'GET',
		path: '/{param*}',
		handler: {
			directory: {
				path: 'public',
				index: true,
			},
		},
	},
	{
	method: 'GET',
	path: '/',
	handler: {
		file: 'public/index.html',
	},
}
]