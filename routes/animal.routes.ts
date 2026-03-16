import { Hono } from "hono";
import { getAllAnimals, getAnimalById, getRandomAnimal } from "../controllers/animal.controller";

const animalRoutes = new Hono();

// GET => /api/animals
animalRoutes.get("/", getAllAnimals);

// GET => /api/animals/random
animalRoutes.get("/random", getRandomAnimal);

// GET => /api/animals/:id
animalRoutes.get("/:id", getAnimalById);

export default animalRoutes;
