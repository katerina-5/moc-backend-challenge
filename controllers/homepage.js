module.exports = {
    getHomePage
}

function getHomePage(req, res, next) {
    res.send('REST API - This is a home page');
}