const express = require('express');
const router = express.Router();
const { login, signup, update } = require('../controllers/auth.js');

router.get('/login', login);
router.post('/signup', signup);
router.put('/update', update);

module.exports = router;