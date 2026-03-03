import { Comment } from "../models/index.js";


// @desc    Get comment by post id
// @route   GET /api/comment/:postId
// @access  Private
const getCommentByPostId = async (req, res, next) => {
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
        res.status(200).json(result);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
    }
    next();
}


// @desc    Create comment
// @route   POST /api/comment/:postId
// @access  Private
const createComment = async (req, res, next) => {
    try {
        const comment = await Comment.create({
            userId: req.user.id,
            postId: req.params.postId,
            content: req.body.content,
            createdAt: Date.now(),
            updatedAt: Date.now()
        });
        res.status(201).json(comment);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
    }
    next();
}


// @desc    Update comment
// @route   PUT /api/comment/:id
// @access  Private
const updateComment = async (req, res, next) => {
    try {
        const comment = await Comment.findById(req.params.id);
        if (!comment) {
            return res.status(404).json({ message: "Comment not found" });
        }
        comment.content = req.body.content;
        comment.updatedAt = Date.now();
        await comment.save();
        res.status(200).json(comment);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
    }
    next();
}


// @desc    Delete comment
// @route   DELETE /api/comment/:id
// @access  Private
const deleteComment = async (req, res, next) => {
    try {
        const comment = await Comment.findById(req.params.id);
        if (!comment) {
            return res.status(404).json({ message: "Comment not found" });
        }
        if (comment.userId.toString() !== req.user.id) {
            return res.status(403).json({ message: "You are not authorized to delete this comment" });
        }
        await comment.remove();
        res.status(200).json({ message: "Comment deleted successfully" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
    }
    next();
}

const countComment = async (req, res, next) => {
    try {
        const comment = await Comment.countDocuments({ postId: req.params.postId });
        res.status(200).json(comment);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
    }
    next();
}

export { getCommentByPostId, createComment, updateComment, deleteComment, countComment };