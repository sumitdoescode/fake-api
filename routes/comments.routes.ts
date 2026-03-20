import { Hono } from "hono";
import { deleteComment, getAllComments, getCommentById, getRandomComment } from "../controllers/comment.controller";

const commentRoutes = new Hono();

// GET => /comments
commentRoutes.get("/", getAllComments);

// GET => /comments/random
commentRoutes.get("/random", getRandomComment);

// GET => /comments/:id
commentRoutes.get("/:id", getCommentById);

// DELETE => /comments/:id
commentRoutes.delete("/:id", deleteComment);

export default commentRoutes;
