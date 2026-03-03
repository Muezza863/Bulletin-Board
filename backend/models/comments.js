import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const commentSchema = new Schema({
    userId: {
        type: ObjectId,
        ref: 'User',
        required: true
    },
    postId: {
        type: ObjectId,
        ref: 'Post',
        required: true
    },
    content: {
        type: String,
        required: true,
        maxLength: 500
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

commentSchema.plugin(mongoosePaginate);

const Comment = mongoose.model('Comment', commentSchema);

export default Comment;
