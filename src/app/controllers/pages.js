
module.exports = function(config) {
	var api = {};

	api.index = function(req, res) {
		res.render('index', {layout:false,locals:{
			version:config.version, 
			title: 'SH MEDIA', description:'Web App Template'}});
	}

	api.canvas = function(req, res) {
		res.redirect('/');
	}
	return api;
}