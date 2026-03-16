import { z } from "zod";

export const createCommentSchema = z.object({
    text: z.string().min(3, "Text must be at least 3 characters long"),
});

export const updateCommentSchema = z.object({
    text: z.string().min(3, "Text must be at least 3 characters long"),
});
