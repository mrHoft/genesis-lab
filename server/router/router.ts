import { handleHealth } from './health.ts';
import { UserHandler } from "./user.ts";
import { GalleryHandler } from "./gallery.ts";

const userHandler = new UserHandler();
const galleryHandler = new GalleryHandler();

export async function handleRequest(request: Request) {
  const url = new URL(request.url);
  const { pathname } = url;
  const pathSegments = pathname.split('/').filter(Boolean);

  if (pathSegments[0] === "health") {
    return handleHealth();
  }

  if (pathSegments[0] === "user") {
    return await userHandler.handleRequest(request, pathSegments);
  }

  if (pathSegments[0] === "gallery") {
    return await galleryHandler.handleRequest(request, pathSegments);
  }

  return new Response(JSON.stringify({ error: "Not found" }), {
    status: 404,
    headers: { "Content-Type": "application/json" },
  });
}
