import { Hono } from "hono";
import { getConnInfo } from "hono/cloudflare-workers";

const myIpRoutes = new Hono();

// GET => /api/v1/myip
myIpRoutes.get("/", (c) => {
    try {
        const info = getConnInfo(c);
        const remoteAddress = info.remote.address;
        return c.json({ your_ip_address: remoteAddress });
    } catch (error) {
        console.error("Error fetching user IP:", error);
        return c.json({ error: error instanceof Error ? error.message : "Internal server error" }, 500);
    }
});

export default myIpRoutes;
