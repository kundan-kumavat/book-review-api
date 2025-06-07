const {Router} = require('express');
const {registerUser, loginUser, refreshAccessToken} = require('../controllers/user.controller.js');

const router = Router();

// Register a new user
router.route('/signup').post(registerUser);

// Authenticate and return a token
router.route('/login').post(loginUser);

// End-point to refresh the Access Token
router.route('/refresh-token').post(refreshAccessToken);

module.exports = router;