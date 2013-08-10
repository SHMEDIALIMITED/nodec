/**
 * Created with JetBrains WebStorm.
 * User: admin
 * Date: 06/08/2013
 * Time: 22:01
 * To change this template use File | Settings | File Templates.
 */
var superagent = require('superagent');
var utils = require('./utils/TestUtils');



describe('Users Delete', function(){

    var token;  // Admin access token
    var user;   // Non Admin User with level=1

    var validEmail = utils.createEmail(true);
    var validPassword = utils.createPassword(true);

    var invalidEmail = utils.createEmail(false);
    var invalidPassword = utils.createPassword(false);


//    console.log('***********************************************')
//    console.log('Valid Password', validPassword);
//    console.log('InValid Password', invalidPassword);
//    console.log('Valid Email', validEmail);
//    console.log('InValid Email', invalidEmail);
//    console.log('***********************************************')


    it('should get admin token and create test user', function(done){

        superagent.post('https://localhost:8443/api/authentications')
            .send({ email: utils.admin.email , password: utils.admin.password })
            .end(function(e,res){
                token = res.body.data.access_token;
                superagent.post('https://localhost:8443/api/users?access_token=' + token)
                    .send({ email: validEmail , password: validPassword })
                    .end(function(e,res){
                        validEmail = utils.createEmail(true);
                        user = res.body.data;
                        done();
                    });
            });
    });

    it('should fail to delete an existing user by ID if access token is invalid', function(done){

        superagent.del('https://localhost:8443/api/users/' + user._id + '?access_token=' + '1234')
            .end(function(e,res){
                utils.checkJSendFormat(res.body);
                expect(res.status).toBe(401);
                expect(res.body.status).toBe('fail');
                expect(res.body.data).toBe('Unauthorized');
                done();
            });
    });

    it('should delete an existing user by ID', function(done){

        superagent.del('https://localhost:8443/api/users/' + user._id + '?access_token=' + token)
            .end(function(e,res){
                utils.checkJSendFormat(res.body);
                expect(res.status).toBe(200);
                expect(res.body.status).toBe('success');
                expect(res.body.data).toBe('Deleted');
                done();
            });
    });

    it('should fail to delete an existing user by ID if non existnet', function(done){

        superagent.del('https://localhost:8443/api/users/' + user._id + '?access_token=' + token)
            .end(function(e,res){
                utils.checkJSendFormat(res.body);
                expect(res.status).toBe(404);
                expect(res.body.status).toBe('fail');
                expect(res.body.data).toBe('Not found');
                done();
            });
    });

});
