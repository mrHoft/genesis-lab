const CLIENT_DIST_PATH = `${Deno.cwd().split('/').slice(0, -1).join('/')}/client/dist`;

const MIME_TYPES: Record<string, string> = {
  ".html": "text/html",
  ".css": "text/css",
  ".js": "application/javascript",
  ".json": "application/json",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".gif": "image/gif",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
  ".ttf": "font/ttf",
};

export async function serveStatic(request: Request): Promise<Response | null> {
  const url = new URL(request.url);
  let filePath = url.pathname;

  if (filePath === "/") {
    filePath = "/index.html";
  }

  if (filePath.includes("..")) {
    return null;
  }

  const fullPath = `${CLIENT_DIST_PATH}${filePath}`;

  try {
    const fileInfo = await Deno.stat(fullPath);
    if (!fileInfo.isFile) {
      return null;
    }

    const fileContent = await Deno.readFile(fullPath);

    const extension = `.${filePath.split('.').pop()}`;
    const contentType = MIME_TYPES[extension] || "application/octet-stream";

    console.log(fullPath, contentType)

    return new Response(fileContent, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Cache-Control": extension === ".html" ? "no-cache, no-store, must-revalidate" : "public, max-age=31536000",
      },
    });

  } catch (error) {
    if (error instanceof Deno.errors.NotFound) {
      return null;
    }
    throw error;
  }
}
