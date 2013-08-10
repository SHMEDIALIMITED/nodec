/**
 * Created with JetBrains WebStorm.
 * User: admin
 * Date: 06/08/2013
 * Time: 22:14
 * To change this template use File | Settings | File Templates.
 */

var User = require('../models').User;
var responseFormater = require('./utils/ResponseFormater');
var iz = require('iz');
var pwRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/;

module.exports = function(config) {

    return {
        create : function(req,res) {
            var email = req.body.email;
            var password = req.body.password;

            if(!email) return res.send(400, responseFormater.jsend(400, {email: 'missing'}));
            if(!password) return res.send(400, responseFormater.jsend(400, {password: 'missing'}));

            if(!iz.email(email)) return res.send(400, responseFormater.jsend(400, {email: 'invalid'}));
            if(!pwRegex.test(password)) return res.send(400, responseFormater.jsend(400, {password: 'invalid'}));

            User.findOne({email:req.body.email}, function(err, user){
                if(user) return res.send(400, responseFormater.jsend(400, {email: 'invalid'}));
                if(err) return res.send(500, responseFormater.jsend(500, 'Internal server error'));
                var user = new User({email:req.body.email, password:req.body.password, level:1});
                user.save(function(err, user){
                    if(err) return res.send(200, responseFormater.jsend(500, 'Internal server error'));
                    return res.send(200, responseFormater.jsend(200, user));
                });
            });
        },

        retrieve : function(req, res) {
            if(req.params.id){
                User.findById(req.params.id, function(err, user) {
                    if(err) return res.send(500, responseFormater.jsend(500 , 'Internal server error'));
                    if(!user) return res.send(404, responseFormater.jsend(404, 'Not found'));
                    return res.send(200, responseFormater.jsend(200, user));
                })
            }else {
                User.find({}, function(err, users) {
                    if(err) return res.send(500, responseFormater.jsend(500 , 'Internal server error'));
                    return res.send(200, responseFormater.jsend(200, users));
                });
            }
        },

        update : function(req, res) {

            var email = req.body.email;
            var password = req.body.password;

            if(!email && !password) return res.send(400, responseFormater.jsend(400, {email: 'missing', password:'missing'}));

            if(!email) return res.send(400, responseFormater.jsend(400, {email: 'missing'}));
            if(!password) return res.send(400, responseFormater.jsend(400, {password: 'missing'}));

            if(!iz.email(email) && !pwRegex.test(password)) return res.send(400, responseFormater.jsend(400, {email: 'invalid', password:'invalid'}));

            if(!iz.email(email)) return res.send(400, responseFormater.jsend(400, {email: 'invalid'}));
            if(!pwRegex.test(password)) return res.send(400, responseFormater.jsend(400, {password: 'invalid'}));

            if(req.params.id){
                User.findById(req.params.id, function(err, user) {
                    if(err) return res.send(500, responseFormater.jsend(500 , 'Internal server error'));
                    if(!user) return res.send(404, responseFormater.jsend(404, 'Not found'));

                    User.findOne({email: email}, function(err, userToCheck) {
                        if(userToCheck && user._id != userToCheck._id) {
                            return res.send(400, responseFormater.jsend(400, {email: 'invalid'}));
                        }
                        user.email = email;
                        user.password = password;
                        user.save(function(err, user){
                            if(err || !user) return res.send(500, responseFormater.jsend(500 , 'Internal server error'));
                            return res.send(200, responseFormater.jsend(200, user));
                        })
                    });
                });
            }else {
                return res.send(404, responseFormater.jsend(404, 'Not found'));
            }
        },

        del : function(req, res) {

            if(req.params.id){
                User.findById(req.params.id, function(err, user) {
                    if(err) return res.send(500, responseFormater.jsend(500 , 'Internal server error'));
                    if(!user) return res.send(404, responseFormater.jsend(404, 'Not found'));

                    user.remove(function(err, user) {
                        if(err) return res.send(500, responseFormater.jsend(500 , 'Internal server error'));
                        return res.send(200, responseFormater.jsend(200 , 'Deleted'));
                    })
                });
            }else {
                return res.send(404, responseFormater.jsend(404, 'Not found'));
            }
        }
    };
};