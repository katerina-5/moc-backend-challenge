const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

module.exports = {
    verifyJWTToken,
    createJWToken,
    hashPassword
};

function verifyJWTToken(token) {
    return new Promise((resolve, reject) => {
        jwt.verify(token, 'test', (err, decodedToken) => {
            if (err || !decodedToken) {
                return reject(err)
            }

            resolve(decodedToken)
        })
    })
}

function createJWToken(data = {}) {
    const token = jwt.sign({
        ...data
    }, 'test');

    return token
}

async function hashPassword(password, next) {
    try {
        const salt = await bcrypt.genSalt(10);
        return await bcrypt.hash(password, salt);
    } catch (error) {
        // Hashing failed error
        next(error);
    }
}
