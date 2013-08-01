/**
 * Created with JetBrains WebStorm.
 * User: admin
 * Date: 01/08/2013
 * Time: 01:50
 * To change this template use File | Settings | File Templates.
 */
var readline = require('readline'),
    rl = readline.createInterface(process.stdin, process.stdout);


var promts = [  'Enter admin email address: ',
                'Enter admin password: ']

function setPrompt() {
    rl.setPrompt(promts[index]);
    rl.prompt();
    index++;
}

var env = process.env.NODE_ENV || 'development'
    , config = require('./config/config')[env]
    , mongoose = require('mongoose');
mongoose.connect(config.db)

var User = require('./app/models').User;
var user = new User({email:'', password:''})

var index = 0;
setPrompt();

rl.on('line', function(line) {

    switch(index) {
        case 1 : user.email = line.trim(); break;
        case 2 : user.password = line.trim();
                user.save(function(err, user) {
                   if(err) console.error(err);
                   else console.log('Admin added:', user.email);

                });
                return;
            break;
    }
    console.log('---------');
    setPrompt();


}).on('close', function() {
        console.log('As Buddha said: "Attaching to THINGS brings suffering only. Stay independent."');
        process.exit(0);
    });