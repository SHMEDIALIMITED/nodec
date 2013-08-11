/**
 * Created with JetBrains WebStorm.
 * User: admin
 * Date: 06/08/2013
 * Time: 22:01
 * To change this template use File | Settings | File Templates.
 */
var superagent = require('superagent');
var utils = require('./utils/TestUtils');



describe('Projects Update', function(){

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


    it('should fail making a PUT request because PUT is not implemented', function(done){

        superagent.put('https://localhost:8443/api/projects/njknjknkjnk?access_token=' + token)
            .send({some:'data'})
            .end(function(e,res){
                utils.checkJSendFormat(res.body);
                expect(res.status).toBe(405);
                expect(res.body.status).toBe('fail');
                expect(res.body.data).toBe('Method not allowed');
                done();
            });
    });


    it('should fail if access token is invalid', function(done){

        superagent.put('https://localhost:8443/api/projects/njknjknkjnk?access_token=' + 'njknjkk')
            .send()
            .end(function(e,res){
                utils.checkJSendFormat(res.body);
                expect(res.status).toBe(401);
                expect(res.body.status).toBe('fail');
                expect(res.body.data).toBe('Unauthorized');
                done();
            });
    });


});