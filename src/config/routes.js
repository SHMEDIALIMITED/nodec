

module.exports = function (app, config) { 

	var pages = require('../app/controllers/pages')(config);

	// Web App
	app.get('/', pages.index);

	// FB Canvas App
	app.post('/', pages.canvas);
}