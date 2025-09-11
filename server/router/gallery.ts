import { GalleryService } from "~/services/gallery.service.ts";
import type { Gallery } from "~/types/gallery.ts";

const DEV = Deno.env.get("DEV_MODE");

export class GalleryHandler {
  private galleryService: GalleryService;

  constructor() {
    this.galleryService = new GalleryService();
  }

  handleRequest(request: Request, pathSegments: string[]): Promise<Response> {
    const method = request.method;
    const id = pathSegments[1]; // /gallery/:id
    const action = pathSegments[2]; // /gallery/:id/like

    try {
      switch (method) {
        case "GET":
          if (id) {
            return this.findOne(id);
          }
          return this.getGallery(request);
        case "POST":
          if (id && action === "like") {
            return this.addLike(request, id);
          }
          return this.create(request);
        case "DELETE":
          if (id) {
            return this.remove(id);
          }
          break;
      }

      return Promise.resolve(
        new Response(JSON.stringify({ error: "Not found" }), { status: 404, headers: { "Content-Type": "application/json" } })
      );
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown error";
      return Promise.resolve(
        new Response(JSON.stringify({ error: message }), { status: 400, headers: { "Content-Type": "application/json" } })
      );
    }
  }

  private async findOne(id: string): Promise<Response> {
    const record = await this.galleryService.findOneById(id);
    if (!record) {
      return new Response(JSON.stringify({ error: "Record not found" }), { status: 404, headers: { "Content-Type": "application/json" } });
    }

    return new Response(JSON.stringify(record), { status: 200, headers: { "Content-Type": "application/json" } });
  }

  private async getGallery(request: Request): Promise<Response> {
    const url = new URL(request.url);
    const page = Math.max(0, parseInt(url.searchParams.get("page") || "1"));
    const limit = Math.min(100, Math.max(1, parseInt(url.searchParams.get("limit") || "10")));
    const userId = url.searchParams.get("user_id");

    const result = await this.galleryService.findAll(page, limit, userId || undefined);

    return new Response(
      JSON.stringify({
        records: result.records,
        pagination: {
          page,
          limit,
          total: result.total,
          pages: Math.ceil(result.total / limit)
        }
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  }

  private async create(request: Request): Promise<Response> {
    const body: Omit<Gallery, "id" | "created_at"> = await request.json();

    const authHeader = request.headers.get("authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: { "Content-Type": "application/json" } });
    }

    const [scheme, token] = authHeader.split(" ");
    if (scheme !== "Bearer" || !token) {
      return new Response(JSON.stringify({ error: "Invalid authorization scheme" }), { status: 401, headers: { "Content-Type": "application/json" } });
    }

    if (!body.props || !body.thumbnail) {
      return new Response(JSON.stringify({ error: "fractal props and thumbnail are required" }), { status: 400, headers: { "Content-Type": "application/json" } });
    }

    if (body.thumbnail.length > 3200) {
      return new Response(JSON.stringify({ error: "thumbnail exceeds maximum length of 3200 characters" }), { status: 400, headers: { "Content-Type": "application/json" } });
    }

    const record = await this.galleryService.create(body, token);

    return new Response(JSON.stringify(record), { status: 201, headers: { "Content-Type": "application/json" } });
  }

  private async remove(id: string): Promise<Response> {
    if (!DEV) {
      return new Response(JSON.stringify({ error: "Access Denied" }), { status: 403, headers: { "Content-Type": "application/json" } });
    }

    await this.galleryService.remove(id);
    return new Response(JSON.stringify({ status: "ok" }), { status: 204, headers: { "Content-Type": "application/json" } });
  }

  private async addLike(request: Request, id: string): Promise<Response> {
    const authHeader = request.headers.get("authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: { "Content-Type": "application/json" } });
    }
    const [scheme, token] = authHeader.split(" ");
    if (scheme !== "Bearer" || !token) {
      return new Response(JSON.stringify({ error: "Invalid authorization scheme" }), { status: 401, headers: { "Content-Type": "application/json" } });
    }

    const updatedRecord = await this.galleryService.addLike(id, token);

    if (!updatedRecord) {
      return new Response(JSON.stringify({ error: "Record not found" }), { status: 404, headers: { "Content-Type": "application/json" } });
    }

    return new Response(JSON.stringify(updatedRecord), { status: 200, headers: { "Content-Type": "application/json" } });
  }
}
