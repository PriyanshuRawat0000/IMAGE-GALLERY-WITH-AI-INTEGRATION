const jwt = require('jsonwebtoken');


const imageMiddleware = (req, res, next) => {
    const token=req.cookies.accessToken;

    if (!token) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    

    try {
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        req.userId = decoded.userId;
        console.log("hydrogen");
        req.email=decoded.email;
        next();
    } catch (err) {
        return res.status(401).json({ message: 'Access token expired or invalid' });
    }
};

module.exports = { imageMiddleware};