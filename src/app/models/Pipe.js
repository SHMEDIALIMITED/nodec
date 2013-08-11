/**
 * Created with JetBrains WebStorm.
 * User: admin
 * Date: 10/08/2013
 * Time: 19:12
 * To change this template use File | Settings | File Templates.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    AbstractModel = require('./AbstractModel');

var Pipe = new Schema({
    tasks: [Schema.Types.ObjectId]
});

Pipe.plugin(AbstractModel, {index:true});

module.exports =  mongoose.model('Pipe', Pipe);