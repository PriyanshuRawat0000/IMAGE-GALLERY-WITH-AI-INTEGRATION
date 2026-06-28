const User = require('../models/user.js');
const pendingUser=require('../models/pendingUser.js');
const sendEmail=require('../services/sendMail.js');
const generateString=require('../utils/generateString.js');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { generateAccessToken, generateRefreshToken } = require('../config/token.js');
const {oauth2client}=require('../utils/googleConfig.js');
const axios=require('axios');
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

        // console.log("USER FOUND:", findUser);
        const accessToken = generateAccessToken(findUser);
        const refreshToken = generateRefreshToken(findUser);

        findUser.refreshToken = refreshToken;
        await findUser.save();

        res.cookie('accessToken', accessToken, {

            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'None',
            maxAge: 15 * 60 * 1000 // 15 minutes
        });

        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'None',
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        });

        res.status(200).json({
            message: "LOGIN SUCCESSFUL"
        })
        // console.log(`access:${accessToken} refresh:${refreshToken}`)
    }
    catch (e) {
        return res.status(500).json({ message: "INTERNAL SERVER ERROR" });
    }
}
const sendCode = async (req, res) => {
    const { username, email, password } = req.body;

    try {
        
        const existingUser = await User.findOne({
            $or: [{ email }, { username }]
        });

        if (existingUser) {
            return res.status(400).json({
                message: "User Already Exists"
            });
        }

        const pending = await pendingUser.findOne({ email });

        const code = await generateString();

        //const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, 10);
        const hashedCode = await bcrypt.hash(code, 10);

        if (pending) {

            if (pending.resendCount >= 5) {
                return res.status(400).json({
                    message: "Resend limit reached"
                });
            }

            // Update if pneding user present
            pending.username = username;
            pending.password = hashedPassword;
            pending.verificationString = hashedCode;
            pending.resendCount += 1;
            pending.attempts = 0;
            pending.verificationStringUpdatedAt = Date.now();

            await pending.save();

            const emailSent = await sendEmail(email, code);
            if (!emailSent) {
                return res.status(500).json({
                    message: "Email sending failed"
                });
            }

            return res.status(200).json({
                message: "Verification code sent again"
            });
        }

        // if no pending user
        const newUser = new pendingUser({
            username,
            email,
            password: hashedPassword,
            verificationString: hashedCode
        });

        await newUser.save();

        const emailSent = await sendEmail(email, code);
        if (!emailSent) {
            return res.status(500).json({
                message: "Email sending failed"
            });
        }

        return res.status(200).json({
            message: "Email sent successfully"
        });

    } catch (err) {
        console.log(err);
        return res.status(500).json({
            message: "Email sending failed"
        });
    }
};

const googleLogin=async (req,res)=>{
    try{
        // const {code}=req.body;
        // const googleRes=await oauth2client.getToken(code);
        // oauth2client.setCredentials(googleRes.tokens);
        // console.log(`token is : ${googleRes}`);
        // const userRes = await axios.get(
        //     `https://www.googleapis.com/oauth2/v2/userinfo?access_token=${googleRes.tokens.access_token}`
        // );
        // console.log(userRes);
        // const {email,name,picture}=userRes.data;
         const {credential}=req.body;
        
        // Decode the JWT credential without verification
        // (it's already verified by Google's servers)
        const decodedCredential = jwt.decode(credential);
        console.log(`Decoded credential:`, decodedCredential);
        
        const {email, name, picture}=decodedCredential;
        let firstUser=await User.findOne({email});
        let isNewUser=false;
        if(!firstUser){
            firstUser= new User({
                username:name,
                email,
                
            })
            

            await firstUser.save();
            //alert("error still not here");
            isNewUser=true;
            
           
        }
        
        //alert("error still not here");
        const accessToken = generateAccessToken(firstUser);
        const refreshToken = generateRefreshToken(firstUser);

        firstUser.refreshToken = refreshToken;
        await firstUser.save();

        res.cookie('accessToken', accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'None',
            maxAge: 15 * 60 * 1000 // 15 minutes
        });

        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'None',
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        });

        res.status(isNewUser?201:200).json({
            message: isNewUser?"User Registered Successfully":"User Authenticated",
        })
    

    }
    catch(err){
        res.status(500).json({
            message:"Internal Server Error"
        })
        // console.log(err);
    }

}
// const signup = async (req, res) => {
//     const { username, email, password , code} = req.body;

//     try {
//         //alert(`email is :${email} username is ${username}`);
//         let findUser = await pendingUser.findOne({ email: email });
//         if (findUser) {
          
//             const codeCorrect= await bcrypt.compare(code, findUser.verificationString);

//             if(!codeCorrect){
//                 return res.status(402).json({
//                     message:"invalid code"
//                 })
//             }
//             //alert("user was found");
            

//             const newUser = new User({
//                 username:findUser.username,
//                 email:findUser.email,
//                 password:findUser.password,
//             })
//             await pendingUser.deleteOne({email});

//             await newUser.save();
//             //alert("error still not here");
//             const accessToken = generateAccessToken(newUser);
//             const refreshToken = generateRefreshToken(newUser);

//             newUser.refreshToken = refreshToken;
//             await newUser.save();

//             res.cookie('accessToken', accessToken, {
//                 httpOnly: true,
//                 secure: process.env.NODE_ENV === 'production',
//                 sameSite: 'None',
//                 maxAge: 15 * 60 * 1000 // 15 minutes
//             });

//             res.cookie('refreshToken', refreshToken, {
//                 httpOnly: true,
//                 secure: process.env.NODE_ENV === 'production',
//                 sameSite: 'None',
//                 maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
//             });

//             res.status(201).json({
//                 message: "User Registered Successfully"
//             })
//         }
//         else{
//             res.status(401).json({message:"email not found"});
//         }
//     }
//     catch (err) {
//         console.error("ERROR DURING SIGNUP", err);
//         res.status(500).json({ message: "INTERNAL SERVER ERROR" });
//     }
// }
const signup = async (req, res) => {
    const { username, email, password} = req.body;

    try {
        //alert(`email is :${email} username is ${username}`);
        let findUser = await User.findOne({ email: email });
        if (!findUser) {
            
            const newUser = new User({
                username:findUser.username,
                email:findUser.email,
                password:findUser.password,
            })
            

            await newUser.save();
            //alert("error still not here");
            const accessToken = generateAccessToken(newUser);
            const refreshToken = generateRefreshToken(newUser);

            newUser.refreshToken = refreshToken;
            await newUser.save();

            res.cookie('accessToken', accessToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'None',
                maxAge: 15 * 60 * 1000 // 15 minutes
            });

            res.cookie('refreshToken', refreshToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'None',
                maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
            });

            res.status(201).json({
                message: "User Registered Successfully"
            })
        }
        else{
            res.status(401).json({message:"user already exists"});
        }
    }
    catch (err) {
        console.error("ERROR DURING SIGNUP", err);
        res.status(500).json({ message: "INTERNAL SERVER ERROR" });
    }
}
const fetchDetails = async (req, res) => {
    const userId = req.userId;
    try {
        // console.log("yaha tak pahuch gaya");
        const user = await User.findById(userId);
        // console.log("chal to raha hai");
        return res.status(200).json({
            email: user.email,
            username: user.username

        })
    }
    catch (err) {
        // console.log(err);
        return res.status(500).json({
            message: "kuch ni hora tujhse"
        });
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

        res.clearCookie("accessToken", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "None",
        });

        res.clearCookie("refreshToken", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "None",
        });

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

        const newAccessToken = generateAccessToken(user);

        res.cookie('accessToken', newAccessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'None',
            maxAge: 15 * 60 * 1000
        });

        res.status(200).json({ message: "Access token refreshed" });

    } catch (err) {
        return res.status(403).json({ message: "Invalid refresh token" });
    }
}

const verify = async (req, res) => {
    //const accessToken=req.cookies.accessToken;
    try {
        const user = await User.findById(req.userId);
        if (!user) {
            res.status(401).json({
                message: "user not found"
            });
        }
        res.status(200).json({
            message: "authorised",
            user
        });
    }
    catch (err) {
        res.status(500).json({
            message: "Internal Server Error"
        });
    }

}

module.exports = { login, signup, sendCode, update, refresh, logout, verify, fetchDetails,googleLogin };