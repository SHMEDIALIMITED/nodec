/**
 * Created with JetBrains WebStorm.
 * User: admin
 * Date: 06/08/2013
 * Time: 22:01
 * To change this template use File | Settings | File Templates.
 */
var superagent = require('superagent');
var utils = require('./utils/TestUtils');



describe('Users Update', function(){

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

    it('should update an existing user with new email and new password', function(done){

        superagent.put('https://localhost:8443/api/users/' + user._id + '?access_token=' + token)
            .send({
                email : validEmail,
                password : validPassword
            })
            .end(function(e,res){
                utils.checkJSendFormat(res.body);
                expect(res.status).toBe(200);
                expect(res.body.status).toBe('success');
                expect(res.body.data.email).toBe(validEmail);
                expect(res.body.data.level).toBe(1);
                expect(res.body.data._id).toBe(user._id);
                expect(res.body.data.password).toBeUndefined();
                expect(res.body.data.salt).toBeUndefined();
                expect(res.body.data.accessToken).toBeUndefined();
                expect(res.body.data.resetToken).toBeUndefined();
                validEmail = utils.createEmail(true);
                done();
            });
    });

    it('should fail to update an existing user if access token is invalid', function(done){
        superagent.put('https://localhost:8443/api/users/' + user._id + '?access_token=' + '111')
            .send({
                email : validEmail,
                password : validPassword
            })
            .end(function(e,res){
                utils.checkJSendFormat(res.body);
                expect(res.status).toBe(401);
                expect(res.body.status).toBe('fail');
                expect(res.body.data).toBe('Unauthorized');
                done();
            });
    });


    it('should fail to update an existing user if id does not exist', function(done){
        superagent.put('https://localhost:8443/api/users/' + '000000000000000000000000' + '?access_token=' + token)
            .send({
                email : validEmail,
                password : validPassword
            })
            .end(function(e,res){
                utils.checkJSendFormat(res.body);
                expect(res.status).toBe(404);
                expect(res.body.status).toBe('fail');
                expect(res.body.data).toBe('Not found');
                done();
            });
    });

    it('should fail to update an existing user if data contains no email', function(done){
        superagent.put('https://localhost:8443/api/users/' + user._id + '?access_token=' + token)
            .send({
                password : validPassword
            })
            .end(function(e,res){
                utils.checkJSendFormat(res.body);
                expect(res.status).toBe(400);
                expect(res.body.status).toBe('fail');
                expect(res.body.data.email).toBe('missing');
                done();
            });
    });

    it('should fail to update an existing user if data contains no password', function(done){
        var newPassword = Math.random().toString();
        var newEmail = newPassword.substr(0,6) + '@' + newPassword.substr(6,4) + '.com';
        superagent.put('https://localhost:8443/api/users/' + user._id + '?access_token=' + token)
            .send({
                email : validEmail
            })
            .end(function(e,res){
                utils.checkJSendFormat(res.body);
                expect(res.status).toBe(400);
                expect(res.body.status).toBe('fail');
                expect(res.body.data.password).toBe('missing');
                done();
            });
    });

    it('should fail to update an existing user if data contains no password and no email', function(done){
        var newPassword = Math.random().toString();
        var newEmail = newPassword.substr(0,6) + '@' + newPassword.substr(6,4) + '.com';
        superagent.put('https://localhost:8443/api/users/' + user._id + '?access_token=' + token)
            .send({

            })
            .end(function(e,res){
                utils.checkJSendFormat(res.body);
                expect(res.status).toBe(400);
                expect(res.body.status).toBe('fail');
                expect(res.body.data.password).toBe('missing');
                expect(res.body.data.email).toBe('missing');
                done();
            });
    });

    it('should fail to update an existing user if data contains invalid password and email', function(done){
        var newPassword = Math.random().toString();
        var newEmail = newPassword.substr(0,6) + '@' + newPassword.substr(6,4) + '.com';
        superagent.put('https://localhost:8443/api/users/' + user._id + '?access_token=' + token)
            .send({
                email: invalidEmail,
                password: invalidPassword
            })
            .end(function(e,res){
                utils.checkJSendFormat(res.body);
                expect(res.status).toBe(400);
                expect(res.body.status).toBe('fail');
                expect(res.body.data.password).toBe('invalid');
                expect(res.body.data.email).toBe('invalid');
                done();
            });
    });


    it('should fail to update an existing user if data contains invalid password', function(done){
        var newPassword = Math.random().toString();
        var newEmail = newPassword.substr(0,6) + '@' + newPassword.substr(6,4) + '.com';
        superagent.put('https://localhost:8443/api/users/' + user._id + '?access_token=' + token)
            .send({
                email: validEmail,
                password: invalidPassword
            })
            .end(function(e,res){
                utils.checkJSendFormat(res.body);
                expect(res.status).toBe(400);
                expect(res.body.status).toBe('fail');
                expect(res.body.data.password).toBe('invalid');
                done();
            });
    });

    it('should fail to update an existing user if data contains invalid email', function(done){
        var newPassword = Math.random().toString();
        var newEmail = newPassword.substr(0,6) + '@' + newPassword.substr(6,4) + '.com';
        superagent.put('https://localhost:8443/api/users/' + user._id + '?access_token=' + token)
            .send({
                email: invalidEmail,
                password: validPassword
            })
            .end(function(e,res){
                utils.checkJSendFormat(res.body);
                expect(res.status).toBe(400);
                expect(res.body.status).toBe('fail');
                expect(res.body.data.email).toBe('invalid');
                done();
            });
    });

    it('should fail to update an existing user if data contains existing email of another user', function(done){
        var newPassword = Math.random().toString();
        var newEmail = newPassword.substr(0,6) + '@' + newPassword.substr(6,4) + '.com';
        superagent.put('https://localhost:8443/api/users/' + user._id + '?access_token=' + token)
            .send({
                email: utils.admin.email,
                password: validPassword
            })
            .end(function(e,res){
                utils.checkJSendFormat(res.body);
                expect(res.status).toBe(400);
                expect(res.body.status).toBe('fail');
                expect(res.body.data.email).toBe('invalid');
                done();
            });
    });
});