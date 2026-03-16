import { Context } from "hono";
import postsData from "../data/posts.json";
import { createPostSchema, updatePostSchema } from "../schemas/Post.schema";
import { flattenError } from "zod";

const posts = [...(postsData as { userId: number; id: number; title: string; description: string; tags?: string[] }[])];

export const getAllPosts = async (c: Context) => {
    try {
        const { page, limit } = c.req.query();
        const pageNum = Number(page) || 1;
        const limitNum = Number(limit) || 10;
        const skip = (pageNum - 1) * limitNum;
        const paginatedPosts = posts.slice(skip, skip + limitNum);
        return c.json({
            data: paginatedPosts,
            pagination: {
                page: pageNum,
                limit: limitNum,
                totalPosts: posts.length,
                totalPages: Math.ceil(posts.length / limitNum),
                hasNextPage: pageNum < Math.ceil(posts.length / limitNum),
                hasPreviousPage: pageNum > 1,
            },
        });
    } catch (error) {
        return c.json({ error: error instanceof Error ? error.message : "Internal server error" }, 500);
    }
};

export const getRandomPost = async (c: Context) => {
    try {
        const randomIndex = Math.floor(Math.random() * posts.length);
        const randomPost = posts[randomIndex];
        return c.json(randomPost);
    } catch (error) {
        return c.json({ error: error instanceof Error ? error.message : "Internal server error" }, 500);
    }
};

export const searchPosts = async (c: Context) => {
    try {
        const query = c.req.query("q")?.trim() || c.req.query("query")?.trim() || "";

        if (!query) {
            return c.json({ error: "Search query is required" }, 400);
        }

        const normalizedQuery = query.toLowerCase();
        const matchedPosts = posts.filter((post) => {
            const inTitle = post.title.toLowerCase().includes(normalizedQuery);
            const inDescription = post.description.toLowerCase().includes(normalizedQuery);
            const inTags = post.tags?.some((tag) => tag.toLowerCase().includes(normalizedQuery)) || false;

            return inTitle || inDescription || inTags;
        });

        return c.json({
            query,
            total: matchedPosts.length,
            data: matchedPosts,
        });
    } catch (error) {
        return c.json({ error: error instanceof Error ? error.message : "Internal server error" }, 500);
    }
};

export const getPostById = async (c: Context) => {
    try {
        const id = Number(c.req.param("id"));
        if (isNaN(id)) {
            return c.json({ error: "Invalid post ID" }, 400);
        }
        const post = posts.find((post) => post.id === id);
        if (!post) {
            return c.json({ error: "Post not found" }, 404);
        }
        return c.json(post);
    } catch (error) {
        return c.json({ error: error instanceof Error ? error.message : "Internal server error" }, 500);
    }
};

export const getPostsByUserId = async (c: Context) => {
    try {
        const userId = Number(c.req.param("id"));
        if (isNaN(userId)) {
            return c.json({ error: "Invalid user ID" }, 400);
        }
        const userPosts = posts.filter((post) => post.userId === userId);
        return c.json(userPosts);
    } catch (error) {
        return c.json({ error: error instanceof Error ? error.message : "Internal server error" }, 500);
    }
};

export const createPostByUserId = async (c: Context) => {
    try {
        const userId = Number(c.req.param("id"));
        if (isNaN(userId)) {
            return c.json({ error: "Invalid user ID" }, 400);
        }
        const body = await c.req.json();
        const validation = createPostSchema.safeParse(body);
        if (!validation.success) {
            return c.json({ error: flattenError(validation.error).fieldErrors }, 400);
        }
        const newPost = {
            userId,
            id: posts.length + 1,
            ...validation.data,
            tags: validation.data.tags || [],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };
        posts.push(newPost);
        return c.json(newPost, 201);
    } catch (error) {
        return c.json({ error: error instanceof Error ? error.message : "Internal server error" }, 500);
    }
};

export const updatePost = async (c: Context) => {
    try {
        const id = Number(c.req.param("id"));
        if (isNaN(id)) {
            return c.json({ error: "Invalid post ID" }, 400);
        }

        // you cannot update seed posts
        if (id <= 100) {
            return c.json({ error: "You cannot update seed posts" }, 400);
        }

        const postIndex = posts.findIndex((post) => post.id === id);
        if (postIndex === -1) {
            return c.json({ error: "Post not found" }, 404);
        }
        const post = posts[postIndex];
        const body = await c.req.json();
        const validation = updatePostSchema.safeParse(body);
        if (!validation.success) {
            return c.json({ error: flattenError(validation.error).fieldErrors }, 400);
        }
        const updatedPost = {
            ...post,
            ...validation.data,
        };
        posts[postIndex] = updatedPost;
        return c.json({ message: "Post updated", post: updatedPost });
    } catch (error) {
        return c.json({ error: error instanceof Error ? error.message : "Internal server error" }, 500);
    }
};

export const deletePost = async (c: Context) => {
    try {
        const id = Number(c.req.param("id"));
        if (isNaN(id)) {
            return c.json({ error: "Invalid post ID" }, 400);
        }

        // you cannot delete seed posts
        if (id <= 100) {
            return c.json({ error: "You cannot delete seed posts" }, 400);
        }

        const postIndex = posts.findIndex((post) => post.id === id);
        if (postIndex === -1) {
            return c.json({ error: "Post not found" }, 404);
        }
        const post = posts[postIndex];
        posts.splice(postIndex, 1);
        return c.json({ message: "Post deleted", post });
    } catch (error) {
        return c.json({ error: error instanceof Error ? error.message : "Internal server error" }, 500);
    }
};
