const express = require('express');
const router = express.Router();
const { registerUser, loginUser, googleLogin, githubLogin } = require('../controllers/authController');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/google', googleLogin);
router.post('/github', githubLogin);

module.exports = router;