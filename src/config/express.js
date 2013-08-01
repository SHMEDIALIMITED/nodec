
/**
 * Module dependencies.
 */

var express = require('express');
var Models = require('../app/models');
var base64url = require('b64url');
var passport = require('passport');
var BearerStrategy = require('passport-http-bearer').Strategy;


module.exports = function (app, config) {



    app.set('showStackError', true)
    // should be placed before express.static

    app.use(express.compress({
        filter: function (req, res) {
            return /json|text|javascript|css/.test(res.getHeader('Content-Type'));
        },
        level: 9
    }));

    app.use(express.static(config.root + '/public'))

    app.use(express.logger('dev'))

    // set views path, template engine and default layout
    app.set('port', process.env.PORT || 8443);

    app.engine('.html', require('ejs').__express);

    // Optional since express defaults to CWD/views
    app.set('views',  config.root + '/app/views');

    // Without this you would need to
    // supply the extension to res.render()
    // ex: res.render('users.html').
    app.set('view engine', 'html');


    // dynamic helpers
    app.use(express.favicon());
    // cookieParser should be above session
    app.use(express.cookieParser());
    // bodyParser should be above methodOverride
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    // routes should be at the last

    var User = Models.User;
    app.use(passport.initialize());
    passport.use(new BearerStrategy(
        function(token, done) {
            User.findOne({ accessToken: token }, function (err, user) {
                if (err) { return done(err); }
                if (!user) { return done(null, false); }
                return done(null, user, { scope: 'read' });
            });
        }
    ));

    app.configure(function() {
        app.use(app.router);
    });




    // assume "not found" in the error msgs
    // is a 404. this is somewhat silly, but
    // valid, you can do whatever you like, set
    // properties, use instanceof etc.
    app.use(function(err, req, res, next){
        // treat as 404
        if (~err.message.indexOf('not found')) return next()

        // log it
        console.error(err.stack)

        // error page
        res.status(500).render('500', { error: err.stack })
    })

    // assume 404 since no middleware responded
    app.use(function(req, res, next){
        res.status(404).render('404', { url: req.originalUrl })
    })


}