import type { Context } from "hono";
import usersData from "../data/users.json";
import { createUserSchema, updateUserSchema } from "../schemas/User.schema";
import { flattenError } from "zod";

const users = [...(usersData as { id: number; name: string; username: string; email: string }[])];

export const getAllUsers = async (c: Context) => {
    try {
        const page = Number(c.req.query("page") || "1");
        const limit = Number(c.req.query("limit") || "10");

        if (page < 1 || !Number.isInteger(page)) {
            return c.json({ error: "Page must be a positive number" }, 400);
        }

        if (limit < 1 || !Number.isInteger(limit)) {
            return c.json({ error: "Limit must be a positive number" }, 400);
        }

        const startIndex = (page - 1) * limit;
        const endIndex = startIndex + limit;
        const paginatedUsers = users.slice(startIndex, endIndex);

        return c.json({
            data: paginatedUsers,
            pagination: {
                page,
                limit,
                totalUsers: users.length,
                totalPages: Math.ceil(users.length / limit),
                hasNextPage: page < Math.ceil(users.length / limit),
                hasPreviousPage: page > 1,
            },
        });
    } catch (error) {
        // console.error("Error fetching all users:", error);
        return c.json({ error: error instanceof Error ? error.message : "Internal server error" }, 500);
    }
};

export const getRandomUser = async (c: Context) => {
    try {
        const randomIndex = Math.floor(Math.random() * users.length);
        const randomUser = users[randomIndex];
        return c.json(randomUser);
    } catch (error) {
        // console.error("Error fetching random user:", error);
        return c.json({ error: error instanceof Error ? error.message : "Internal server error" }, 500);
    }
};

export const getUserById = async (c: Context) => {
    try {
        const id = Number(c.req.param("id"));

        if (!id) {
            return c.json({ error: "Please provide user id" }, 400);
        }

        const user = users.find((user) => user.id === id);

        if (!user) {
            return c.json({ error: "User not found" }, 404);
        }

        return c.json(user);
    } catch (error) {
        // console.error("Error fetching user by id:", error);
        return c.json({ error: error instanceof Error ? error.message : "Internal server error" }, 500);
    }
};

export const createUser = async (c: Context) => {
    try {
        const { name, username, email } = await c.req.json();
        const validation = createUserSchema.safeParse({ name, username, email });

        if (!validation.success) {
            return c.json({ error: flattenError(validation.error).fieldErrors }, 400);
        }

        // check if the user with the same email or username already exists
        const existingUsername = users.find((user) => user.username === username);
        const existingEmail = users.find((user) => user.email === email);

        if (existingUsername) {
            return c.json({ error: "User with this username already exists" }, 400);
        }

        if (existingEmail) {
            return c.json({ error: "User with this email already exists" }, 400);
        }

        const newUser = {
            id: users.length + 1,
            name,
            username,
            email,
        };

        users.push(newUser);

        return c.json({ message: "User created", data: newUser }, 201);
    } catch (error) {
        // console.error("Error creating user:", error);
        return c.json({ error: error instanceof Error ? error.message : "Internal server error" }, 500);
    }
};

export const updateUser = async (c: Context) => {
    try {
        const id = Number(c.req.param("id"));

        if (!id) {
            return c.json({ error: "Please provide user id" }, 400);
        }

        // you cannot update the original seed data
        if (id <= 100) {
            return c.json({ error: "You cannot update the original seed data" }, 400);
        }

        const userIndex = users.findIndex((user) => user.id === id);

        if (userIndex === -1) {
            return c.json({ error: "User not found" }, 404);
        }
        const { name, username, email } = await c.req.json();

        const validation = updateUserSchema.safeParse({ name, username, email });

        if (!validation.success) {
            return c.json({ error: flattenError(validation.error).fieldErrors }, 400);
        }

        // check if the user with the same email or username already exists
        const existingUsername = users.find((user) => user.username === username && user.id !== id);
        const existingEmail = users.find((user) => user.email === email && user.id !== id);

        if (existingUsername) {
            return c.json({ error: "User with this username already exists" }, 400);
        }

        if (existingEmail) {
            return c.json({ error: "User with this email already exists" }, 400);
        }

        users[userIndex] = {
            id,
            name,
            username,
            email,
        };

        return c.json({ message: "User updated", data: users[userIndex] });
    } catch (error) {
        // console.error("Error updating user:", error);
        return c.json({ error: error instanceof Error ? error.message : "Internal server error" }, 500);
    }
};

export const deleteUser = async (c: Context) => {
    try {
        const id = Number(c.req.param("id"));

        if (!id) {
            return c.json({ error: "Please provide user id" }, 400);
        }

        // you cannot delete the original seed data
        if (id <= 100) {
            return c.json({ error: "You cannot delete the original seed data" }, 400);
        }

        const userIndex = users.findIndex((user) => user.id === id);

        if (userIndex === -1) {
            return c.json({ error: "User not found" }, 404);
        }

        const deletedUser = users[userIndex];
        users.splice(userIndex, 1);

        return c.json({ message: "User deleted", data: deletedUser });
    } catch (error) {
        // console.error("Error deleting user:", error);
        return c.json({ error: error instanceof Error ? error.message : "Internal server error" }, 500);
    }
};
