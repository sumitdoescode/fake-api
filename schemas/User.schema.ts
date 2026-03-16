import { z } from "zod";

export const createUserSchema = z
    .object({
        name: z.string().min(3, "Name must be at least 3 characters long"),
        username: z.string().min(3, "Username must be at least 3 characters long").toLowerCase(),
        email: z.email({ message: "Invalid email address" }).toLowerCase(),
    })
    .required();

export const updateUserSchema = z.object({
    name: z.string().min(3, "Name must be at least 3 characters long"),
    username: z.string().min(3, "Username must be at least 3 characters long").toLowerCase(),
    email: z.email({ message: "Invalid email address" }).toLowerCase(),
});
