/**
 * Created with JetBrains WebStorm.
 * User: admin
 * Date: 06/08/2013
 * Time: 22:01
 * To change this template use File | Settings | File Templates.
 */
var superagent = require('superagent');
var utils = require('./utils/TestUtils');
var mongoose = require('mongoose');

var Task = require('../../app/models').Task;

var config = require('../../config/config')['test'];
if(config.db) {
    mongoose.connect(config.db);
    delete config.db;
}


describe('Pipe Update', function(){

    var token;          // Admin access token
    var project;        // Test project
    var pipes = [];     // 3 test pipes
    var pipe;           // Test pipe
    var tasks = [];          // Test Task


    it('should get admin token and create new test project and create a 3 new pipes on the project and modify first pipe', function(done){

        superagent.post('https://localhost:8443/api/authentications')
            .send({ email: utils.admin.email , password: utils.admin.password })
            .end(function(e,res){
                token = res.body.data.access_token;

                superagent.post('https://localhost:8443/api/projects?access_token=' + token)
                    .send({name: utils.createProjectName(true)})
                    .end(function(e,res){
                        project = res.body.data;

                        superagent.post('https://localhost:8443/api/projects/' + project._id + '/pipes?access_token=' + token)
                            .end(function(e,res){
                                pipes.push(res.body.data);
                                superagent.post('https://localhost:8443/api/projects/' + project._id + '/pipes?access_token=' + token)
                                    .end(function(e,res){
                                        pipes.push(res.body.data);
                                        superagent.post('https://localhost:8443/api/projects/' + project._id + '/pipes?access_token=' + token)
                                            .end(function(e,res){
                                                pipes.push(res.body.data);
                                                pipe = pipes[0];

                                                var t = new Task({data:{}, type:0, taskID:'hhh'});
                                                t.save(function(err, task) {

                                                   tasks.push(task._id);

                                                    var t = new Task({data:{}, type:0, taskID:'hhh'});
                                                    t.save(function(err, task) {
                                                        tasks.push(task._id);
                                                        var t = new Task({data:{}, type:0, taskID:'hhh'});
                                                        t.save(function(err, task) {
                                                            tasks.push(task._id);
                                                            done();
                                                        });
                                                    });

                                                });

                                            });
                                    });
                            });

                    });
            });
    });

    it('should fail updating a pipe of a project if access token is invalid', function(done){

        superagent.put('https://localhost:8443/api/projects/' + project._id + '/pipes/' + pipe._id + '?access_token=' + 'hhhh')
            .send(pipe)
            .end(function(e,res){
                utils.checkJSendFormat(res.body);
                expect(res.status).toBe(401);
                expect(res.body.status).toBe('fail');
                expect(res.body.data).toBe('Unauthorized');
                done();
            });
    });



    it('should fail updating a pipe of a project if project is non existent', function(done){

        superagent.put('https://localhost:8443/api/projects/' + '12345678bnhjbhj' + '/pipes/' + pipe._id + '?access_token=' + token)
            .send(pipe)
            .end(function(e,res){
                utils.checkJSendFormat(res.body);
                expect(res.status).toBe(404);
                expect(res.body.status).toBe('fail');
                expect(res.body.data).toBe('Not found');
                done();
            });
    });


    it('should fail updating a pipe of a project if pipe is non existent', function(done){

        superagent.put('https://localhost:8443/api/projects/' + project._id + '/pipes/' + 'nkjnjknjknkj' + '?access_token=' + token)
            .send(pipe)
            .end(function(e,res){
                utils.checkJSendFormat(res.body);
                expect(res.status).toBe(404);
                expect(res.body.status).toBe('fail');
                expect(res.body.data).toBe('Not found');
                done();
            });
    });


    it('should fail updating a pipe of a project if pipe 1st task not valid', function(done){

        pipe.tasks.push(utils.createTaskID(false));
        pipe.tasks.push(tasks[0]);

        superagent.put('https://localhost:8443/api/projects/' + project._id + '/pipes/' + pipe._id + '?access_token=' + token)
            .send(pipe)
            .end(function(e,res){
                utils.checkJSendFormat(res.body);
                expect(res.status).toBe(400);
                expect(res.body.status).toBe('fail');
                expect(res.body.data.tasks).toBeDefined();
                expect(res.body.data.tasks).toBe('invalid');
                pipe.tasks.length = 0;
                done();
            });
    });



    it('should fail updating a pipe of a project if pipe n-th task not valid', function(done){

        pipe.tasks.push(tasks[0]);
        pipe.tasks.push(tasks[1]);
        pipe.tasks.push(utils.createTaskID(false));
        pipe.tasks.push(tasks[2]);


        superagent.put('https://localhost:8443/api/projects/' + project._id + '/pipes/' + pipe._id + '?access_token=' + token)
            .send(pipe)
            .end(function(e,res){
                utils.checkJSendFormat(res.body);
                expect(res.status).toBe(400);
                expect(res.body.status).toBe('fail');
                expect(res.body.data.tasks).toBeDefined();
                expect(res.body.data.tasks).toBe('invalid');
                pipe.tasks.length = 0;
                done();
            });
    });

    it('should fail updating a pipe of a project if pipe last task not valid', function(done){

        pipe.tasks.push(tasks[0]);
        pipe.tasks.push(tasks[1]);
        pipe.tasks.push(tasks[2]);
        pipe.tasks.push(utils.createTaskID(false));


        superagent.put('https://localhost:8443/api/projects/' + project._id + '/pipes/' + pipe._id + '?access_token=' + token)
            .send(pipe)
            .end(function(e,res){
                utils.checkJSendFormat(res.body);
                expect(res.status).toBe(400);
                expect(res.body.status).toBe('fail');
                expect(res.body.data.tasks).toBeDefined();
                expect(res.body.data.tasks).toBe('invalid');
                pipe.tasks.length = 0;
                done();
            });
    });


    it('should update a pipe with 3 new tasks', function(done){

        pipe.tasks.push(tasks[0]);
        pipe.tasks.push(tasks[1]);
        pipe.tasks.push(tasks[2]);



        superagent.put('https://localhost:8443/api/projects/' + project._id + '/pipes/' + pipe._id + '?access_token=' + token)
            .send(pipe)
            .end(function(e,res){


                utils.checkJSendFormat(res.body);
                expect(res.status).toBe(200);
                expect(res.body.status).toBe('success');
                expect(res.body.data.tasks).toBeDefined();
                expect(res.body.data.tasks.length).toBe(3);
//                expect(res.body.data.tasks[0]).toBe(pipe.tasks[0]._id);
//                expect(res.body.data.tasks[1]).toBe(pipe.tasks[1]._id);
//                expect(res.body.data.tasks[2]).toBe(pipe.tasks[2]._id);
                expect(res.body.data.modified).not.toBe(pipe.modified);
                pipe = res.body.data;
                done();
            });
    });

    it('should fail updating a pipe if no data is sent', function(done){

        superagent.put('https://localhost:8443/api/projects/' + project._id + '/pipes/' + pipe._id + '?access_token=' + token)
            .end(function(e,res){
                utils.checkJSendFormat(res.body);
                expect(res.status).toBe(400);
                expect(res.body.status).toBe('fail');
                expect(res.body.data.pipe).toBeDefined();
                expect(res.body.data.pipe).toBe('missing');
                done();
            });
    });

    it('should fail updating a pipe if invalid data is sent', function(done){

        superagent.put('https://localhost:8443/api/projects/' + project._id + '/pipes/' + pipe._id + '?access_token=' + token)
            .send(utils.createPipe(false))
            .end(function(e,res){
                utils.checkJSendFormat(res.body);
                expect(res.status).toBe(400);
                expect(res.body.status).toBe('fail');
                expect(res.body.data.pipe).toBeDefined();
                expect(res.body.data.pipe).toBe('invalid');
                done();
            });
    });

    it('should fail updating a pipe when removing existing tasks', function(done){

        pipe.tasks.length = 0;

        superagent.put('https://localhost:8443/api/projects/' + project._id + '/pipes/' + pipe._id + '?access_token=' + token)
            .send(pipe)
            .end(function(e,res){
                utils.checkJSendFormat(res.body);
                expect(res.status).toBe(403);
                expect(res.body.status).toBe('fail');
                expect(res.body.data).toBeDefined('Forbidden');
                done();
            });
    });
});