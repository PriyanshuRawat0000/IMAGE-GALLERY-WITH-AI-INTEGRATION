

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
    const {  username,email, password } = req.body;
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
    const { email, username, password } = req.body;
    if (!email && !username && !password) {
        return res.status(400).json({
            message: "INCOMPLETE CREDENTIALS"
        })
    }
    if (email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const testEmail = emailRegex.test(email);
        if (!testEmail) {
            return res.status(400).json({
                message: "Invalid format"
            })
        }
    }


    next();

};

module.exports = { loginMiddleware, signupMiddleware, updateMiddleware };
