const mongoose = require('mongoose');

// Post schema structure
const postSchema = new mongoose.Schema({
    title: String,
    description: String,
    createdAt: { type: Date, default: Date.now }, // Auto-timestamp
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Reference to User model
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], // Array of users who liked
    comments: [{
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Commenter
        text: String,
        createdAt: { type: Date, default: Date.now } // Comment timestamp
    }]
});

module.exports = mongoose.model('Post', postSchema);
