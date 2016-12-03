exports.publicFiles = {
	method: 'GET',
	path: '/{param*}',
	handler: {
		directory: {
			path: '../public',
			index: true,
		},
	},
}