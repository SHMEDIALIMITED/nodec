/**
 * Created with JetBrains WebStorm.
 * User: admin
 * Date: 06/08/2013
 * Time: 22:01
 * To change this template use File | Settings | File Templates.
 */
var superagent = require('superagent');
var utils = require('./utils/TestUtils');

describe('Users Retrieve', function(){

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
                        user = res.body.data;
                        done();
                    });
            });
    });

    it('should get a collection of all users', function(done){
        superagent.get('https://localhost:8443/api/users?access_token=' + token)
            .end(function(e,res){
                utils.checkJSendFormat(res.body);
                expect(res.status).toBe(200);
                expect(res.body.status).toBe('success');
                expect(res.body.data.length).toBeGreaterThan(0);
                var users  = res.body.data;
                var i = users.length;

                while( --i > -1 ){
                    user = users[i];
                    expect(user.email).toBeDefined();
                    expect(user.level).toBeDefined();
                    expect(user.modified).toBeDefined();
                    expect(user._id).toBeDefined();
                    expect(user.password).toBeUndefined();
                    expect(user.salt).toBeUndefined();
                    expect(user.accessToken).toBeUndefined();
                    expect(user.resetToken).toBeUndefined();
                }
                done();
            });
    });

    it('should fail getting a collection of all users if invalid access token is provided', function(done){
        superagent.get('https://localhost:8443/api/users?access_token=' + '1234')
            .end(function(e,res){
                utils.checkJSendFormat(res.body);
                expect(res.status).toBe(401);
                expect(res.body.status).toBe('fail');
                expect(res.body.data).toBe('Unauthorized');
                done();
            });
    });

    it('should get a user by ID', function(done){



        superagent.get('https://localhost:8443/api/users/' + user._id + '?access_token=' + token)
            .end(function(e,res){
                utils.checkJSendFormat(res.body);
                expect(res.status).toBe(200);
                expect(res.body.status).toBe('success');
                expect(res.body.data.email).toBe(user.email);
                expect(res.body.data.level).toBe(user.level);
                expect(res.body.data._id).toBe(user._id);
                expect(res.body.data.modified).toBe(user.modified);
                expect(res.body.data.password).toBeUndefined();
                expect(res.body.data.salt).toBeUndefined();
                expect(res.body.data.accessToken).toBeUndefined();
                expect(res.body.data.resetToken).toBeUndefined();
                done();
            });
    });

    it('should fail getting a user by ID if access token is invalid', function(done){
        superagent.get('https://localhost:8443/api/users/' + user._id + '?access_token=' + '27868')
            .end(function(e,res){
                utils.checkJSendFormat(res.body);
                expect(res.status).toBe(401);
                expect(res.body.status).toBe('fail');
                expect(res.body.data).toBe('Unauthorized');
                done();
            });
    });


    it('should fail getting a user by ID if ID does not exist', function(done){
        superagent.get('https://localhost:8443/api/users/' + '0000-000000.00@000000000' + '?access_token=' + token)
            .end(function(e,res){
                utils.checkJSendFormat(res.body);
                expect(res.status).toBe(404);
                expect(res.body.status).toBe('fail');
                expect(res.body.data).toBe('Not found');
                done();
            });
    });
});