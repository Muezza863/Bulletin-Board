import { Post } from "../models/index.js";

// @desc    Like post
// @route   POST /api/post/:id/like
// @access  Private
const likePost = async (req, res, next) => {
    try {
        const post = await Post.findOneAndUpdate(
            { _id: req.params.id, likes: { $ne: req.user.id } },
            {
                $push: { likes: req.user.id },
                $inc: { likeCount: 1 }
            },
            { new: true }
        );

        if (!post) {
            const exists = await Post.exists({ _id: req.params.id });
            if (!exists) {
                return res.status(404).json({ message: "Post not found" });
            }
            return res.status(400).json({ message: "You already liked this post" });
        }

        res.status(200).json({ message: "Post liked successfully" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
    }
    next();
}

// @desc    Unlike post
// @route   POST /api/post/:id/unlike
// @access  Private
const unlikePost = async (req, res, next) => {
    try {
        const post = await Post.findOneAndUpdate(
            { _id: req.params.id, likes: req.user.id },
            {
                $pull: { likes: req.user.id },
                $inc: { likeCount: -1 }
            },
            { new: true }
        );

        if (!post) {
            const exists = await Post.exists({ _id: req.params.id });
            if (!exists) {
                return res.status(404).json({ message: "Post not found" });
            }
            return res.status(400).json({ message: "You haven't liked this post yet" });
        }

        res.status(200).json({ message: "Post unliked successfully" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
    }
    next();
}

export { likePost, unlikePost };
