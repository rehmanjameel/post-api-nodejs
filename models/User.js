const mongoose = require('mongoose');

// User schema structure
const userSchema = new mongoose.Schema({
    username: String,
    email: String,
    password: String // Hashed password
});

module.exports = mongoose.model('User', userSchema);
