const Post = require('../models/Post');

// Create a new post
exports.createPost = async (req, res) => {
    const { title, description } = req.body;

    // Create post with current logged-in user as owner
    const post = new Post({ title, description, owner: req.user });

    // Save post to database
    await post.save();

    res.status(201).json(post);
};

// Get all posts, sorted by likes and creation date
exports.getPosts = async (req, res) => {
    const posts = await Post.aggregate([
        {
            $addFields: {
                likeCount: { $size: "$likes" }
            }
        },
        {
            $sort: { likeCount: -1, createdAt: -1 }
        }
    ]);

    // Populate 'owner' manually (not available in aggregate)
    const populatedPosts = await Post.populate(posts, { path: "owner" });

    res.json(populatedPosts);
};


// Add comment to a post
exports.commentPost = async (req, res) => {
    const post = await Post.findById(req.params.id);

    // Prevent user from commenting on own post
    if (post.owner.toString() === req.user)
        return res.status(403).json({ message: "Can't comment on own post" });

    // Push the comment into the post
    post.comments.push({
        user: req.user,
        text: req.body.text
    });

    await post.save();

    res.json(post);
};

// Like a post
exports.likePost = async (req, res) => {
    const post = await Post.findById(req.params.id);

    // Prevent user from liking their own post
    if (post.owner.toString() === req.user)
        return res.status(403).json({ message: "Can't like own post" });

    // Add user to likes array only if not already liked
    if (!post.likes.includes(req.user)) {
        post.likes.push(req.user);
        await post.save();
    }

    res.json(post);
};

// Update a post (only owner can update)
exports.updatePost = async (req, res) => {
    const { title, description } = req.body;
    const post = await Post.findById(req.params.id);

    if (!post) return res.status(404).json({ message: "Post not found" });
    if (post.owner.toString() !== req.user) return res.status(403).json({ message: "Unauthorized" });

    post.title = title ?? post.title;
    post.description = description ?? post.description;
    await post.save();

    res.json(post);
};

// Delete a post (only owner can delete)
exports.deletePost = async (req, res) => {
    const post = await Post.findById(req.params.id);

    if (!post) return res.status(404).json({ message: "Post not found" });
    if (post.owner.toString() !== req.user) return res.status(403).json({ message: "Unauthorized" });

    await post.deleteOne();
    res.json({ message: "Post deleted" });
};

// Update a comment (only commenter can update)
exports.updateComment = async (req, res) => {
    const post = await Post.findById(req.params.id);
    const comment = post.comments.id(req.params.commentId);

    if (!comment) return res.status(404).json({ message: "Comment not found" });
    if (comment.user.toString() !== req.user) return res.status(403).json({ message: "Unauthorized" });

    comment.text = req.body.text ?? comment.text;
    await post.save();

    res.json(post);
};

// Delete a comment (only commenter can delete)
exports.deleteComment = async (req, res) => {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    const comment = post.comments.id(req.params.commentId);
    if (!comment) return res.status(404).json({ message: "Comment not found" });

    if (comment.user.toString() !== req.user)
        return res.status(403).json({ message: "Unauthorized" });

    // ✅ Correct way to remove a comment from the array
    post.comments.pull(comment._id);

    await post.save();

    res.json({ message: "Comment deleted" });
};

