const jwt = require("jsonwebtoken");
const { findKeyByUserId } = require("../../services/auth/key.services");


const authenticateToken = async (req,res,next) => {
    const authHeader = req.headers['authorization'];

    if (!authHeader) return res.sendStatus(401);

    const token = authHeader && authHeader.split(' ')[1];

    if (!token) return res.sendStatus(401);

    if (token == null) return res.sendStatus(401); // if there isn't any token

    userId = req.headers['x-user-id'];

    const keyStore = await findKeyByUserId(userId);

    console.log("keyStore:", keyStore);

    if(!keyStore){
        console.log("KeyStore not found !!!");
        return res.sendStatus(403);
    }

    const decoded = jwt.verify(token, keyStore.publicKey, { algorithms: ['RS256'] });

    console.log("decoded:", decoded);

    if (!decoded) {
        console.log("Invalid token !!!");
        return res.sendStatus(403);
    }

    req.user = decoded.payload;

    next();
    
}


module.exports = authenticateToken;