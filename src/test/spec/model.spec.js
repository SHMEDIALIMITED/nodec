var config = require('../../config/config')['test'];
var mongoose = require('mongoose');
var Models = require('../../app/models');

mongoose.connect(config.db);




describe('User Model', function(){

    var User = Models.User;
    var password = Math.random().toString();
    var email = password.substr(0,4) + '@' + password.substr(4,7) + '.com';



    it('should be defined', function(){
        expect(User).toBeDefined();
    });


    it('should add one new user', function (done){
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

    it('should not allow to add the same email twice', function(done){
        var user = new User({email:email, password:password});
        user.save( function(err, user) {
            expect(err.code).toBe(11000);
            expect(user).toBeUndefined();
            done();
        });
    });

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