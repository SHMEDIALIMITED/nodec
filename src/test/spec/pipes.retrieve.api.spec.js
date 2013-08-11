/**
 * Created with JetBrains WebStorm.
 * User: admin
 * Date: 06/08/2013
 * Time: 22:01
 * To change this template use File | Settings | File Templates.
 */
var superagent = require('superagent');
var utils = require('./utils/TestUtils');



describe('Pipe Retrieve', function(){

    var token;  // Admin access token
    var project; // Test project
    var pipe   // Test pipe


    it('should get admin token and create new test project and create a 3 new pipes on the project', function(done){

        superagent.post('https://localhost:8443/api/authentications')
            .send({ email: utils.admin.email , password: utils.admin.password })
            .end(function(e,res){
                token = res.body.data.access_token;

                superagent.post('https://localhost:8443/api/projects?access_token=' + token)
                    .send({name: utils.createProjectName(true)})
                    .end(function(e,res){
                        project = res.body.data;

                        superagent.post('https://localhost:8443/api/projects/' + project._id + '/pipes?access_token=' + token)
                            .end(function(e,res){
                                pipe = res.body.data;
                                superagent.post('https://localhost:8443/api/projects/' + project._id + '/pipes?access_token=' + token)
                                    .end(function(e,res){
                                        pipe = res.body.data;
                                        superagent.post('https://localhost:8443/api/projects/' + project._id + '/pipes?access_token=' + token)
                                            .end(function(e,res){
                                                pipe = res.body.data;
                                                done();
                                            });
                                    });
                            });

                    });
            });
    });

    it('should fail retrieving all pipes of a project if access token is invalid', function(done){

        superagent.get('https://localhost:8443/api/projects/' + project._id + '/pipes?access_token=' + 'hhhh')
            .end(function(e,res){
                utils.checkJSendFormat(res.body);
                expect(res.status).toBe(401);
                expect(res.body.status).toBe('fail');
                expect(res.body.data).toBe('Unauthorized');
                done();
            });
    });



    it('should fail retrieving all pipes of a project if project ID is non existent', function(done){

        superagent.get('https://localhost:8443/api/projects/' + '12345678bnhjbhj' + '/pipes?access_token=' + token)
            .end(function(e,res){
                utils.checkJSendFormat(res.body);
                expect(res.status).toBe(404);
                expect(res.body.status).toBe('fail');
                expect(res.body.data).toBe('Not found');
                done();
            });
    });



    it('should retrieve all pipes of a project', function(done){

        superagent.get('https://localhost:8443/api/projects/' + project._id + '/pipes?access_token=' + token)
            .end(function(e,res){
                utils.checkJSendFormat(res.body);
                expect(res.status).toBe(200);
                expect(res.body.status).toBe('success');
                expect(res.body.data).toBeDefined();
                expect(res.body.data.length).toBe(3);

                var i = 3;
                while( --i > -1 ) {
                    expect(res.body.data[i]).toBeDefined();
                    expect(res.body.data[i].tasks).toBeDefined();
                    expect(res.body.data[i].tasks.length).toBeDefined();
                    expect(res.body.data[i].tasks.length).toBe(0);
                    expect(res.body.data[i].modified).toBeDefined();
                }

                done();
            });
    });


    it('should fail retrieving a pipe by ID of a project if access token is invalid', function(done){

        superagent.get('https://localhost:8443/api/projects/' + project._id + '/pipes/' + pipe._id + '?access_token=' + 'hhhh')
            .end(function(e,res){
                utils.checkJSendFormat(res.body);
                expect(res.status).toBe(401);
                expect(res.body.status).toBe('fail');
                expect(res.body.data).toBe('Unauthorized');
                done();
            });
    });



    it('should fail retrieving a pipe by ID of a project if project ID is non existent', function(done){

        superagent.get('https://localhost:8443/api/projects/' + '12345678bnhjbhj' + '/pipes/'  + pipe._id +  '?access_token=' + token)
            .end(function(e,res){
                utils.checkJSendFormat(res.body);
                expect(res.status).toBe(404);
                expect(res.body.status).toBe('fail');
                expect(res.body.data).toBe('Not found');
                done();
            });
    });


    it('should fail retrieving a pipe by ID of a project if pipe ID is non existent', function(done){

        superagent.get('https://localhost:8443/api/projects/' + project._id + '/pipes/'  + 'njknkjnjk' +  '?access_token=' + token)
            .end(function(e,res){
                utils.checkJSendFormat(res.body);
                expect(res.status).toBe(404);
                expect(res.body.status).toBe('fail');
                expect(res.body.data).toBe('Not found');
                done();
            });
    });


    it('should retrieve a pipe by ID of a project', function(done){

        superagent.get('https://localhost:8443/api/projects/' + project._id + '/pipes/'  + pipe._id +  '?access_token=' + token)
            .end(function(e,res){
                utils.checkJSendFormat(res.body);
                expect(res.status).toBe(200);
                expect(res.body.status).toBe('success');
                expect(res.body.data).toBeDefined();
                expect(res.body.data.tasks).toBeDefined();
                expect(res.body.data.tasks.length).toBeDefined();
                expect(res.body.data.tasks.length).toBe(0);
                expect(res.body.data.modified).toBeDefined();;
                done();
            });
    });


});