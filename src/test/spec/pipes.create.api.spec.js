/**
 * Created with JetBrains WebStorm.
 * User: admin
 * Date: 06/08/2013
 * Time: 22:01
 * To change this template use File | Settings | File Templates.
 */
var superagent = require('superagent');
var utils = require('./utils/TestUtils');



describe('Pipe Create', function(){

    var token;  // Admin access token
    var project; // Test project


    it('should get admin token and test project', function(done){

        superagent.post('https://localhost:8443/api/authentications')
            .send({ email: utils.admin.email , password: utils.admin.password })
            .end(function(e,res){
                token = res.body.data.access_token;
                superagent.get('https://localhost:8443/api/projects?access_token=' + token)
                    .end(function(e,res){
                        project = res.body.data[0];
                        done();
                    });
            });
    });

    it('should fail creating a new pipe on a project if access token is invalid', function(done){

        superagent.post('https://localhost:8443/api/projects/' + project._id + '/pipes?access_token=' + 'hhhh')
            .end(function(e,res){
                utils.checkJSendFormat(res.body);
                expect(res.status).toBe(401);
                expect(res.body.status).toBe('fail');
                expect(res.body.data).toBe('Unauthorized');
                done();
            });
    });



    it('should fail creating a new pipe on a project if project ID is non existent', function(done){

        superagent.post('https://localhost:8443/api/projects/' + '12345678bnhjbhj' + '/pipes?access_token=' + token)
            .end(function(e,res){
                utils.checkJSendFormat(res.body);
                expect(res.status).toBe(404);
                expect(res.body.status).toBe('fail');
                expect(res.body.data).toBe('Not found');
                done();
            });
    });



    it('should create a new pipe on a project', function(done){

        superagent.post('https://localhost:8443/api/projects/' + project._id + '/pipes?access_token=' + token)
            .end(function(e,res){
                utils.checkJSendFormat(res.body);
                expect(res.status).toBe(200);
                expect(res.body.status).toBe('success');
                expect(res.body.data.tasks).toBeDefined();
                expect(res.body.data.modified).toBeDefined();
                done();
            });
    });


});