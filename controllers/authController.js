const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// Register a new user
exports.register = async (req, res) => {
    const { username, email, password } = req.body;

    // Hash the password before storing in database
    const hashed = await bcrypt.hash(password, 10);

    // Create a new user instance
    const user = new User({ username, email, password: hashed });

    // Save the user to MongoDB
    await user.save();

    // Respond with success message
    res.status(201).json({ message: "User registered" });
};

// Login an existing user
exports.login = async (req, res) => {
    const { email, password } = req.body;

    // Check if user with this email exists
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    // Compare entered password with hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    // Create JWT token (valid for 1 hour)
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    // Send the token in response
    res.json({ token });
};
