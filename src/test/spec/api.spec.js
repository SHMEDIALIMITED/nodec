/**
 * Created with JetBrains WebStorm.
 * User: admin
 * Date: 01/08/2013
 * Time: 21:28
 * To change this template use File | Settings | File Templates.
 */

var superagent = require('superagent');




describe('REST API Server', function() {

    var email = 'p@t.com';
    var password = '1234';
    var id;
    var token;

    it('should authenticate user credentials and respond with API access token', function(done){
        superagent.post('https://localhost:8443/api/authentications')
            .send({ email: email , password: password })
            .end(function(e,res){
                expect(res.status).toBe(201);
                expect(res.body.access_token).not.toBeUndefined();
                expect(res.body.access_token.length).toBe(36);
                token = res.body.access_token;
                done();
            });
    });

    it('should fail deleting authentication due to missing access token', function(done){
        superagent.del('https://localhost:8443/api/authentications')
            .end(function(e,res){
                expect(res.status).toBe(401);
                done();
            });
    });

    it('should delete authentication', function(done){
        superagent.del('https://localhost:8443/api/authentications?access_token=' + token)
            .end(function(e,res){
                console.log(res)
                expect(res.status).toBe(204);
                done();
            });
    });
});