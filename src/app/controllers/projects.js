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

            if(!name) {
                return res.send(400, responseFormater.jsend(400, {name:'missing'}));
            }

            if(name.length < 2) {
                return res.send(400, responseFormater.jsend(400, {name:'invalid'}));
            }

            Project.findOne({name:name}, function(err, project) {
                if(err) return res.send(500, responseFormater.jsend(500, 'Internal server error'));
                if(project) return res.send(400, responseFormater.jsend(400, {name:'invalid'}));
                var project = new Project({name:name});
                project.save(function(err, project) {
                    return res.send(200, responseFormater.jsend(200, project));
                });
            });
        },

        retrieve : function(req, res) {
            var id = req.params.project;

            if(id) {
                if(id.length != 24) return res.send(404, responseFormater.jsend(404, 'Not found'));
                Project.findById(id, function(err, project) {
                    if(err) return res.send(500, responseFormater.jsend(500, 'Internal server error'));
                    if(!project) return res.send(404, responseFormater.jsend(404,'Not found'));
                    res.send(200, responseFormater.jsend(200, project));

                });
            }else{
                Project.find({},function(err, projects) {
                    if(err) return res.send(500, responseFormater.jsend(500, 'Internal server error'));
                    return res.send(200, responseFormater.jsend(200, projects));
                });
            }
        },

        update : function(req, res) {
            return res.send(405, responseFormater.jsend(405, 'Method not allowed'));
        },

        del : function(req, res) {
            var id = req.params.project
            if(id) {
                if(id.length != 24) return res.send(404, responseFormater.jsend(404,'Not found'));
                Project.findById(id, function(err, project) {
                    if(err)  return res.send(500, responseFormater.jsend(500, 'Internal server error'));
                    if(!project) return res.send(404, responseFormater.jsend(404,'Not found'));
                    return res.send(200, responseFormater.jsend(200, 'Deleted'));
                });
            }else {
                return res.send(405, responseFormater.jsend(405, 'Method not allowed'));
            }
        }
    };
};