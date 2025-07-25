// Import express to create router
const express = require('express');
const router = express.Router();

// Import register and login controller functions
const { register, login } = require('../controllers/authController');

// Route to register a new user (POST /api/auth/register)
router.post('/register', register);

// Route to log in an existing user (POST /api/auth/login)
router.post('/login', login);

// Export the router so it can be used in app.js or main server file
module.exports = router;
