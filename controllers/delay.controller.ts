import { Context } from "hono";

export const delayResponse = async (c: Context) => {
    try {
        const delayNum = Number(c.req.param("ms")) || 1000;
        await new Promise((resolve) => setTimeout(resolve, delayNum));
        return c.json({ message: `Response delayed by ${delayNum}ms` });
    } catch (error) {
        return c.json({ error: error instanceof Error ? error.message : "Internal server error" }, 500);
    }
};
