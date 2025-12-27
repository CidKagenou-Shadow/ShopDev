const jwt = require("jsonwebtoken");

const signTokenPair = ({payload,publicKey,privateKey}) => {
    const accessToken = jwt.sign(payload, privateKey, { algorithm: 'RS256', expiresIn: '15m' });
    const refreshToken = jwt.sign(payload, privateKey, { algorithm: 'RS256', expiresIn: '7d' });

    return {
        accessToken,
        refreshToken
    };
}

const verfifyToken = (token, secretKey) => {
    const decoded = jwt.verify(token, secretKey);
    return decoded;
}

module.exports = {
    signTokenPair,
    verfifyToken
};
