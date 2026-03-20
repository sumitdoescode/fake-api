import { Hono } from "hono";
import { getAllUsers, getUserById, createUser, updateUser, deleteUser, getRandomUser } from "../controllers/user.controller";
import { getPostsByUserId, createPostByUserId } from "../controllers/post.controller";
import { createCommentByUserIdAndPostId, getCommentsByUserId } from "../controllers/comment.controller";

const userRoutes = new Hono();

// GET => /users
userRoutes.get("/", getAllUsers);

// GET => /users/random
userRoutes.get("/random", getRandomUser);

// POST => /users/:id/posts
userRoutes.post("/:id/posts", createPostByUserId);

// GET => /users/:id/posts
userRoutes.get("/:id/posts", getPostsByUserId);

// POST => /users/:userId/posts/:postId/comments
userRoutes.post("/:userId/posts/:postId/comments", createCommentByUserIdAndPostId);

// GET => /users/:id/comments
userRoutes.get("/:id/comments", getCommentsByUserId);

// GET => /users/:id
userRoutes.get("/:id", getUserById);

// POST => /users
userRoutes.post("/", createUser);

// PUT => /users/:id
userRoutes.put("/:id", updateUser);

// DELETE => /users/:id
userRoutes.delete("/:id", deleteUser);

export default userRoutes;
