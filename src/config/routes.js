

module.exports = function (app, config) { 

	var pages = require('../app/controllers/pages')(config);
    var webhook = require('../app/controllers/webhook')(app,config);

	// Web App
	app.get('/', pages.index);

	// FB Canvas App
	app.post('/', pages.canvas);

    app.get('/webhook/:secret', webhook.post)
}