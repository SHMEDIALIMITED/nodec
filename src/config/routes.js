var passport = require('passport');

module.exports = function (app, config) { 

	var pages = require('../app/controllers/pages')(config);
    var authorisation = require('../app/controllers/authorisation')(config);
    var webhook = require('../app/controllers/webhook')(app,config);

	// Web App
	app.get('/' , passport.authenticate('bearer', { session: false }), pages.index);

    // Authentication
    app.get('/login' , pages.login);

    app.post('/api/authorization' , authorisation.create);
    app.delete('/api/authorization' , passport.authenticate('bearer', { session: false }),  authorisation.delete);

    // Web Hook
    app.get('/webhook/:secret',  webhook.post)


}