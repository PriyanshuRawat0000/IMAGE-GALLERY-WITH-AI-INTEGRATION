
const jwt = require('jsonwebtoken');

const loginMiddleware = (req, res, next) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({
            message: "INCOMPLETE CREDENTIALS"
        });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const testEmail = emailRegex.test(email);
    if (!testEmail) {
        return res.status(400).json({
            message: "Invalid format"
        })
    }

    next();
};

const signupMiddleware = (req, res, next) => {
    const { username, email, password } = req.body;
    if (!email || !username || !password) {
        return res.status(400).json({
            message: "INCOMPLETE CREDENTIALS"
        })
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const testEmail = emailRegex.test(email);
    if (!testEmail) {
        return res.status(400).json({
            message: "Invalid format"
        })
    }

    next();

};

const fetchDetailsMiddleware=(req,res,next)=>{
    console.log("hello i am good");
    const token=req.cookies.accessToken;
    if (!token) return res.status(401).json({ message: 'Unauthorized' });
    try{
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        console.log("kon hu mai");
        req.userId = decoded.userId;
    }
    catch(err){
        console.log(err);
        return res.status(500).json({
            message:"Internal Server Error"
        })
    }
    
    next();
}

const updateMiddleware = (req, res, next) => {
    const { currentPassword, newUsername, newEmail, newPassword } = req.body;
    if (!currentPassword) {
        return res.status(400).json({
            message: "Current password is required"
        });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (newEmail) {
        const testNewEmail = emailRegex.test(newEmail);
        if (!testNewEmail) {
            return res.status(400).json({
                message: "Invalid new email format"
            });
        }
    }

    next();
};

const authMiddleware = (req, res, next) => {
    const token=req.cookies.accessToken;

    if (!token) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    

    try {
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        req.userId = decoded.userId;
        next();
    } catch (err) {
        return res.status(401).json({ message: 'Access token expired or invalid' });
    }
};
module.exports = { loginMiddleware, signupMiddleware, updateMiddleware, authMiddleware,fetchDetailsMiddleware };
