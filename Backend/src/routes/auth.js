const express = require('express');
const router = express.Router();
const { login, signup, update } = require('../controllers/auth.js');
const { loginMiddleware, signupMiddleware, updateMiddleware } = require('../middlewares/authMiddleware.js')

router.get('/login', loginMiddleware, login);
router.post('/signup', signupMiddleware, signup);
router.put('/update', updateMiddleware, update);

module.exports = router;