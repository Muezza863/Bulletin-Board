import { Post, User } from "../models/index.js";

// @desc    Get all post
// @route   GET /api/post
// @access  Private
const getAllPost = async (req, res, next) => {
    try {
        const { page = 1, limit = 10, search, category } = req.query;
        const skip = (page - 1) * limit;

        const posts = await Post.find({ isDeleted: false, ...(search ? { title: { $regex: search, $options: 'i' } } : {}), ...(category ? { category: category } : {}) }).populate('userId', 'username').sort({ createdAt: -1 }).skip(skip).limit(limit);

        const totalPosts = await Post.countDocuments({ isDeleted: false, ...(search ? { title: { $regex: search, $options: 'i' } } : {}), ...(category ? { category: category } : {}) });
        const totalPages = Math.ceil(totalPosts / limit);

        const options = {
            page: parseInt(page),
            limit: parseInt(limit),
            sort: { createdAt: -1 },
            populate: { path: 'userId', select: 'username' },
            customLabels: {
                totalDocs: 'totalData',
                docs: 'posts',
                page: 'currentPage',
                nextPage: 'nextPage',
                prevPage: 'prevPage',
                totalPages: 'totalPages'
            },
        }

        const result = await posts.paginate(options);
        res.status(200).json({
            data: result
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
    }
    next();
}

// @desc    Get all category
// @route   GET /api/post/category
// @access  Private
const getAllCategory = async (req, res, next) => {
    try {
        const categories = await Post.distinct('category');
        res.status(200).json(categories);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
    }
    next();
}

// @desc    Get my post
// @route   GET /api/post/my-post
// @access  Private
const getMyPost = async (req, res, next) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const myPosts = await Post.find({ userId: req.user.id }).sort({ createdAt: -1 }).skip(skip).limit(limit);

        const totalPosts = await Post.countDocuments({ userId: req.user.id });
        const totalPages = Math.ceil(totalPosts / limit);

        res.status(200).json({
            data: myPosts,
            currentPage: page,
            totalData: totalPosts,
            totalPages: totalPages
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
    }
    next();
}

// @desc    Get post by id
// @route   GET /api/post/:id
// @access  Private
const getPostById = async (req, res, next) => {
    try {
        const post = await Post.findById(req.params.id);
        res.status(200).json(post);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
    }
    next();
}

// @desc    Create post
// @route   POST /api/post
// @access  Private
const createPost = async (req, res, next) => {
    try {
        const post = await Post.create({
            userId: req.user.id,
            title: req.body.title,
            content: req.body.content,
            category: req.body.category,
            createdAt: Date.now(),
            updatedAt: Date.now()
        });
        res.status(201).json(post);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
    }
    next();
}

// @desc    Update post
// @route   PUT /api/post/:id
// @access  Private
const updatePost = async (req, res, next) => {
    try {
        const post = await Post.findById(req.params.id);
        // Check if post is exist
        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }

        // Check if the post was created within the last 24 hours
        const now = new Date();
        const timeDiff = now - post.createdAt;
        const hoursDiff = timeDiff / (1000 * 60 * 60);
        if (hoursDiff > 24) {
            return res.status(400).json({ message: "You can only update your post within 24 hours of creating it." });
        }

        // Just update post content
        post.content = req.body.content;
        post.updatedAt = Date.now();
        await post.save();

        res.status(200).json({ message: "Post updated successfully" });


        // Check if the post was created by the authenticated user
        if (post.id !== req.user.id) {
            return res.status(403).json({ message: "You are not authorized to update this post" });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
    }
    next();
}

// @desc    Delete post
// @route   DELETE /api/post/:id
// @access  Private
const deletePost = async (req, res, next) => {
    try {
        const post = await Post.findById(req.params.id);
        // Check if post is exist
        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }

        // Check if the post was created by the authenticated user
        if (post.id !== req.user.id) {
            return res.status(403).json({ message: "You are not authorized to delete this post" });
        }

        // Just delete post
        post.isDeleted = true;
        await post.save();

        res.status(200).json({ message: "Post deleted successfully" });
        
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
    }
    next();
}


export { 
    getAllPost, 
    getAllCategory, 
    getMyPost, 
    getPostById, 
    createPost, 
    updatePost, 
    deletePost
};
