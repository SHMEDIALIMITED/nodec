/**
 * Created with JetBrains WebStorm.
 * User: admin
 * Date: 06/08/2013
 * Time: 22:01
 * To change this template use File | Settings | File Templates.
 */
var superagent = require('superagent');
var utils = require('./utils/TestUtils');



describe('Projects Delete', function(){

    var token;  // Admin access token
    var project //
    var name = utils.createProjectName(true);   // Create random project name

    console.log('***********************************************')
    console.log('Project Name', name);
    console.log('***********************************************')


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

    it('should not delete a project if not ID non existent', function(done){

        superagent.del('https://localhost:8443/api/projects/' + '1234567890' + '?access_token=' + token)
            .end(function(e,res){
                utils.checkJSendFormat(res.body);
                expect(res.status).toBe(404);
                expect(res.body.status).toBe('fail');
                expect(res.body.data).toBe('Not found');
                done();
            });
    });

    it('should not delete a project if access token invalid', function(done){

        superagent.del('https://localhost:8443/api/projects/' + project._id + '?access_token=' + '13456787bbbn')
            .end(function(e,res){
                utils.checkJSendFormat(res.body);
                expect(res.status).toBe(401);
                expect(res.body.status).toBe('fail');
                expect(res.body.data).toBe('Unauthorized');
                done();
            });
    });

    it('should delete a project by ID', function(done){

        superagent.del('https://localhost:8443/api/projects/' + project._id + '?access_token=' + token)
            .end(function(e,res){
                utils.checkJSendFormat(res.body);
                expect(res.status).toBe(200);
                expect(res.body.status).toBe('success');
                expect(res.body.data).toBe('Deleted');
                done();
            });
    });





});