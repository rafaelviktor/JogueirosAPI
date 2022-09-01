const jwt = require('jsonwebtoken')
require('dotenv').config()

function geradorToken(userid) {
    const payload = {
        user: userid
    }

    return jwt.sign(payload, process.env.jwtSecret, {expiresIn: '1h'})
}

module.exports = geradorToken