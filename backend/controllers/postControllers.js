import { Post, User } from "../models/index.js";

// @desc    Get all post
// @route   GET /api/post
// @access  Public
const getAllPost = async (req, res) => {
    try {
        const { page = 1, limit = 10, search, category } = req.query;

        // Kumpulkan semua filter pencarian ke dalam satu objek (Query)
        const query = {
            isDeleted: false,
            ...(search ? { title: { $regex: search, $options: 'i' } } : {}),
            ...(category ? { category: category } : {})
        };

        // Siapkan opsi paginasi
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
        };

        const result = await Post.paginate(query, options);

        return res.status(200).json({
            data: result
        });

    } catch (error) {
        console.error("[getAllPost]", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

// @desc    Get all category
// @route   GET /api/post/category
// @access  Public
const getAllCategory = async (req, res) => {
    try {
        const categories = await Post.aggregate([
            { $match: { isDeleted: false } },
            { $group: { _id: "$category", count: { $sum: 1 } } },
            { $sort: { count: -1 } },
            { $project: { _id: 0, name: "$_id", count: 1 } }
        ]);

        return res.status(200).json(categories);
    } catch (error) {
        console.error("[getAllCategory]", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}

// @desc    Get my post
// @route   GET /api/post/my-post
// @access  Private
const getMyPost = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const myPosts = await Post.find({ userId: req.user.id })
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        const totalPosts = await Post.countDocuments({ userId: req.user.id });
        const totalPages = Math.ceil(totalPosts / limit);

        return res.status(200).json({
            data: myPosts,
            currentPage: page,
            totalData: totalPosts,
            totalPages: totalPages
        });
    } catch (error) {
        console.error("[getMyPost]", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}

// @desc    Get post by id
// @route   GET /api/post/:id
// @access  Public
const getPostById = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post || post.isDeleted) {
            return res.status(404).json({ message: "Post not found" });
        }
        return res.status(200).json(post);
    } catch (error) {
        console.error("[getPostById]", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}

// @desc    Create post
// @route   POST /api/post
// @access  Private
const createPost = async (req, res) => {
    try {
        const { title, content, category } = req.body;

        if (!title || !content || !category) {
            return res.status(400).json({ message: "Title, content, and category are required" });
        }

        const post = await Post.create({
            userId: req.user.id,
            title,
            content,
            category,
            createdAt: Date.now(),
            updatedAt: Date.now()
        });
        return res.status(201).json(post);
    } catch (error) {
        console.error("[createPost]", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}

// @desc    Update post
// @route   PUT /api/post/:id
// @access  Private
const updatePost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);

        // Check if post exists
        if (!post || post.isDeleted) {
            return res.status(404).json({ message: "Post not found" });
        }

        // Check ownership SEBELUM melakukan perubahan apapun
        if (post.userId.toString() !== req.user.id) {
            return res.status(403).json({ message: "You are not authorized to update this post" });
        }

        // Check if the post was created within the last 24 hours
        const now = new Date();
        const timeDiff = now - post.createdAt;
        const hoursDiff = timeDiff / (1000 * 60 * 60);
        if (hoursDiff > 24) {
            return res.status(400).json({ message: "You can only update your post within 24 hours of creating it." });
        }

        if (!req.body.content) {
            return res.status(400).json({ message: "Content is required" });
        }

        // Update post content
        post.content = req.body.content;
        post.updatedAt = Date.now();
        await post.save();

        return res.status(200).json({ message: "Post updated successfully" });
    } catch (error) {
        console.error("[updatePost]", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}

// @desc    Delete post
// @route   DELETE /api/post/:id
// @access  Private
const deletePost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);

        // Check if post exists
        if (!post || post.isDeleted) {
            return res.status(404).json({ message: "Post not found" });
        }

        // Check ownership menggunakan userId (bukan post.id)
        if (post.userId.toString() !== req.user.id) {
            return res.status(403).json({ message: "You are not authorized to delete this post" });
        }

        // Soft delete
        post.isDeleted = true;
        await post.save();

        return res.status(200).json({ message: "Post deleted successfully" });
        
    } catch (error) {
        console.error("[deletePost]", error);
        return res.status(500).json({ message: "Internal server error" });
    }
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
