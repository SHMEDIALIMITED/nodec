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
});