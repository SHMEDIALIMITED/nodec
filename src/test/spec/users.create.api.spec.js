/**
 * Created with JetBrains WebStorm.
 * User: admin
 * Date: 06/08/2013
 * Time: 22:01
 * To change this template use File | Settings | File Templates.
 */
var superagent = require('superagent');
var utils = require('./utils/TestUtils');


describe('Users Create', function(){

    var token;  // Admin access token

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

    it('should get admin token', function(done){
        superagent.post('https://localhost:8443/api/authentications')
            .send({ email: utils.admin.email , password: utils.admin.password })
            .end(function(e,res){
                token = res.body.data.access_token;
                done();
            });
    });


    it('should not create a new user if email is missing', function(done){
        superagent.post('https://localhost:8443/api/users?access_token=' + token)
            .send( { password: validPassword } )
            .end(function(e,res){
                utils.checkJSendFormat(res.body);
                expect(res.status).toBe(400);
                expect(res.body.status).toBe('fail');
                expect(res.body.data.email).toBe('missing');
                done();
            });
    });

    it('should not create a new user if email is invalid', function(done){
        superagent.post('https://localhost:8443/api/users?access_token=' + token)
            .send( { email: invalidEmail, password:validPassword } )
            .end(function(e,res){
                utils.checkJSendFormat(res.body);
                expect(res.status).toBe(400);
                expect(res.body.status).toBe('fail');
                expect(res.body.data.email).toBe('invalid');
                done();
            });
    });

    it('should not create a new user if email is already registered', function(done){
        superagent.post('https://localhost:8443/api/users?access_token=' + token)
            .send( { email: utils.admin.email, password:validPassword  } )
            .end(function(e,res){
                utils.checkJSendFormat(res.body);
                expect(res.status).toBe(400);
                expect(res.body.status).toBe('fail');
                expect(res.body.data.email).toBe('invalid');
                done();
            });
    });


    it('should not create a new user if password is less than 8 charcters', function(done){
        superagent.post('https://localhost:8443/api/users?access_token=' + token)
            .send( { email: validEmail, password: 'He98009' } )
            .end(function(e,res){
                utils.checkJSendFormat(res.body);
                expect(res.status).toBe(400);
                expect(res.body.status).toBe('fail');
                expect(res.body.data.password).toBe('invalid');
                done();
            });
    });

    it('should not create a new user if password is numeric only', function(done){
        superagent.post('https://localhost:8443/api/users?access_token=' + token)
            .send( { email: validEmail, password: '123456789' } )
            .end(function(e,res){
                utils.checkJSendFormat(res.body);
                expect(res.status).toBe(400);
                expect(res.body.status).toBe('fail');
                expect(res.body.data.password).toBe('invalid');
                done();
            });
    });

    it('should not create a new user if password is chracters only', function(done){
        superagent.post('https://localhost:8443/api/users?access_token=' + token)
            .send( { email: validEmail, password: 'HelloWorld' } )
            .end(function(e,res){
                utils.checkJSendFormat(res.body);
                expect(res.status).toBe(400);
                expect(res.body.status).toBe('fail');
                expect(res.body.data.password).toBe('invalid');
                done();
            });
    });


    it('should not create a new user if access_token is invalid', function(done){
        superagent.post('https://localhost:8443/api/users?access_token=' + '1234')
            .send( { email: validEmail, password:validPassword } )
            .end(function(e,res){
                utils.checkJSendFormat(res.body);
                expect(res.status).toBe(401);
                expect(res.body.status).toBe('fail');
                expect(res.body.data).toBe('Unauthorized');
                done();
            });
    });

    it('should not create a new user if password is missing', function(done){
        superagent.post('https://localhost:8443/api/users?access_token=' + token)
            .send( { email:validEmail } )
            .end(function(e,res){
                utils.checkJSendFormat(res.body);
                expect(res.status).toBe(400);
                expect(res.body.status).toBe('fail');
                expect(res.body.data.password).toBe('missing');
                done();
            });
    });


    it('should create a new user', function(done){
        superagent.post('https://localhost:8443/api/users?access_token=' + token)
            .send( { email:validEmail, password:validPassword } )
            .end(function(e,res){
                utils.checkJSendFormat(res.body);
                expect(res.status).toBe(200);
                expect(res.body.status).toBe('success');
                expect(res.body.data.email).toBe(validEmail);
                expect(res.body.data.level).toBe(1);
                expect(res.body.data.password).toBeUndefined();
                expect(res.body.data.salt).toBeUndefined();
                expect(res.body.data.accessToken).toBeUndefined();
                expect(res.body.data.resetToken).toBeUndefined();
                done();
            });
    });

    it('should be able to authenticate new user with credentials', function(done) {
        superagent.post('https://localhost:8443/api/authentications')
            .send({ email: validEmail, password: validPassword })
            .end(function(e,res){
                expect(res.status).toBe(200);
                expect(res.body.status).toBe('success');
                done();
            });

    });
});