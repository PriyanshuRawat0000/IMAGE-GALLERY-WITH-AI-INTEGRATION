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


    try {
        const { userId, newUserName, newEmail, newPassword } = req.body;
        if (!userId) return res.status(400).json({ message: "userId is required" });

        const findUser = await User.findById(userId);
        if (!findUser) return res.status(404).json({ message: "USER NOT FOUND" });


        if (newEmail && newEmail !== findUser.email) {
            const emailTaken = await User.findOne({ email: newEmail });
            if (emailTaken) {
                return res.status(400).json({ message: "EMAIL ALREADY IN USE" });
            }
            findUser.email = newEmail;
        }

        if (newUserName) findUser.username = newUserName;


        if (newPassword) {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(newPassword, salt);
            findUser.password = hashedPassword;
        }

        await findUser.save();

        const safeUser = {
            id: findUser._id,
            username: findUser.username,
            email: findUser.email,
        };

        return res.status(200).json({ message: "USER UPDATED", user: safeUser });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "INTERNAL SERVER ERROR" });
    }


}


module.exports = { login, signup, update };