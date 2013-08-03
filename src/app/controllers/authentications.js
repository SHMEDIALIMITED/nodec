/**
 * Created with JetBrains WebStorm.
 * User: admin
 * Date: 01/08/2013
 * Time: 01:15
 * To change this template use File | Settings | File Templates.
 */

var User = require('../models').User;
var responseFormater = require('./utils/ResponseFormater');

module.exports = function(config) {

    return {

        create : function(req, res) {
            var missing = {};

            if(!req.body.email) missing.email = 'missing';
            if(!req.body.password) missing.password = 'missing';
            if(missing.email || missing.password) return res.send(400, responseFormater.jsend(400, missing));

            User.findOne({ email: req.body.email }, function(err, user) {

                if(!user) return res.send(403, responseFormater.jsend(401, 'Incorrect credentials'));

                user.login(req.body.password, function(err, user) {

                    if(!err) return res.send(200, responseFormater.jsend(200, {access_token: user.accessToken}));
                    else return res.send(403, responseFormater.jsend(403, 'Incorrect credentials'));
                });
            });
        },

        del : function(req, res) {

            console.log('HERE', responseFormater.jsend(401, 'Unauthorized'))

            if(!req.query.access_token) return res.send(401, responseFormater.jsend(401, 'Unauthorized'));
            User.findOne({accessToken: req.query.access_token}, function(err, user) {

                if(!user) return res.send(404, responseFormater.jsend(404, 'Unauthorized'));

                user.logout(function(err, user) {
                    return res.send(200, responseFormater.jsend(200, 'Deleted'));
                });

            });
        }
    };
};