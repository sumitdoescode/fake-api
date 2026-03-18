import { Context } from "hono";
import animalsData from "../data/animals.json";

const animals = [...(animalsData as { id: number; name: string; type: string; diet: string; continent: string; lifespan: number }[])];

export const getAllAnimals = async (c: Context) => {
    try {
        const { page, limit } = c.req.query();
        const pageNum = Number(page) || 1;
        const limitNum = Number(limit) || 10;
        const skip = (pageNum - 1) * limitNum;
        const paginatedAnimals = animals.slice(skip, skip + limitNum);
        return c.json({
            data: paginatedAnimals,
            pagination: {
                page: pageNum,
                limit: limitNum,
                totalAnimals: animals.length,
                totalPages: Math.ceil(animals.length / limitNum),
                hasNextPage: pageNum < Math.ceil(animals.length / limitNum),
                hasPreviousPage: pageNum > 1,
            },
        });
    } catch (error) {
        return c.json({ error: error instanceof Error ? error.message : "Internal server error" }, 500);
    }
};

export const getRandomAnimal = async (c: Context) => {
    try {
        const randomIndex = Math.floor(Math.random() * animals.length);
        const randomAnimal = animals[randomIndex];
        return c.json(randomAnimal);
    } catch (error) {
        return c.json({ error: error instanceof Error ? error.message : "Internal server error" }, 500);
    }
};

export const getAnimalById = async (c: Context) => {
    try {
        const id = Number(c.req.param("id"));
        if (isNaN(id)) {
            return c.json({ error: "Invalid animal ID" }, 400);
        }
        const animal = animals.find((animal) => animal.id === id);
        if (!animal) {
            return c.json({ error: "Animal not found" }, 404);
        }
        return c.json(animal);
    } catch (error) {
        return c.json({ error: error instanceof Error ? error.message : "Internal server error" }, 500);
    }
};
