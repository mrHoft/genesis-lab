import { loggerMiddleware } from "./logger.ts";
import { withCors, handleOptions } from './cors.ts'
import { serveStatic } from "./static.ts";
import { errorHandler } from "../utils/error.ts";

const API_PREFIX = "/api";

export async function middleware(request: Request, next: (request: Request) => Promise<Response>): Promise<Response> {
  const url = new URL(request.url);

  if (request.method === "OPTIONS") {
    return Promise.resolve(handleOptions(request));
  }

  // Serve api
  if (url.pathname.startsWith(API_PREFIX)) {
    const apiPath = url.pathname.slice(API_PREFIX.length) || "/";
    const apiUrl = new URL(apiPath + url.search, url.origin);

    const apiRequest = new Request(apiUrl, {
      method: request.method,
      headers: request.headers,
      body: request.body,
      redirect: request.redirect,
    });

    return loggerMiddleware(apiRequest, next).then(response => {
      return withCors(response, request);
    }).catch(error => {
      return Promise.resolve(withCors(errorHandler(error), request));
    })
  }

  // Handle static files
  const staticResponse = await serveStatic(request);
  if (staticResponse) {
    return staticResponse;
  }

  // Serve index.html for all other routes
  const httpResponse = await serveStatic(new Request(new URL("/", url.origin), request));
  if (httpResponse) {
    return httpResponse;
  }

  const response = new Response(JSON.stringify({ error: "Not found" }), {
    status: 404,
    headers: { "Content-Type": "application/json" },
  });
  return Promise.resolve(withCors(response, request));
}
