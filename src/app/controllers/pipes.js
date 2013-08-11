/**
 * Created with JetBrains WebStorm.
 * User: admin
 * Date: 06/08/2013
 * Time: 22:14
 * To change this template use File | Settings | File Templates.
 */

var Pipe = require('../models').Pipe;
var responseFormater = require('./utils/ResponseFormater');



module.exports = function(config, projects) {

    return {
        create : function(req,res) {
            projects.retrieve(req, {send: function(status, jsend) {
                if(jsend.status != 'success') return res.send(status, jsend);
                var project = jsend.data;
                var pipe = new Pipe();
                pipe.save(function(err, pipe) {
                    project.pipes.push(pipe._id);
                    project.save(function(err, project) {
                        if(err) return res.send(500, responseFormater.jsend(500, 'Internal server error'));
                        return res.send(200, responseFormater.jsend(200, pipe));
                    });
                });
            }});
        },

        retrieve : function(req, res) {
            projects.retrieve(req, {send: function(status, jsend) {
                if(jsend.status != 'success') return res.send(status, jsend);
                var project = jsend.data;

                var id = req.params.pipe;
                if(id) {
                    if(id.length != 24) return res.send(404, responseFormater.jsend(404, 'Not found'));
                    Pipe.findById(id, function(err, pipe) {
                        if(err) return res.send(500, responseFormater.jsend(500, 'Internal server error'));
                        if(!pipe) return res.send(404, responseFormater.jsend(404, 'Not found'));
                        return res.send(200, responseFormater.jsend(200, pipe));
                    });
                }else{
                    Pipe.find({'_id' : { $in : project.pipes}}, function(err, pipes) {
                        if(err) return res.send(500, responseFormater.jsend(500, 'Internal server error'));
                        return res.send(200, responseFormater.jsend(200, pipes));
                    });
                }
            }});
        },

        update : function(req, res) {

        },

        del : function(req, res) {

        }
    };
};