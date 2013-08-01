var passport = require('passport');

module.exports = function (app, config) { 

	var pages = require('../app/controllers/pages')(config);
    var authentications = require('../app/controllers/authentications')(config);
    var webhook = require('../app/controllers/webhook')(app,config);

	// Web App
	app.get('/' , passport.authenticate('bearer', { session: false }), pages.index);

    // Authentication
    app.get('/login' , pages.login);

    app.post('/api/authentications' , authentications.create);
    app.del('/api/authentications' , passport.authenticate('bearer', { session: false }),  authentications.delete);

    // Web Hook
    app.get('/webhook/:secret',  webhook.post)


}