import { Context } from "hono";
import commentsData from "../data/comments.json";
import { createCommentSchema } from "../schemas/Comment.schema";
import { flattenError } from "zod";

interface IComment {
    id: number;
    postId: number;
    userId: number;
    text: string;
    createdAt: string;
}

const comments = [...(commentsData as IComment[])];
const seedCommentIds = new Set((commentsData as IComment[]).map((comment) => comment.id));

export const getAllComments = async (c: Context) => {
    try {
        const { page, limit } = c.req.query();
        const pageNum = Number(page) || 1;
        const limitNum = Number(limit) || 10;
        const skip = (pageNum - 1) * limitNum;
        const paginatedComments = comments.slice(skip, skip + limitNum);
        return c.json({
            data: paginatedComments,
            pagination: {
                page: pageNum,
                limit: limitNum,
                totalComments: comments.length,
                totalPages: Math.ceil(comments.length / limitNum),
                hasNextPage: pageNum < Math.ceil(comments.length / limitNum),
                hasPreviousPage: pageNum > 1,
            },
        });
    } catch (error) {
        return c.json({ error: error instanceof Error ? error.message : "Internal server error" }, 500);
    }
};

export const getRandomComment = async (c: Context) => {
    try {
        const randomIndex = Math.floor(Math.random() * comments.length);
        const randomComment = comments[randomIndex];
        return c.json(randomComment);
    } catch (error) {
        return c.json({ error: error instanceof Error ? error.message : "Internal server error" }, 500);
    }
};

export const getCommentById = async (c: Context) => {
    try {
        const id = Number(c.req.param("id"));

        // if id is not a number (NaN)
        if (isNaN(id)) {
            return c.json({ error: "Invalid comment ID" }, 400);
        }
        const comment = comments.find((comment) => comment.id === id);
        if (!comment) {
            return c.json({ error: "Comment not found" }, 404);
        }
        return c.json(comment);
    } catch (error) {
        return c.json({ error: error instanceof Error ? error.message : "Internal server error" }, 500);
    }
};

export const getCommentsByPostId = async (c: Context) => {
    try {
        const postId = Number(c.req.param("id"));
        if (isNaN(postId)) {
            return c.json({ error: "Invalid post ID" }, 400);
        }
        const postComments = comments.filter((comment) => comment.postId === postId);
        return c.json(postComments);
    } catch (error) {
        return c.json({ error: error instanceof Error ? error.message : "Internal server error" }, 500);
    }
};

export const getCommentsByUserId = async (c: Context) => {
    try {
        const userId = Number(c.req.param("id"));
        if (isNaN(userId)) {
            return c.json({ error: "Invalid user ID" }, 400);
        }
        const userComments = comments.filter((comment) => comment.userId === userId);
        return c.json(userComments);
    } catch (error) {
        return c.json({ error: error instanceof Error ? error.message : "Internal server error" }, 500);
    }
};

export const createCommentByUserIdAndPostId = async (c: Context) => {
    try {
        const userId = Number(c.req.param("userId"));
        if (isNaN(userId)) {
            return c.json({ error: "Invalid user ID" }, 400);
        }

        const postId = Number(c.req.param("postId"));
        if (isNaN(postId)) {
            return c.json({ error: "Invalid post ID" }, 400);
        }
        const body = await c.req.json();
        const validation = createCommentSchema.safeParse(body);
        if (!validation.success) {
            return c.json({ error: flattenError(validation.error).fieldErrors }, 400);
        }
        const nextCommentId = Math.max(...comments.map((comment) => comment.id), 0) + 1;

        const newComment = {
            id: nextCommentId,
            postId,
            userId,
            ...validation.data,
            createdAt: new Date().toISOString(),
        };
        comments.push(newComment);
        return c.json(newComment, 201);
    } catch (error) {
        return c.json({ error: error instanceof Error ? error.message : "Internal server error" }, 500);
    }
};

export const deleteComment = async (c: Context) => {
    try {
        const id = Number(c.req.param("id"));
        if (isNaN(id)) {
            return c.json({ error: "Invalid comment ID" }, 400);
        }

        // you cannot delete seed comments
        if (seedCommentIds.has(id)) {
            return c.json({ error: "You cannot delete seed comments" }, 400);
        }

        const commentIndex = comments.findIndex((comment) => comment.id === id);
        if (commentIndex === -1) {
            return c.json({ error: "Comment not found" }, 404);
        }
        const [deletedComment] = comments.splice(commentIndex, 1);
        return c.json({ message: "Comment deleted", deletedComment });
    } catch (error) {
        return c.json({ error: error instanceof Error ? error.message : "Internal server error" }, 500);
    }
};
