const  jwt = require('jsonwebtoken');

function verifyToken(token) {
    let Token = token.substring(7);
    let decoded = jwt.verify(Token, process.env.SECRET);
    return decoded
}

module.exports = verifyToken;