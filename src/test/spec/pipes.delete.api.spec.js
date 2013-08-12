/**
 * Created with JetBrains WebStorm.
 * User: admin
 * Date: 06/08/2013
 * Time: 22:01
 * To change this template use File | Settings | File Templates.
 */
var superagent = require('superagent');
var utils = require('./utils/TestUtils');




describe('Pipe Delete', function(){

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

    it('should fail deleting a pipe of a project if access token is invalid', function(done){

        superagent.del('https://localhost:8443/api/projects/' + project._id + '/pipes/' + pipe._id + '?access_token=' + 'hhhh')
            .end(function(e,res){
                utils.checkJSendFormat(res.body);
                expect(res.status).toBe(401);
                expect(res.body.status).toBe('fail');
                expect(res.body.data).toBe('Unauthorized');
                done();
            });
    });



    it('should fail deleting a pipe of a project if project ID is non existent', function(done){

        superagent.del('https://localhost:8443/api/projects/' + '12345678bnhjbhj' + '/pipes/' + pipe._id + '?access_token=' + token)
            .end(function(e,res){
                utils.checkJSendFormat(res.body);
                expect(res.status).toBe(404);
                expect(res.body.status).toBe('fail');
                expect(res.body.data).toBe('Not found');
                done();
            });
    });



    it('should fail deleting a pipe of a project if pipe ID is non existent', function(done){

        superagent.del('https://localhost:8443/api/projects/' + project._id + '/pipes/' + 'nbjbnjhbhj' + '?access_token=' + token)
            .end(function(e,res){
                utils.checkJSendFormat(res.body);
                expect(res.status).toBe(404);
                expect(res.body.status).toBe('fail');
                expect(res.body.data).toBe('Not found');
                done();
            });
    });


    it('should delete a pipe of a project deleting all tasks with it', function(done){

        superagent.del('https://localhost:8443/api/projects/' + project._id + '/pipes/' + pipe._id + '?access_token=' + token)
            .end(function(e,res){
                utils.checkJSendFormat(res.body);
                expect(res.status).toBe(200);
                expect(res.body.status).toBe('success');
                expect(res.body.data).toBe('Deleted');

                superagent.get('https://localhost:8443/api/projects/' + project._id + '/pipes/' + pipe._id + '?access_token=' + token)
                    .end(function(e,res){
                        utils.checkJSendFormat(res.body);
                        expect(res.status).toBe(404);
                        expect(res.body.status).toBe('fail');
                        expect(res.body.data).toBe('Not found');
                        done();
                    });

            });
    });







});