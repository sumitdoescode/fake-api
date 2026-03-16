import { z } from "zod";

export const createPostSchema = z.object({
    title: z.string().min(3, "Title must be at least 3 characters long"),
    description: z.string().min(3, "Description must be at least 3 characters long"),
    tags: z.array(z.string()).optional(),
});

export const updatePostSchema = z.object({
    title: z.string().min(3, "Title must be at least 3 characters long").optional(),
    description: z.string().min(3, "Description must be at least 3 characters long").optional(),
    tags: z.array(z.string()).optional(),
});
