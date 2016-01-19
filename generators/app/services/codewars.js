
var request = require('request-promise');

var codewarsUrl = 'https://www.codewars.com/api/v1';

var CodewarsService = function() {

};

CodewarsService.prototype.getKata = function(idOrSlug, callback) {
    if (!idOrSlug) {
        return callback(new Error('Please specify a kata ID or slug'));
    }
    request({
        uri: codewarsUrl + '/code-challenges/' + idOrSlug,
        json: true
    })
    .then(function(response) {
        callback(null, response);
    })
    .catch(callback);
};

module.exports = CodewarsService;
