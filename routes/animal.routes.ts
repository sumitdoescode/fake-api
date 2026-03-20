import { Hono } from "hono";
import { getAllAnimals, getAnimalById, getRandomAnimal } from "../controllers/animal.controller";

const animalRoutes = new Hono();

// GET => /animals
animalRoutes.get("/", getAllAnimals);

// GET => /animals/random
animalRoutes.get("/random", getRandomAnimal);

// GET => /animals/:id
animalRoutes.get("/:id", getAnimalById);

export default animalRoutes;
