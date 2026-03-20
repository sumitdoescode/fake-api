import { Hono } from "hono";
import { getAllPosts, getPostById, updatePost, deletePost, getRandomPost, searchPosts } from "../controllers/post.controller";
import { getCommentsByPostId } from "../controllers/comment.controller";

const postRoutes = new Hono();

// GET => /posts
postRoutes.get("/", getAllPosts); // get all posts

// GET => /posts/random
postRoutes.get("/random", getRandomPost); // get random post

// GET => /posts/search?q=term
postRoutes.get("/search", searchPosts); // search posts

// GET => /posts/:id/comments
postRoutes.get("/:id/comments", getCommentsByPostId);

// GET => /posts/:id
postRoutes.get("/:id", getPostById); // get post by id

// PUT => /posts/:id
postRoutes.put("/:id", updatePost); // update post

// DELETE => /posts/:id
postRoutes.delete("/:id", deletePost); // delete post

export default postRoutes;
