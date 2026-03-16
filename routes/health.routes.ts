import { Hono } from "hono";

const healthRoutes = new Hono();

healthRoutes.get("/", (c) => {
    return c.json({ ok: true, message: "Health Status is good" });
});

export default healthRoutes;
