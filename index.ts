import { Hono } from "hono";
import userRoutes from "./routes/user.routes";
import postRoutes from "./routes/posts.routes";
import commentRoutes from "./routes/comments.routes";
import animalRoutes from "./routes/animal.routes";
import healthRoutes from "./routes/health.routes";
import delayRoutes from "./routes/delay.routes";

const app = new Hono();

app.get("/", (c) => {
    return c.json({ ok: true, message: "Welcome to the Fake API", version: "1.0.0" });
});

app.route("/api/health", healthRoutes);
app.route("/api/users", userRoutes);
app.route("/api/posts", postRoutes);
app.route("/api/comments", commentRoutes);
app.route("/api/animals", animalRoutes);
app.route("/api/delay", delayRoutes);

export default app;
