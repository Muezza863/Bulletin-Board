import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const postSchema = new Schema({
    userId: {
        type: ObjectId,
        ref: 'User',
        required: true
    },
    title: {        // Locked after post
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    category: {     // Locked after post
        type: String,
        required: true
    },
    likes: [{
        type: ObjectId,
        ref: 'User'
    }],
    likeCount: {
        type: Number,
        default: 0
    },
    isDeleted: {
        type: Boolean,
        default: false
    },
    attachments: [{
        url: String,       // URL dari Cloudinary/S3
        publicId: String,  // ID untuk menghapus file nantinya
        fileType: {
            type: String,
            enum: ['image', 'video', 'pdf', 'other']
        },
        fileName: String
    }],
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

postSchema.plugin(mongoosePaginate);

const Post = mongoose.model('Post', postSchema);

export default Post;
