
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
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        req.userId = decoded.userId;
        next();
    } catch (err) {
        return res.status(401).json({ message: 'Access token expired or invalid' });
    }
};
module.exports = { loginMiddleware, signupMiddleware, updateMiddleware, authMiddleware };
