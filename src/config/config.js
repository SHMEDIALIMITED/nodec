var fs = require('fs');
module.exports = {
    development: {
      version : JSON.parse(fs.readFileSync('./package.json')).version,
      root: require('path').normalize(__dirname + '/..'),
      app: {
        name: 'Nodec Dev'
      },
      db: 'mongodb://localhost/nodec'
      
    },
    test: {
        version : JSON.parse(fs.readFileSync('./package.json')).version,
        root: require('path').normalize(__dirname + '/..'),
        app: {
            name: 'Nodec Test'
        },
        db: 'mongodb://localhost/nodec-test'

    },
    production: {
      version : JSON.parse(fs.readFileSync('./package.json')).version,
      root: require('path').normalize(__dirname + '/..'),
      app: {
        name: 'Web App'
      },
      db: process.env.MONGOLAB_URI


    }
}