var passport = require('passport');
var authenticate = require('../app/controllers/middleware/authenticate');

module.exports = function (app, config) { 

	var pages = require('../app/controllers/pages')(config);
    var authentications = require('../app/controllers/authentications')(config);
    var users = require('../app/controllers/users')(config);
    var projects = require('../app/controllers/projects')(config);
    var pipes = require('../app/controllers/pipes')(config, projects);
    var webhook = require('../app/controllers/webhook')(app,config);

	// Web App
	app.get('/', pages.index);

    // Authentication
    app.get('/login' , pages.login);

    app.post('/api/authentications' , authentications.create);
    app.del('/api/authentications' , authenticate,  authentications.del);


    // Users
    app.post('/api/users', authenticate, users.create);
    app.get('/api/users', authenticate, users.retrieve);
    app.get('/api/users/:id', authenticate, users.retrieve);
    app.put('/api/users/:id', authenticate, users.update);
    app.del('/api/users/:id', authenticate, users.del);


    // Pipes
    app.post('/api/projects/:project/pipes', authenticate, pipes.create);
    app.get('/api/projects/:project/pipes', authenticate, pipes.retrieve);
    app.get('/api/projects/:project/pipes/:pipe', authenticate, pipes.retrieve);
    app.put('/api/projects/:project/pipes/:pipe', authenticate, pipes.update);
    app.del('/api/projects/:project/pipes/:pipe', authenticate, pipes.del);

    // Projects
    app.post('/api/projects', authenticate, projects.create);
    app.get('/api/projects', authenticate, projects.retrieve);
    app.get('/api/projects/:project', authenticate, projects.retrieve);
    app.put('/api/projects/:project', authenticate, projects.update);
    app.del('/api/projects/:project', authenticate, projects.del);





    // Web Hook
    app.get('/webhook/:secret',  webhook.post)


}