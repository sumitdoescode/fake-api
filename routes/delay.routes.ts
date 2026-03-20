import { Hono } from "hono";
import { delayResponse } from "../controllers/delay.controller";

const delayRoutes = new Hono();

// GET => /delay
delayRoutes.get("/", delayResponse);

// GET => /delay/:ms
delayRoutes.get("/:ms", delayResponse);

export default delayRoutes;
