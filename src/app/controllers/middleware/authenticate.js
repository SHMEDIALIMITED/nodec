/**
 * Created with JetBrains WebStorm.
 * User: admin
 * Date: 04/08/2013
 * Time: 16:11
 * To change this template use File | Settings | File Templates.
 */

var User = require('../../models').User;
var responseFormater = require('../utils/ResponseFormater');

module.exports = function(req, res, next) {
    if(!req.query.access_token) {
        return res.send(401, responseFormater.jsend(401, 'Unauthorized'));
    }
    User.findOne({accessToken: req.query.access_token}, function(err, user) {
        if(err) return res.send(500, responseFormater.jsend(500, 'Internal server error'));
        if(!user) return res.send(401, responseFormater.jsend(401, 'Unauthorized'));
        req.user = user;
        next();
    });

}
