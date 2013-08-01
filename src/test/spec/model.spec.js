var config = require('../../config/config')['test'];
var mongoose = require('mongoose');
var Models = require('../../app/models');

if(config.db) {
    mongoose.connect(config.db);
    delete config.db;
}


/**
 * Mongoose DB Models
 */
describe('User Model', function(){

    var User = Models.User;
    var password = Math.random().toString();
    var email = password.substr(0,4) + '@' + password.substr(4,7) + '.com';



    it('should be defined', function(){
        expect(User).toBeDefined();
    });


    it('should add one new user when saving new instance', function (done){
        User.count({}, function(err, numUsers) {
            var user = new User({email:email, password:password});
            user.save(function(err, user) {
                User.count({}, function(err, numUsersInc) {
                    expect(numUsersInc).toBe(numUsers+1);
                    done();
                });
            });
        });
    });

    it('should not allow to add a user that has already been registered', function(done){
        var user = new User({email:email, password:password});
        user.save( function(err, user) {
            expect(err.code).toBe(11000);
            expect(user).toBeUndefined();
            done();
        });
    });

    describe('Private method isValidPassword', function() {

        it('should authenticate test email and password', function(done) {
            User.findOne({email: email}, function(err, user) {
                expect(user.isValidPassword(password)).toBeTruthy();
                done();
            });
        });

        it('should not authenticate test email with wrong password', function(done) {
            User.findOne({email: email}, function(err, user) {
                expect(user.isValidPassword(password)).toBeTruthy();
                done();
            });
        });
    });

    describe('Public method login', function() {

        it('it should respond 401 Unauthorized when using wrong password', function(done) {
            User.findOne({email: email}, function(err, user) {
                user.login('12345t6xxx', function(err, user) {
                    expect(user).toBeUndefined();
                    expect(err.code).toBe(401);
                    expect(err.message).toBe('Unauthorized');
                    done();
                });
            });
        });

        it('it should create a new access_token when calling login with correct password', function(done) {
            User.findOne({email: email}, function(err, user) {
                user.login(password, function(err, user) {
                    expect(user.accessToken).not.toBe('');
                    done();
                });
            });
        });
    });

    describe('Public method login', function() {

        it('it should delete the acccess_token when calling logout', function(done) {
            User.findOne({email: email}, function(err, user) {
                user.logout(function(err, user) {
                    expect(user.accessToken).toBe('');
                    done();
                });
            });
        });
    });
});