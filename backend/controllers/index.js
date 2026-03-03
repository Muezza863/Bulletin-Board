import { register, login } from "./authControllers.js";
import { getAllPost, getAllCategory, getMyPost, getPostById, createPost, updatePost, deletePost } from "./postControllers.js";
import { getProfile } from "./profileControllers.js";
import { getCommentByPostId, createComment, updateComment, deleteComment, countComment } from "./commentControllers.js";
import { likePost, unlikePost } from "./likeControllers.js";
import { getStats, forceDeletePost, forceDeleteUser, upgradeUser, downgradeUser } from "./adminControllers.js";
import { upgradeToPremium, downgradeFromPremium, getMembershipStatus } from "./membershipControllers.js";

export {
    register,
    login,
    getAllPost,
    getAllCategory,
    getMyPost,
    getPostById,
    createPost,
    updatePost,
    deletePost,
    getProfile,
    getStats,
    forceDeletePost,
    forceDeleteUser,
    upgradeUser,
    downgradeUser,
    upgradeToPremium,
    downgradeFromPremium,
    getMembershipStatus,
    likePost,
    unlikePost,
    getCommentByPostId,
    createComment,
    updateComment,
    deleteComment,
    countComment
};