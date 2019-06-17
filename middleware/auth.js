const libAuth = require('../libs/auth');

module.exports = function (req, res, next) {
    if (req.headers.token) {
        libAuth.verifyJWTToken(req.headers.token)
            .then(() => {
                next();
            })
            .catch(error => {
                next(new Error('Wrong token'))
            })
    } else {
        next(new Error('Token is not found'));
    }
};