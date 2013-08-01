/**
 * Created with JetBrains WebStorm.
 * User: admin
 * Date: 01/08/2013
 * Time: 01:15
 * To change this template use File | Settings | File Templates.
 */

var User = require('../models').User;

module.exports = function(config) {

    return {

        create : function(req, res) {

            User.findOne({ email: req.body.email }, function(err, user) {

                if(!user) return res.send(401, 'Unauthorized');

                user.login(req.body.password, function(err, user) {

                    if(!err) return res.send(201, {access_token: user.accessToken});
                    else return res.send(err.code, err.message);
                });
            });
        },

        delete : function(req, res) {

            User.findOne({accessToken: req.query.access_token}, function(err, user) {

                if(!user) return res.send(401, 'Unauthorized');

                user.logout(function(err, user) {
                    return res.send(204, 'Resource deleted successfully.')
                });

            });
        }
    };
};