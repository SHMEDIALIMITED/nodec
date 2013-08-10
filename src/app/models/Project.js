/**
 * Created with JetBrains WebStorm.
 * User: admin
 * Date: 10/08/2013
 * Time: 19:12
 * To change this template use File | Settings | File Templates.
 */
var mongoose = require('mongoose'),
    uuid = require('node-uuid'),
    Schema = mongoose.Schema;
var crypto = require('crypto');
var AbstractModel = require('./AbstractModel');

var Project = new Schema({
    name: {type:String},
    pipes : [Schema.Types.ObjectId],
    collaborators : [Schema.Types.ObjectId],
    jobs : [Schema.Types.ObjectId]
});

Project.plugin(AbstractModel, {index:true});

module.exports =  mongoose.model('Project', Project);