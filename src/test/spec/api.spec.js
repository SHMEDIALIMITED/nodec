/**
 * Created with JetBrains WebStorm.
 * User: admin
 * Date: 01/08/2013
 * Time: 21:28
 * To change this template use File | Settings | File Templates.
 */

var superagent = require('superagent');

// JSend format check helper
function checkJSendFormat(body) {
    expect(body.status).not.toBeUndefined();
    expect(body.data).not.toBeUndefined();
}



describe('REST API :: ', function() {

    var email = 'p@t.com';
    var password = '1234';
    var id;
    var token;

    describe('Authentications --->', function() {

        describe('POST', function() {

            it('should authenticate correct credentials and respond with API access token', function(done){
                superagent.post('https://localhost:8443/api/authentications')
                    .send({ email: email , password: password })
                    .end(function(e,res){
                        checkJSendFormat(res.body);
                        expect(res.status).toBe(200);
                        expect(res.body.status).toBe('success');
                        expect(res.body.data.access_token).not.toBeUndefined();
                        expect(res.body.data.access_token.length).toBe(36);
                        token = res.body.data.access_token;
                        done();
                    });
            });

            it('should not authenticate incorrect credentials and respond error', function(done){
                superagent.post('https://localhost:8443/api/authentications')
                    .send({ email: email , password: 'incorrect password' })
                    .end(function(e,res){
                        checkJSendFormat(res.body);
                        expect(res.status).toBe(403);
                        expect(res.body.status).toBe('fail');
                        expect(res.body.data).toBe('Incorrect credentials');
                        done();
                    });
            });

            it('should not authenticate when email is missing and respond with error', function(done){
                superagent.post('https://localhost:8443/api/authentications')
                    .send({  password: password })
                    .end(function(e,res){
                        checkJSendFormat(res.body);
                        expect(res.status).toBe(400);
                        expect(res.body.status).toBe('fail');
                        expect(res.body.data.email).toBeDefined();
                        expect(res.body.data.email).toBe('missing');
                        done();
                    });
            });

            it('should not authenticate when password is missing and respond with error', function(done){
                superagent.post('https://localhost:8443/api/authentications')
                    .send({  emai:email })
                    .end(function(e,res){
                        checkJSendFormat(res.body);
                        expect(res.status).toBe(400);
                        expect(res.body.status).toBe('fail');
                        expect(res.body.data.password).toBeDefined();
                        expect(res.body.data.password).toBe('missing');
                        done();
                    });
            });

            it('should not authenticate when email and password is missing and respond with error', function(done){
                superagent.post('https://localhost:8443/api/authentications')
                    .send({ })
                    .end(function(e,res){
                        checkJSendFormat(res.body);
                        expect(res.status).toBe(400);
                        expect(res.body.status).toBe('fail');
                        expect(res.body.data.password).toBeDefined();
                        expect(res.body.data.password).toBe('missing');
                        expect(res.body.data.email).toBeDefined();
                        expect(res.body.data.email).toBe('missing');
                        done();
                    });
            });
        });


        describe('DELETE', function() {
            it('should fail deleting authentication due to missing access token', function(done){
                superagent.del('https://localhost:8443/api/authentications')
                    .end(function(e,res){
                        checkJSendFormat(res.body);
                        expect(res.status).toBe(401);
                        expect(res.body.status).toBe('fail');
                        expect(res.body.data).toBe('Unauthorized');
                        done();
                    });
            });

            it('should delete authentication', function(done){
                superagent.del('https://localhost:8443/api/authentications/?access_token=' + token)
                    .end(function(e,res){
                        checkJSendFormat(res.body);
                        expect(res.status).toBe(200);
                        expect(res.body.status).toBe('success');
                        expect(res.body.data).toBe('Deleted');
                        done();
                    });
            });
        });


    });


    describe('Users ---> ', function() {

        var userPassword = Math.random().toString();
        var userEmail = password.substr(0,4) + '@' + password.substr(4,7) + '.com';
        var user;

        describe('POST ', function(){

            beforeEach(function(done) {
                superagent.post('https://localhost:8443/api/authentications')
                    .send({ email: email , password: password })
                    .end(function(e,res){
                        token = res.body.data.access_token;
                        done();
                    });
            });


            it('should not create a new user if email is missing', function(done){
                superagent.post('https://localhost:8443/api/users?access_token=' + token)
                    .send( { } )
                    .end(function(e,res){
                        checkJSendFormat(res.body);
                        expect(res.status).toBe(400);
                        expect(res.body.status).toBe('fail');
                        expect(res.body.data.email).toBe('missing');
                        done();
                    });
            });

            it('should not create a new user if email is invalid', function(done){
                superagent.post('https://localhost:8443/api/users?access_token=' + token)
                    .send( { email: userEmail.substr(0,5) } )
                    .end(function(e,res){
                        checkJSendFormat(res.body);
                        expect(res.status).toBe(400);
                        expect(res.body.status).toBe('fail');
                        expect(res.body.data.email).toBe('invalid');
                        done();
                    });
            });

            it('should not create a new user if access_token is invalid', function(done){
                superagent.post('https://localhost:8443/api/users?access_token=' + '1234')
                    .send( { email: userEmail } )
                    .end(function(e,res){
                        checkJSendFormat(res.body);
                        expect(res.status).toBe(401);
                        expect(res.body.status).toBe('fail');
                        expect(res.body.data.email).toBe('Unauthorized');
                        done();
                    });
            });

            it('should create a new user', function(done){
                superagent.post('https://localhost:8443/api/users?access_token=' + token)
                    .send( { email:userEmail } )
                    .end(function(e,res){
                        checkJSendFormat(res.body);
                        expect(res.status).toBe(200);
                        expect(res.body.status).toBe('success');
                        expect(res.body.data.email).toBe(userEmail);
                        expect(res.body.data.level).toBe(1);
                        done();
                    });
            });
        });

        describe('GET ', function(){



            it('should get a collection of all users', function(done){
                superagent.get('https://localhost:8443/api/users?access_token=' + token)
                    .end(function(e,res){
                        checkJSendFormat(res.body);
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
                        }
                        done();
                    });
            });

            it('should fail if no access token is provided', function(done){
                superagent.get('https://localhost:8443/api/users?access_token=' + '1234')
                    .end(function(e,res){
                        checkJSendFormat(res.body);
                        expect(res.status).toBe(401);
                        expect(res.body.status).toBe('fail');
                        expect(res.body.data).toBe('Unauthorized');
                        done();
                    });
            });

            it('should get a user by ID', function(done){
                superagent.get('https://localhost:8443/api/users/' + user._id + '?access_token=' + token)
                    .end(function(e,res){
                        checkJSendFormat(res.body);
                        expect(res.status).toBe(200);
                        expect(res.body.status).toBe('success');
                        expect(res.body.data.email).toBe(user.email);
                        expect(res.body.data.level).toBe(user.level);
                        expect(res.body.data._id).toBe(user._id);
                        expect(res.body.data.modified).toBe(user.modified);
                        done();
                    });
            });

            it('should fail getting a user by ID if access token is invalid', function(done){
                superagent.get('https://localhost:8443/api/users/' + user._id + '?access_token=' + '27868')
                    .end(function(e,res){
                        checkJSendFormat(res.body);
                        expect(res.status).toBe(401);
                        expect(res.body.status).toBe('fail');
                        expect(res.body.data).toBe('Unauthorized');
                        done();
                    });
            });


            it('should fail getting a user by ID if ID does not exist', function(done){
                superagent.get('https://localhost:8443/api/users/' + '89789798' + '?access_token=' + token)
                    .end(function(e,res){
                        checkJSendFormat(res.body);
                        expect(res.status).toBe(404);
                        expect(res.body.status).toBe('fail');
                        expect(res.body.data).toBe('Not found');
                        done();
                    });
            });
        });

        describe('PUT ', function(){

            it('should update an existing user', function(done){
                var newPassword = Math.random().toString();
                var newEmail = newPassword.substr(0,6) + '@' + newPassword.substr(6,4) + '.com';
                superagent.get('https://localhost:8443/api/users/' + user._id + '?access_token=' + token)
                    .send({
                        email : newEmail,
                        password : newPassword
                    })
                    .end(function(e,res){
                        checkJSendFormat(res.body);
                        expect(res.status).toBe(200);
                        expect(res.body.status).toBe('success');
                        expect(res.body.data.email).toBe(newEmail);
                        expect(res.body.data.level).toBe(1);
                        expect(res.body.data._id).toBe(user._id);
                        done();
                    });
            });

            it('should fail to update an existing user if access token is invalid', function(done){
                var newPassword = Math.random().toString();
                var newEmail = newPassword.substr(0,6) + '@' + newPassword.substr(6,4) + '.com';
                superagent.get('https://localhost:8443/api/users/' + user._id + '?access_token=' + '111')
                    .send({
                        email : newEmail,
                        password : newPassword
                    })
                    .end(function(e,res){
                        checkJSendFormat(res.body);
                        expect(res.status).toBe(401);
                        expect(res.body.status).toBe('fail');
                        expect(res.body.data).toBe('Unauthorized');
                        done();
                    });
            });


            it('should fail to update an existing user id id does not exist', function(done){
                var newPassword = Math.random().toString();
                var newEmail = newPassword.substr(0,6) + '@' + newPassword.substr(6,4) + '.com';
                superagent.get('https://localhost:8443/api/users/' + '080980' + '?access_token=' + token)
                    .send({
                        email : newEmail,
                        password : newPassword
                    })
                    .end(function(e,res){
                        checkJSendFormat(res.body);
                        expect(res.status).toBe(404);
                        expect(res.body.status).toBe('fail');
                        expect(res.body.data).toBe('Not found');
                        done();
                    });
            });

            it('should fail to update an existing user if data contains no email', function(done){
                var newPassword = Math.random().toString();
                var newEmail = newPassword.substr(0,6) + '@' + newPassword.substr(6,4) + '.com';
                superagent.get('https://localhost:8443/api/users/' + user._id + '?access_token=' + token)
                    .send({
                        password : newPassword
                    })
                    .end(function(e,res){
                        checkJSendFormat(res.body);
                        expect(res.status).toBe(400);
                        expect(res.body.status).toBe('fail');
                        expect(res.body.data.email).toBe('missing');
                        done();
                    });
            });

            it('should fail to update an existing user if data contains no password', function(done){
                var newPassword = Math.random().toString();
                var newEmail = newPassword.substr(0,6) + '@' + newPassword.substr(6,4) + '.com';
                superagent.get('https://localhost:8443/api/users/' + user._id + '?access_token=' + token)
                    .send({
                        email : newEmail
                    })
                    .end(function(e,res){
                        checkJSendFormat(res.body);
                        expect(res.status).toBe(400);
                        expect(res.body.status).toBe('fail');
                        expect(res.body.data.password).toBe('missing');
                        done();
                    });
            });

            it('should fail to update an existing user if data contains no password and no email', function(done){
                var newPassword = Math.random().toString();
                var newEmail = newPassword.substr(0,6) + '@' + newPassword.substr(6,4) + '.com';
                superagent.get('https://localhost:8443/api/users/' + user._id + '?access_token=' + token)
                    .send({

                    })
                    .end(function(e,res){
                        checkJSendFormat(res.body);
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
                superagent.get('https://localhost:8443/api/users/' + user._id + '?access_token=' + token)
                    .send({
                        email: newEmail.substr(0, 5),
                        password: password.substr(0, 4)
                    })
                    .end(function(e,res){
                        checkJSendFormat(res.body);
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
                superagent.get('https://localhost:8443/api/users/' + user._id + '?access_token=' + token)
                    .send({
                        email: newEmail,
                        password: password.substr(0, 4)
                    })
                    .end(function(e,res){
                        checkJSendFormat(res.body);
                        expect(res.status).toBe(400);
                        expect(res.body.status).toBe('fail');
                        expect(res.body.data.password).toBe('invalid');
                        done();
                    });
            });

            it('should fail to update an existing user if data contains invalid email', function(done){
                var newPassword = Math.random().toString();
                var newEmail = newPassword.substr(0,6) + '@' + newPassword.substr(6,4) + '.com';
                superagent.get('https://localhost:8443/api/users/' + user._id + '?access_token=' + token)
                    .send({
                        email: newEmail.substr(0, 5),
                        password: password
                    })
                    .end(function(e,res){
                        checkJSendFormat(res.body);
                        expect(res.status).toBe(400);
                        expect(res.body.status).toBe('fail');
                        expect(res.body.data.email).toBe('invalid');
                        done();
                    });
            });
        });

        describe('DELETE ', function(){

        });

    });

});