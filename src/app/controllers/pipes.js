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
            projects.retrieve(req, {send: function(status, jsend) {
                if(jsend.status != 'success') return res.send(status, jsend);
                var project = jsend.data;

                var id = req.params.pipe;




                if(id.length != 24) return res.send(404, responseFormater.jsend(404, 'Not found'));
                var input = req.body;

                var n = 0;
                for(var prop in input) {
                    n++;
                }



                if(n == 0) return res.send(400, responseFormater.jsend(400, {pipe: 'missing'}));
                if(!req.body.tasks) return res.send(400, responseFormater.jsend(400, {pipe: 'invalid'}));

                if(!(input.tasks instanceof Array)) {
                    return res.send(400, responseFormater.jsend(400, {pipe: 'invalid'}));
                }

                if(id) {

                    Pipe.findById(id, function(err, pipe) {



                        if(err) return res.send(500, responseFormater.jsend(500, 'Internal server error'));
                        if(!pipe) return res.send(404, responseFormater.jsend(404, 'Not found'));
                        if(input.tasks.length < pipe.tasks.length ) return res.send(403, responseFormater.jsend(403, 'Forbidden'));
                        var i = input.tasks.length;


                        while(--i > -1) {


                            if(input.tasks[i].length != 24) return res.send(400, responseFormater.jsend(400, {tasks: 'invalid'}));
                            continue;
                            // TODO Validate tasks by using tasks controller to update each


                            if(typeof input.tasks[i].data != 'Object') {
                                // Taks validation fail
                                return res.send(400, responseFormater.jsend(400, {tasks: 'invalid'}));
                            }
                        }
                        // TODO this will return validated task IDs that can be stored in Pipe document
                        pipe.tasks = input.tasks;

                        pipe.save(function(err, pipe) {
                            if(err) return res.send(500, responseFormater.jsend(500, 'Internal server error'));
                            else return res.send(200, responseFormater.jsend(200, pipe));
                        });





                    });
                }else{
                    return res.send(404, responseFormater.jsend(404, 'Not found'));
                }
            }});
        },

        del : function(req, res) {

        }
    };
};

function validatePipe(pipe) {

}