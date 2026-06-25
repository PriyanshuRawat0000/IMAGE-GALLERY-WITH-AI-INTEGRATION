const express = require('express');
const router = express.Router();
const { login, signup, sendCode, update, refresh, logout ,verify,fetchDetails} = require('../controllers/auth.js');
const { loginMiddleware, signupMiddleware, updateMiddleware, authMiddleware,fetchDetailsMiddleware } = require('../middlewares/authMiddleware.js')

router.post('/login', loginMiddleware, login);
router.post('/signup', signupMiddleware, signup);
router.put('/update', authMiddleware, updateMiddleware, update);
router.post('/refresh', refresh);
router.post('/logout', logout);
router.post('/verify',authMiddleware,verify);
router.post('/fetchDetails',fetchDetailsMiddleware,fetchDetails);
router.post('/saveProfile',authMiddleware,);
router.post('/sendCode',signupMiddleware,sendCode);


module.exports = router;