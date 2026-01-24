const User = require('../models/user.js');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { generateAccessToken, generateRefreshToken } = require('../config/token.js');

const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const findUser = await User.findOne({ email: email });
        if (!findUser) {
            return res.status(400).json({ message: "INVALID CREDENTIALS" });
        }
        const passwordCorrect = await bcrypt.compare(password, findUser.password);
        if (!passwordCorrect) {
            return res.status(400).json({ message: "INVALID CREDENTIALS" });
        }

        const accessToken = generateAccessToken(findUser._id);
        const refreshToken = generateRefreshToken(findUser._id);

        findUser.refreshToken = refreshToken;
        await findUser.save();

        res.cookie('accessToken', accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 15 * 60 * 1000 // 15 minutes
        });

        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        });

        res.status(200).json({
            message: "LOGIN SUCCESSFUL"
        })
        console.log(`access:${accessToken} refresh:${refreshToken}`)
    }
    catch (e) {
        return res.status(500).json({ message: "INTERNAL SERVER ERROR" });
    }
}

const signup = async (req, res) => {
    const { username, email, password } = req.body;

    try {
        let findUser = await User.findOne({ $or: [{ email: email }, { username: username }] });
        if (findUser) {
            return res.status(400).json({
                message: "User Already Exists"
            });
        }
        else {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);

            const newUser = new User({
                username,
                email,
                password: hashedPassword
            })

            await newUser.save();

            const accessToken = generateAccessToken(newUser._id);
            const refreshToken = generateRefreshToken(newUser._id);

            newUser.refreshToken = refreshToken;
            await newUser.save();

            res.cookie('accessToken', accessToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                maxAge: 15 * 60 * 1000 // 15 minutes
            });

            res.cookie('refreshToken', refreshToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
            });

            res.status(201).json({
                message: "User Registered Successfully"
            })
        }
    }
    catch (err) {
        console.error("ERROR DURING SIGNUP", err);
        res.status(500).json({ message: "INTERNAL SERVER ERROR" });
    }
}

const update = async (req, res) => {
    const { currentPassword, newUsername, newEmail, newPassword } = req.body;

    try {
        const user = await User.findById(req.userId);
        if (!user) return res.status(404).json({ message: 'User not found' });

        const passwordCorrect = await bcrypt.compare(currentPassword, user.password);
        if (!passwordCorrect) return res.status(400).json({ message: 'Invalid current password' });

        if (newEmail && newEmail !== user.email) {
            const existingUser = await User.findOne({ email: newEmail });
            if (existingUser) return res.status(400).json({ message: 'Email already in use' });
            user.email = newEmail;
        }

        if (newUsername) user.username = newUsername;
        if (newPassword) {
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(newPassword, salt);
        }

        await user.save();
        return res.status(200).json({ message: 'User updated successfully' });
    } catch (err) {
        console.error('ERROR DURING UPDATE', err);
        return res.status(500).json({ message: 'INTERNAL SERVER ERROR' });
    }
};



const logout = async (req, res) => {
    const { refreshToken } = req.cookies;

    try {
        if (refreshToken) {
            const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
            const user = await User.findById(decoded.userId);
            if (user) {
                user.refreshToken = null;
                await user.save();
            }
        }

        res.clearCookie('accessToken');
        res.clearCookie('refreshToken');

        res.status(200).json({ message: "Logout successful" });
    } catch (err) {
        console.error("ERROR DURING LOGOUT", err);
        res.status(500).json({ message: "INTERNAL SERVER ERROR" });
    }
}



const refresh = async (req, res) => {
    const { refreshToken } = req.cookies;

    if (!refreshToken) {
        return res.status(401).json({ message: "Refresh token not provided" });
    }

    try {
        const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
        const user = await User.findById(decoded.userId);

        if (!user || user.refreshToken !== refreshToken) {
            return res.status(403).json({ message: "Invalid refresh token" });
        }

        const newAccessToken = generateAccessToken(user._id);

        res.cookie('accessToken', newAccessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 15 * 60 * 1000
        });

        res.status(200).json({ message: "Access token refreshed" });
        
    } catch (err) {
        return res.status(403).json({ message: "Invalid refresh token" });
    }
}


module.exports = { login, signup, update, refresh, logout };