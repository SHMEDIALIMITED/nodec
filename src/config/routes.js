var passport = require('passport');
var authenticate = require('../app/controllers/middleware/authenticate');

module.exports = function (app, config) { 

	var pages = require('../app/controllers/pages')(config);
    var authentications = require('../app/controllers/authentications')(config);
    var webhook = require('../app/controllers/webhook')(app,config);

	// Web App
	app.get('/', pages.index);

    // Authentication
    app.get('/login' , pages.login);

    app.post('/api/authentications' , authentications.create);
    app.del('/api/authentications' , authenticate,  authentications.del);

    // Web Hook
    app.get('/webhook/:secret',  webhook.post)


}