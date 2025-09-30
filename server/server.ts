import { serve } from "server";
import { initializeDatabase } from './db/initialize.ts';
import { middleware } from "./middleware/middleware.ts";
import { handleRequest } from "./router/router.ts";

const APP_PORT = parseInt(Deno.env.get("APP_PORT") || "8000");

async function main() {
  try {
    await initializeDatabase()

    serve((request: Request) => middleware(request, handleRequest), {
      port: APP_PORT, onListen({ port }) {
        console.log(`\x1b[32mServer started on \x1b[36mhttp://localhost:${port}\x1b[0m`);
      }
    })

  } catch (error) {
    console.error("Failed to start server:", error);
  }
}

if (import.meta.main) {
  main();
}
