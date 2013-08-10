/**
 * Created with JetBrains WebStorm.
 * User: admin
 * Date: 10/08/2013
 * Time: 15:41
 * To change this template use File | Settings | File Templates.
 */

var createPassword = function(valid) {
    var pw = Math.random().toString();
    if(valid) return 'Pw' + pw.substr(2,6);
    return pw;
}

var createEmail = function(valid) {
    if(valid) return createPassword() + '@test.com';
    return createPassword() + 'test.com';
}

var createProjectName = function(valid) {
    if(valid) {
        var text = "";
        var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

        for( var i=0; i < 5; i++ )
            text += possible.charAt(Math.floor(Math.random() * possible.length));
        return text;
    }
    return '';
}

var checkJSendFormat = function(body) {
    expect(body.status).not.toBeUndefined();
    expect(body.data).not.toBeUndefined();
}



module.exports = {

    admin : {
        email: 'p@t.com',
        password : '1234'
    },

    createPassword : createPassword,
    createEmail : createEmail,
    checkJSendFormat : checkJSendFormat,
    createProjectName : createProjectName
}
