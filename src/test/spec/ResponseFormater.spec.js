/**
 * Created with JetBrains WebStorm.
 * User: admin
 * Date: 03/08/2013
 * Time: 16:54
 * To change this template use File | Settings | File Templates.
 */

var formater = require('../../app/controllers/utils/ResponseFormater');



describe('ResponseFormater', function() {

    describe('jsend method', function() {

        it('should be defined', function() {
            expect(formater.jsend).toBeDefined();
            expect(typeof formater.jsend).toBe('function');
        });

        it('should set status to success if status code is in range of 200-299', function(){
            var i = 300;
            while(--i > 199) {
                expect(formater.jsend(i, {}).status).toBe('success');
            }
        });

        it('should set status to fail if status code is in range of 400-499', function(){
            var i = 500;
            while(--i > 399) {
                expect(formater.jsend(i, {}).status).toBe('fail');
            }
        });

        it('should set status to error if status code is in range of 500-599', function(){
            var i = 600;
            while(--i > 499) {
                expect(formater.jsend(i, {}).status).toBe('error');
            }
        });

        it('should set status to error and data to "Internal server error" if status is 500', function(){
            var payload = formater.jsend(500, {});
            expect(payload.status).toBe('error');
            expect(payload.data).toBe('Internal server error');
        });

    });
});

