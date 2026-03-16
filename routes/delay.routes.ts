import { Hono } from "hono";
import { delayResponse } from "../controllers/delay.controller";

const delayRoutes = new Hono();

// GET => /api/delay
delayRoutes.get("/", delayResponse);

// GET => /api/delay/:ms
delayRoutes.get("/:ms", delayResponse);

export default delayRoutes;
