const User = require('../models/user.js');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

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


        res.status(200).json({
            message: "LOGIN SUCCESSFUL"
        })
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
    const { email, currentPassword, newUsername, newEmail, newPassword } = req.body;

    try {
        const user = await User.findOne({ email: email });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }


        const passwordCorrect = await bcrypt.compare(currentPassword, user.password);
        if (!passwordCorrect) {
            return res.status(400).json({ message: "Invalid current password" });
        }


        if (newEmail && newEmail !== email) {
            const existingUser = await User.findOne({ email: newEmail });
            if (existingUser) {
                return res.status(400).json({ message: "Email already in use" });
            }
        }

        if (newUsername) user.username = newUsername;
        if (newEmail) user.email = newEmail;
        if (newPassword) {
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(newPassword, salt);
        }

        await user.save();

        res.status(200).json({ message: "User updated successfully" });
    } catch (err) {
        console.error("ERROR DURING UPDATE", err);
        res.status(500).json({ message: "INTERNAL SERVER ERROR" });
    }
}


module.exports = { login, signup, update };