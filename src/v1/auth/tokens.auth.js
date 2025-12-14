const jwt = require("jsonwebtoken");

const signTokenPair = ({payload,publicKey,privateKey}) => {
    const accessToken = jwt.sign(payload, privateKey, { algorithm: 'RS256', expiresIn: '15m' });
    const refreshToken = jwt.sign(payload, privateKey, { algorithm: 'RS256', expiresIn: '7d' });

    const decoded = jwt.verify(accessToken, publicKey, { algorithms: ['RS256'] });
    console.log("Decode token with public key: ",decoded);

    return {
        accessToken,
        refreshToken
    };
}


const verifyToken = (token, publicKey) => {
    try{
        const decoded = jwt.verify(token, publicKey, { algorithms: ['RS256'] });
        return decode;
    }
    catch (err) {
        if (err.name === 'TokenExpiredError') {
            return { valid: false, expired: true, decoded: null };
        } else {
            return { valid: false, expired: false, decoded: null };
        }
    };
};

module.exports = {
    signTokenPair,
    verifyToken
};