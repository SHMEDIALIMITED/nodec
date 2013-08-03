/**
 * Created with JetBrains WebStorm.
 * User: admin
 * Date: 03/08/2013
 * Time: 16:29
 * To change this template use File | Settings | File Templates.
 */

module.exports = {
    jsend : function(code, data) {
        var payload = { data : data };

        if(code >= 200 && code < 300) {
            payload.status = 'success';
        }else if(code >= 400 && code < 500) {
            payload.status = "fail";
        } else if(code >= 500 && code < 600){
            payload.status = 'error';
            if(code == 500) payload.data = 'Internal server error';
        }
        return payload
    }
}
