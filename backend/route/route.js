import express from "express";
import * as middleware from "../middleware/index.js";
import * as controllers from "../controllers/index.js";
import { upload } from "../middleware/index.js";

const router = express.Router();

// Auth routes
router.post("/register", middleware.authLimiter, controllers.register);
router.post("/login", middleware.authLimiter, middleware.checkAccountStatus, controllers.login);


router.use(middleware.protect);
// Post routes
router.get("/post", controllers.getAllPost);
router.get("/post/:id", controllers.getPostById);
router.get("/post/category", controllers.getAllCategory);
router.get("/post/my-post", controllers.getMyPost);
router.post("/post", middleware.checkQuota, upload.array("file", 2), controllers.createPost);
router.put("/post/:id", middleware.checkQuota, upload.array("file", 2), controllers.updatePost);
router.delete("/post/:id", controllers.deletePost);
router.post("/post/:id/like", controllers.likePost);
router.post("/post/:id/unlike", controllers.unlikePost);


// Profile routes
router.get("/profile", controllers.getProfile);


router.use(middleware.adminOnly);
// Admin routes
router.get("/admin/stats", controllers.getStats);
router.delete("/admin/post/:id", controllers.forceDeletePost);
router.delete("/admin/user/:id", controllers.forceDeleteUser);
router.put("/admin/user/:id/upgrade", controllers.upgradeUser);
router.put("/admin/user/:id/downgrade", controllers.downgradeUser);

export default router;