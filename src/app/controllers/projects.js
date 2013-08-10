/**
 * Created with JetBrains WebStorm.
 * User: admin
 * Date: 06/08/2013
 * Time: 22:14
 * To change this template use File | Settings | File Templates.
 */

var Project = require('../models').Project;
var responseFormater = require('./utils/ResponseFormater');


module.exports = function(config) {

    return {
        create : function(req,res) {



            var name = req.body.name;

            console.log('name', name);

            if(!name) {
                console.log('here')
                return res.send(400, responseFormater.jsend(400, {name:'missing'}));
            }
            if(name.length < 2) {
                console.log('--->')
                return res.send(400, responseFormater.jsend(400, {name:'invalid'}));
            }

            Project.findOne({name:name}, function(err, project) {
                if(err) return res.send(500, responseFormater.jsend(500, {name:'Internal server error'}));
                if(project) return res.send(400, responseFormater.jsend(400, {name:'invalid'}));
                var project = new Project({name:name});
                project.save(function(err, project) {
                    return res.send(200, responseFormater.jsend(200, project));
                });
            });
        },

        retrieve : function(req, res) {

        },

        update : function(req, res) {


        },

        del : function(req, res) {


        }
    };
};