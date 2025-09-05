import { handleHealth } from './health.ts';
import { UserHandler } from "./user.ts";

const userHandler = new UserHandler();

export async function handleRequest(request: Request) {
  const url = new URL(request.url);
  const { pathname } = url;
  const pathSegments = pathname.split('/').filter(Boolean); // ["user", "all"] or ["user", "123"]

  if (pathSegments[0] === "health") {
    return handleHealth();
  }

  if (pathSegments[0] === "user") {
    return await userHandler.handleRequest(request, pathSegments);
  }

  return new Response(JSON.stringify({ message: "Hello from Deno Server!" }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}
