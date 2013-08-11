/**
 * Created with JetBrains WebStorm.
 * User: admin
 * Date: 06/08/2013
 * Time: 22:01
 * To change this template use File | Settings | File Templates.
 */
var superagent = require('superagent');
var utils = require('./utils/TestUtils');



describe('Projects Retrieve', function(){

    var token;  // Admin access token
    var project //
    var name = utils.createProjectName(true);   // Create random project name

    console.log('***********************************************')
    console.log('Project Name', name);
    console.log('***********************************************')


    it('should get admin token', function(done){

        superagent.post('https://localhost:8443/api/authentications')
            .send({ email: utils.admin.email , password: utils.admin.password })
            .end(function(e,res){
                token = res.body.data.access_token;
                done();
            });
    });


    it('should fail getting a all projects if access token is invalid', function(done){

        superagent.get('https://localhost:8443/api/projects?access_token=' + 'bjkbjhbfdsjh')
            .send()
            .end(function(e,res){
                utils.checkJSendFormat(res.body);
                expect(res.status).toBe(401);
                expect(res.body.status).toBe('fail');
                expect(res.body.data).toBe('Unauthorized');
                done();
            });
    });


    it('should get a all projects', function(done){

        superagent.get('https://localhost:8443/api/projects?access_token=' + token)
            .send()
            .end(function(e,res){
                utils.checkJSendFormat(res.body);
                expect(res.status).toBe(200);
                expect(res.body.status).toBe('success');
                expect(res.body.data.length).toBeGreaterThan(0);

                var projects  = res.body.data;
                var i = projects.length;
                var p;

                while( --i > -1 ){
                    p = projects[i];
                    expect(p.name).toBeDefined();
                    expect(p.name.length).toBeGreaterThan(1);
                    expect(p.pipes).toBeDefined();
                    expect(p.jobs).toBeDefined();
                    expect(p.collaborators).toBeDefined();
                    expect(p.pipes.length).toBeDefined();
                    expect(p.jobs.length).toBeDefined();
                    expect(p.collaborators.length).toBeDefined();
                    expect(p.modified).toBeDefined();
                }
                project = p;
                done();
            });
    });


    it('should get a projects by ID', function(done){

        superagent.get('https://localhost:8443/api/projects/' + project._id + '?access_token=' + token)
            .send()
            .end(function(e,res){
                utils.checkJSendFormat(res.body);
                expect(res.status).toBe(200);
                expect(res.body.status).toBe('success');
                expect(res.body.data).toBeDefined();
                var p = res.body.data;
                expect(p.name).toBeDefined();
                expect(p.name.length).toBeGreaterThan(1);
                expect(p.pipes).toBeDefined();
                expect(p.jobs).toBeDefined();
                expect(p.collaborators).toBeDefined();
                expect(p.pipes.length).toBeDefined();
                expect(p.jobs.length).toBeDefined();
                expect(p.collaborators.length).toBeDefined();
                expect(p.modified).toBeDefined();
                done();
            });
    });


    it('should fail getting a projects by ID if access token is invalid', function(done){

        superagent.get('https://localhost:8443/api/projects/' + project._id + '?access_token=' + '123455')
            .send()
            .end(function(e,res){
                utils.checkJSendFormat(res.body);
                expect(res.status).toBe(401);
                expect(res.body.status).toBe('fail');
                expect(res.body.data).toBe('Unauthorized');
                done();
            });
    });

    it('should fail getting a projects by ID if ID is non existent', function(done){

        superagent.get('https://localhost:8443/api/projects/' + project._id.substr(4) + '?access_token=' + token)
            .send()
            .end(function(e,res){
                utils.checkJSendFormat(res.body);
                expect(res.status).toBe(404);
                expect(res.body.status).toBe('fail');
                expect(res.body.data).toBe('Not found');
                done();
            });
    });


});