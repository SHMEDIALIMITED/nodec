var passport = require('passport');

module.exports = function (app, config) { 

	var pages = require('../app/controllers/pages')(config);
    var authorisation = require('../app/controllers/authorisation')(config);
    var webhook = require('../app/controllers/webhook')(app,config);

	// Web App
	app.get('/' , passport.authenticate('bearer', { session: false }), pages.index);

    // Authentication
    app.get('/login' , pages.login);
    app.post('/login' , authorisation.create);
    app.post('/logout' , authorisation.del);

    // Web Hook
    app.get('/webhook/:secret', webhook.post)


}