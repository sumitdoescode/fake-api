import { Hono } from "hono";
import { getAllUsers, getUserById, createUser, updateUser, deleteUser, getRandomUser } from "../controllers/user.controller";
import { getPostsByUserId, createPostByUserId } from "../controllers/post.controller";
import { createCommentByUserIdAndPostId, getCommentsByUserId } from "../controllers/comment.controller";

const userRoutes = new Hono();

// GET => /api/users
userRoutes.get("/", getAllUsers);

// GET => /api/users/random
userRoutes.get("/random", getRandomUser);

// POST => /api/users/:id/posts
userRoutes.post("/:id/posts", createPostByUserId);

// GET => /api/users/:id/posts
userRoutes.get("/:id/posts", getPostsByUserId);

// GET => /api/users/:id/comments
userRoutes.get("/:id/comments", getCommentsByUserId);

// POST => /api/users/:userId/posts/:postId/comments
userRoutes.post("/:userId/posts/:postId/comments", createCommentByUserIdAndPostId);

// GET => /api/users/:id
userRoutes.get("/:id", getUserById);

// POST => /api/users
userRoutes.post("/", createUser);

// PUT => /api/users/:id
userRoutes.put("/:id", updateUser);

// DELETE => /api/users/:id
userRoutes.delete("/:id", deleteUser);

export default userRoutes;
