export async function loggerMiddleware(request: Request, next: (request: Request) => Promise<Response>): Promise<Response> {
  const start = Date.now();
  const { pathname, search } = new URL(request.url);
  const method = request.method;

  try {
    const response = await next(request);
    const duration = Date.now() - start;

    console.log(
      `\x1b[36m${method}\x1b[0m ${pathname}${search} \x1b[32m${response.status} \x1b[0m(${duration}ms)`
    );

    return response;
  } catch (error) {
    const duration = Date.now() - start;
    console.error(
      `\x1b[36m${method}\x1b[0m ${pathname}${search} \x1b[31mERROR \x1b[0m(${duration}ms):`,
      error
    );
    throw error;
  }
}
