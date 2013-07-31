/**
 * Created with JetBrains WebStorm.
 * User: admin
 * Date: 31/07/2013
 * Time: 21:01
 * To change this template use File | Settings | File Templates.
 */
module.exports = exports = function lastModifiedPlugin (schema, options) {
    schema.add({ modified: Date })

    schema.pre('save', function (next) {
        this.modified = new Date
        next()
    })

    if (options && options.index) {
        schema.path('modified').index(options.index)
    }
}
