
module.exports = function(config) {

    return {
        index : function(req, res) {
            res.render('index', {layout:false,locals:{
                version:config.version,
                title: 'SH MEDIA', description:'Web App Template'}});
        },

        login : function(req, res) {
            res.render('login', {layout:false, locals: {    version: config.version,
                                                            title: 'Nodec',
                                                            description: 'login'}});
        }
    };
};