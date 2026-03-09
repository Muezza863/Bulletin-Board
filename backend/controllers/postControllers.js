import { Post, User } from "../models/index.js";

// @desc    Get all post
// @route   GET /api/post
// @access  Public
const getAllPost = async (req, res) => {
    try {
        const { page = 1, limit = 10, search, category } = req.query;

        // 1. Kumpulkan semua filter pencarian ke dalam satu objek (Query)
        const query = {
            isDeleted: false,
            ...(search ? { title: { $regex: search, $options: 'i' } } : {}),
            ...(category ? { category: category } : {})
        };

        // 2. Siapkan opsi paginasi (biarkan plugin yang mengurus skip, limit, dan sort)
        const options = {
            page: parseInt(page),
            limit: parseInt(limit),
            sort: { createdAt: -1 },
            populate: { path: 'userId', select: 'username' },
            customLabels: {
                totalDocs: 'totalData',
                docs: 'posts', // Data array Anda akan masuk ke label ini
                page: 'currentPage',
                nextPage: 'nextPage',
                prevPage: 'prevPage',
                totalPages: 'totalPages'
            },
        };

        // 3. Eksekusi paginate langsung dari Model (Post), bukan dari variabel array
        const result = await Post.paginate(query, options);

        // 4. Kirim response ke React Anda
        res.status(200).json({
            data: result
        });

    } catch (error) {
        console.error("Error di getAllPost:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// @desc    Get all category
// @route   GET /api/post/category
// @access  Public
const getAllCategory = async (req, res) => {
    try {
        const categories = await Post.aggregate([
            {
                // 1. Hanya hitung postingan yang tidak dihapus (soft delete)
                $match: { isDeleted: false }
            },
            {
                // 2. Kelompokkan berdasarkan field 'category'
                $group: {
                    _id: "$category",      // Nama kategori menjadi ID
                    count: { $sum: 1 }     // Tambahkan 1 untuk setiap dokumen yang ditemukan
                }
            },
            {
                // 3. (Opsional) Urutkan dari jumlah terbanyak atau alfabetis
                $sort: { count: -1 } 
            },
            {
                // 4. (Opsional) Ubah nama field agar lebih rapi di JSON
                $project: {
                    _id: 0,
                    name: "$_id",
                    count: 1
                }
            }
        ]);

        res.status(200).json(categories);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
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
}

// @desc    Get post by id
// @route   GET /api/post/:id
// @access  Public
const getPostById = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        res.status(200).json(post);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
    }
}

// @desc    Create post
// @route   POST /api/post
// @access  Private
const createPost = async (req, res) => {
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
}

// @desc    Update post
// @route   PUT /api/post/:id
// @access  Private
const updatePost = async (req, res) => {
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
}

// @desc    Delete post
// @route   DELETE /api/post/:id
// @access  Private
const deletePost = async (req, res) => {
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
