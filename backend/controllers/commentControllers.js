import { Comment } from "../models/index.js";


// @desc    Get comment by post id
// @route   GET /api/post/:postId/comment
// @access  Public
const getCommentByPostId = async (req, res) => {
    try {
        const { page = 1 } = req.query;

        const options = {
            page: parseInt(page),
            limit: 10,
            sort: { createdAt: -1 },
            populate: { path: 'userId', select: 'username' },
            customLabels: {
                totalDocs: 'totalData',
                docs: 'comments'
            },
        }
        const result = await Comment.paginate({ postId: req.params.postId }, options);
        return res.status(200).json(result);
    } catch (error) {
        console.error("[getCommentByPostId]", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}


// @desc    Create comment
// @route   POST /api/post/:postId/comment
// @access  Private
const createComment = async (req, res) => {
    try {
        const { content } = req.body;

        if (!content) {
            return res.status(400).json({ message: "Comment content is required" });
        }

        const comment = await Comment.create({
            userId: req.user.id,
            postId: req.params.postId,
            content,
            createdAt: Date.now(),
            updatedAt: Date.now()
        });
        return res.status(201).json(comment);
    } catch (error) {
        console.error("[createComment]", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}


// @desc    Update comment
// @route   PUT /api/comment/:id
// @access  Private
const updateComment = async (req, res) => {
    try {
        const comment = await Comment.findById(req.params.id);
        if (!comment) {
            return res.status(404).json({ message: "Comment not found" });
        }

        // Check ownership sebelum update
        if (comment.userId.toString() !== req.user.id) {
            return res.status(403).json({ message: "You are not authorized to update this comment" });
        }

        if (!req.body.content) {
            return res.status(400).json({ message: "Comment content is required" });
        }

        comment.content = req.body.content;
        comment.updatedAt = Date.now();
        await comment.save();
        return res.status(200).json(comment);
    } catch (error) {
        console.error("[updateComment]", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}


// @desc    Delete comment
// @route   DELETE /api/comment/:id
// @access  Private
const deleteComment = async (req, res) => {
    try {
        const comment = await Comment.findById(req.params.id);
        if (!comment) {
            return res.status(404).json({ message: "Comment not found" });
        }
        if (comment.userId.toString() !== req.user.id) {
            return res.status(403).json({ message: "You are not authorized to delete this comment" });
        }
        // Ganti comment.remove() (deprecated) dengan deleteOne()
        await comment.deleteOne();
        return res.status(200).json({ message: "Comment deleted successfully" });
    } catch (error) {
        console.error("[deleteComment]", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}

const countComment = async (req, res) => {
    try {
        const count = await Comment.countDocuments({ postId: req.params.postId });
        return res.status(200).json({ count });
    } catch (error) {
        console.error("[countComment]", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}

export { getCommentByPostId, createComment, updateComment, deleteComment, countComment };