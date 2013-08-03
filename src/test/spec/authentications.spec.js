/**
 * Created with JetBrains WebStorm.
 * User: admin
 * Date: 01/08/2013
 * Time: 13:06
 * To change this template use File | Settings | File Templates.
 */

var config = require('../../config/config')['test'];
var mongoose = require('mongoose');
var Models = require('../../app/models');

if(config.db) {
    mongoose.connect(config.db);
    delete config.db;
}



describe('authentications Controller', function(){
    var authentications = require('../../app/controllers/authentications')(config);
    var User = Models.User;
    var password = Math.random().toString();
    var email = password.substr(0,4) + '@' + password.substr(4,7) + '.com';
    var user = new User({email:email, password:password});
    user.save();


    it('should have a create method', function() {
        expect(typeof authentications.create).toBe('function');
    });

    it('should have a delete method', function() {
        expect(typeof authentications.del).toBe('function');
    });

    describe('Create method', function() {

        it('should call response.send() with status 201 and access_token when using correct credentials', function(done) {

            var req = {body:{email:email, password:password}};
            var res = {send: function(status, payload) {
                expect(status).toBe(201)
                expect(payload.data.access_token).not.toBeUndefined();
                expect(payload.data.access_token).not.toBe('');
                expect(payload.data.access_token.length).toBe(36);
                done();
            }}
            authentications.create(req, res);
        });

        it('should call response.send() with status 401, Unauthorized when using wrong password', function(done) {

            var req = {body:{email:email, password:'2dnjdknjk'}};
            var res = {send: function(status, payload) {
                expect(status).toBe(401)
                expect(payload).not.toBeUndefined();
                expect(payload).toBe('Unauthorized');
                done();
            }}
            authentications.create(req, res);

        });

        it('should call response.send() with status 401, Unauthorized when using wrong email', function(done) {

            var req = {body:{email:'hhhbhjb@njknk.com', password:password}};
            var res = {send: function(status, payload) {
                expect(status).toBe(401)
                expect(payload).not.toBeUndefined();
                expect(payload).toBe('Unauthorized');
                done();
            }}
            authentications.create(req, res);

        });
    });

    describe('Delete method', function() {

        it('should delete the token and call response.send() with status 204 if access_token is sent', function(done) {

            var req = {query:{access_token:user.accessToken}};
            var res = {send: function(status, payload) {
                expect(status).toBe(204);
                expect(payload).toBe('Resource deleted successfully.');
                expect(user.accessToken).toBe('');
                done();
            }}
            authentications.del(req, res);
        });

        it('should call response.send() with status 401, Unauthorized when no access_token is sent', function(done) {

            var req = {query:{}};
            var res = {send: function(status, payload) {
                expect(status).toBe(401);
                expect(payload).toBe('Unauthorized');
                done();
            }}
            authentications.del(req, res);
        });
    })


});