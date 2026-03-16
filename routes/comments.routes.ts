import { Hono } from "hono";
import { deleteComment, getAllComments, getCommentById, getRandomComment } from "../controllers/comment.controller";

const commentRoutes = new Hono();

// GET => /api/comments
commentRoutes.get("/", getAllComments);

// GET => /api/comments/random
commentRoutes.get("/random", getRandomComment);

// GET => /api/comments/:id
commentRoutes.get("/:id", getCommentById);

// DELETE => /api/comments/:id
commentRoutes.delete("/:id", deleteComment);

export default commentRoutes;
