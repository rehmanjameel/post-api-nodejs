const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    // Get Authorization header (format: Bearer <token>)
    const authHeader = req.headers['authorization'];
    const token = authHeader?.split(' ')[1]; // Extract token part

    if (!token) return res.sendStatus(401); // Unauthorized

    try {
        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Store user ID in req.user
        req.user = decoded.userId;

        // Continue to next middleware/route
        next();
    } catch (err) {
        res.sendStatus(403); // Forbidden - token invalid or expired
    }
};
