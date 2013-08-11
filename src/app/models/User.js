/**
 * Created with JetBrains WebStorm.
 * User: admin
 * Date: 31/07/2013
 * Time: 20:57
 * To change this template use File | Settings | File Templates.
 */
var mongoose = require('mongoose'),
    uuid = require('node-uuid'),
    Schema = mongoose.Schema;
var crypto = require('crypto');
var AbstractModel = require('./AbstractModel');


var User = new Schema({
    email: { type: String, required: true, unique: true, trim: true, lowercase: true },
    password: { type: String, required: true, set: encryptPassword},
    salt : { type:String, default: uuid.v1},
    level: { type: Number, default:0 },
    resetToken: {type:String, default:''},
    accessToken: {type:String, default:''},
});

User.plugin(AbstractModel, {index:true});

User.methods.isValidPassword = function(passwordString) {
    return this.password === hash(passwordString, this.salt);
};

User.methods.login = function(passwordString, cb) {
    if(this.password === hash(passwordString, this.salt)) {
        this.accessToken = uuid.v4();
        this.save(cb);
    }else {
        cb({code:401, message:'Unauthorized'});
    }

};

User.methods.logout = function(cb) {
    this.accessToken = '';
    this.save(cb)
};

function hash(password, salt) {
    return crypto.createHmac('sha256', salt).update(password).digest('hex');
}

function encryptPassword(password) {
    return hash(password, this.salt);
}

User.options.toJSON = {};
User.options.toJSON.transform = function (user, ret, options) {
    // remove the _id of every document before returning the result
    delete ret.password;
    delete ret.salt;
    delete ret.resetToken;
    delete ret.accessToken;
    delete ret.__v;
}

module.exports =  mongoose.model('User', User);
