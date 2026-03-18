import { Hono } from "hono";
import userRoutes from "./routes/user.routes";
import postRoutes from "./routes/posts.routes";
import commentRoutes from "./routes/comments.routes";
import animalRoutes from "./routes/animal.routes";
import healthRoutes from "./routes/health.routes";
import delayRoutes from "./routes/delay.routes";
import type { Context } from "hono";
import { logger } from "hono/logger";
import { cors } from "hono/cors";
// import { rateLimiter } from "hono-rate-limiter";

const app = new Hono();

app.use(logger());

app.use(
    cors({
        origin: "*",
        allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    }),
);

// app.use(
//     rateLimiter({
//         windowMs: 10 * 60 * 1000, // 10 minutes
//         limit: 100, // Limit each client to 100 requests per window
//         keyGenerator: (c) => c.req.header("x-forwarded-for") ?? "", // Use IP address as key
//     }),
// );

app.get("/", (c) => {
    return c.json({ message: "Welcome to the Fake API", version: "1.0.0" });
});

app.route("/health", healthRoutes);
app.route("/users", userRoutes);
app.route("/posts", postRoutes);
app.route("/comments", commentRoutes);
app.route("/animals", animalRoutes);
app.route("/delay", delayRoutes);

app.onError((e: any, c: Context) => {
    return c.json({ error: e.message }, 500);
});

app.notFound((c: Context) => {
    return c.json({ error: "Route Not Found" }, 404);
});

export default app;
