import { loggerMiddleware } from "./logger.ts";

export function middleware(request: Request, next: (request: Request) => Promise<Response>): Promise<Response> {
  return loggerMiddleware(request, next)
}
