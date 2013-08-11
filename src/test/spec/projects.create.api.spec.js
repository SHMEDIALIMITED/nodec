/**
 * Created with JetBrains WebStorm.
 * User: admin
 * Date: 06/08/2013
 * Time: 22:01
 * To change this template use File | Settings | File Templates.
 */
var superagent = require('superagent');
var utils = require('./utils/TestUtils');



describe('Projects Create', function(){

    var token;  // Admin access token
    var name = utils.createProjectName(true);   // Create random project name

//    console.log('***********************************************')
//    console.log('Project Name', name);
//    console.log('***********************************************')


    it('should get admin token', function(done){

        superagent.post('https://localhost:8443/api/authentications')
            .send({ email: utils.admin.email , password: utils.admin.password })
            .end(function(e,res){
                token = res.body.data.access_token;
                done();
            });
    });

    it('should fail creating a new project if access token is invalid', function(done){

        superagent.post('https://localhost:8443/api/projects?access_token=' + 'hhhh')
            .send({ name: name })
            .end(function(e,res){
                utils.checkJSendFormat(res.body);
                expect(res.status).toBe(401);
                expect(res.body.status).toBe('fail');
                expect(res.body.data).toBe('Unauthorized');
                done();
            });
    });

    it('should fail creating a new project if name is missing', function(done){

        superagent.post('https://localhost:8443/api/projects?access_token=' + token)
            .send({ })
            .end(function(e,res){
                utils.checkJSendFormat(res.body);
                expect(res.status).toBe(400);
                expect(res.body.status).toBe('fail');
                expect(res.body.data.name).toBe('missing');
                done();
            });
    });


    it('should fail creating a new project if name is less than 2 character long', function(done){

        superagent.post('https://localhost:8443/api/projects?access_token=' + token)
            .send({ name: '1' })
            .end(function(e,res){
                utils.checkJSendFormat(res.body);
                expect(res.status).toBe(400);
                expect(res.body.status).toBe('fail');
                expect(res.body.data.name).toBe('invalid');
                done();
            });
    });

    it('should create a new project', function(done){

        superagent.post('https://localhost:8443/api/projects?access_token=' + token)
            .send({ name: name })
            .end(function(e,res){
                utils.checkJSendFormat(res.body);
                expect(res.status).toBe(200);
                expect(res.body.status).toBe('success');
                expect(res.body.data.name).toBe(name);
                expect(res.body.data.pipes).toBeDefined();
                expect(res.body.data.jobs).toBeDefined();
                expect(res.body.data.collaborators).toBeDefined();
                expect(res.body.data.modified).toBeDefined();
                expect(res.body.data.pipes.length).toBe(0);
                expect(res.body.data.jobs.length).toBe(0);
                expect(res.body.data.collaborators.length).toBe(0);
                done();
            });
    });


});