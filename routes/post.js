// Import express to create router
const express = require('express');
const router = express.Router();

// Import authentication middleware to protect routes
const auth = require('../middleware/authMidleWare');

// Import post-related controller functions
const { createPost, getPosts, commentPost, likePost, updateComment, updatePost, deletePost, deleteComment }
    = require('../controllers/postController');

// Create a new post (POST /api/posts)
// Requires user to be authenticated
router.post('/createPost', auth, createPost);

// Get all posts (GET /api/posts)
// Requires user to be authenticated
router.get('/getPosts', auth, getPosts);

// Comment on a specific post by ID (POST /api/posts/:id/comment)
// Requires user to be authenticated
router.post('/:id/comment', auth, commentPost);

// Like a specific post by ID (POST /api/posts/:id/like)
// Requires user to be authenticated
router.post('/:id/like', auth, likePost);

// Update and delete post
router.put('/updatePost/:id', auth, updatePost);
router.delete('/deletePost/:id', auth, deletePost);

// Update and delete comment
router.put('/updateComment/:id/:commentId', auth, updateComment);
router.delete('/deleteComment/:id/:commentId', auth, deleteComment);

// Export the router
module.exports = router;
