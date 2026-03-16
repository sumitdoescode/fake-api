import { Hono } from "hono";
import { getAllPosts, getPostById, updatePost, deletePost, getRandomPost, searchPosts } from "../controllers/post.controller";
import { getCommentsByPostId } from "../controllers/comment.controller";

const postRoutes = new Hono();

// GET => /api/posts
postRoutes.get("/", getAllPosts); // get all posts

// GET => /api/posts/random
postRoutes.get("/random", getRandomPost); // get random post

// GET => /api/posts/search?q=term
postRoutes.get("/search", searchPosts); // search posts

// GET => /api/posts/:id/comments
postRoutes.get("/:id/comments", getCommentsByPostId);

// GET => /api/posts/:id
postRoutes.get("/:id", getPostById); // get post by id

// PUT => /api/posts/:id
postRoutes.put("/:id", updatePost); // update post

// DELETE => /api/posts/:id
postRoutes.delete("/:id", deletePost); // delete post

export default postRoutes;
