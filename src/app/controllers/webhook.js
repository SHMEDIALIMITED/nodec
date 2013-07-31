/**
 * Created with JetBrains WebStorm.
 * User: admin
 * Date: 31/07/2013
 * Time: 21:16
 * To change this template use File | Settings | File Templates.
 */

var User = require('../models').User;
module.exports = function(app, config) {

    return {

        post : function(req, res) {

            var user = new User({password:'1234', email:'t@h.com'});
            user.save();
            res.send(200);
        }

    }

}