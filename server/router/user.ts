import { UserService } from "~/services/user.service.ts";
import { User, CreateUserDto, UpdateUserDto } from "~/types/user.ts";
import { ErrorResponse } from "~/utils/error.ts";

const DEV = Deno.env.get("DEV_MODE")

export class UserHandler {
  private userService: UserService

  constructor() {
    this.userService = new UserService()
  }

  handleRequest(request: Request, pathSegments: string[]): Promise<Response> {
    const method = request.method;
    const id = pathSegments[1]; // /user/:id

    try {
      switch (method) {
        case "GET":
          if (pathSegments[1] === "all") {
            return this.findAll();
          } else if (id) {
            return this.findOne(id);
          } else {
            return this.getUser(request);
          }
        case "POST":
          if (pathSegments[1] === "refresh") {
            return this.refresh(request);
          } else if (pathSegments[1] === "login") {
            return this.login(request);
          }
          return this.create(request);
        case "PATCH":
          if (id) {
            return this.update(id, request);
          }
          break;
        case "DELETE":
          if (id) {
            return this.remove(id);
          }
          break;
      }

      return Promise.resolve(new Response(JSON.stringify({ error: "Not found" }), { status: 404, headers: { "Content-Type": "application/json" } }));
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error'
      return Promise.resolve(new Response(JSON.stringify({ error: message }), { status: 400, headers: { "Content-Type": "application/json" } }));
    }
  }

  private async create(request: Request): Promise<Response> {
    const body: CreateUserDto = await request.json();

    const user = await this.userService.create(body);
    const { password: _, ...userWithoutPassword } = user;

    return new Response(JSON.stringify(userWithoutPassword), { status: 201, headers: { "Content-Type": "application/json" } });
  }

  private async findAll(): Promise<Response> {
    if (!DEV) {
      return new Response(JSON.stringify({ error: "Access Denied" }), { status: 403, headers: { "Content-Type": "application/json" } });
    }

    const users = await this.userService.findAll();
    return new Response(JSON.stringify(users), { headers: { "Content-Type": "application/json" } });
  }

  private async login(request: Request): Promise<Response> {
    const body: CreateUserDto = await request.json();

    const user = await this.userService.login(body);
    const tokens = await this.userService.generateTokens(user);

    const { password: _, ...userWithoutPassword } = user;
    return new Response(JSON.stringify({ ...userWithoutPassword, ...tokens }), { headers: { "Content-Type": "application/json" } });
  }

  private async getUser(request: Request): Promise<Response> {
    const authHeader = request.headers.get("authorization");

    if (!authHeader) {
      // Create anonymous user
      const user = await this.userService.create({});
      const tokens = await this.userService.generateTokens(user);
      const { password: _, ...userWithoutPassword } = user;

      return new Response(JSON.stringify({ ...userWithoutPassword, ...tokens }), { headers: { "Content-Type": "application/json" } });
    }

    const [scheme, token] = authHeader.split(" ");
    if (scheme !== "Bearer" || !token) {
      return ErrorResponse.unauthorized("Invalid authorization scheme").toResponse();
    }

    const user = await this.userService.findOneByToken(token);
    if (!user) {
      return ErrorResponse.notFound("User not found").toResponse();
    }

    const { password: _, ...userWithoutPassword } = user;
    return new Response(JSON.stringify(userWithoutPassword), { headers: { "Content-Type": "application/json" } });
  }

  private async findOne(id: string): Promise<Response> {
    const user = await this.userService.findOneById(id);
    if (!user) {
      return new Response(JSON.stringify({ error: "User not found" }), { status: 404, headers: { "Content-Type": "application/json" } });
    }

    const { password: _, ...userWithoutPassword } = user;
    return new Response(JSON.stringify(userWithoutPassword), { headers: { "Content-Type": "application/json" } });
  }

  private async update(id: string, request: Request): Promise<Response> {
    const authHeader = request.headers.get("authorization");
    const body: UpdateUserDto = await request.json();

    let user: User;

    if (authHeader) {
      const [scheme, token] = authHeader.split(" ");
      if (scheme !== "Bearer" || !token) {
        return ErrorResponse.unauthorized("Invalid authorization scheme").toResponse();
      }
      user = await this.userService.updateByToken(token, body);
    } else {
      user = await this.userService.update(id, body);
    }

    const { password: _, ...userWithoutPassword } = user;
    return new Response(JSON.stringify(userWithoutPassword), { headers: { "Content-Type": "application/json" } });
  }

  private async remove(id: string): Promise<Response> {
    if (!DEV) {
      return new Response(JSON.stringify({ error: "Access Denied" }), { status: 403, headers: { "Content-Type": "application/json" } });
    }

    await this.userService.remove(id);
    return new Response(null, { status: 204 });
  }

  private async refresh(request: Request): Promise<Response> {
    const body = await request.json();

    if (!body || !body.refreshToken || typeof body.refreshToken !== "string") {
      return ErrorResponse.badRequest("Refresh token is required").toResponse();
    }

    const tokens = await this.userService.refresh(body.refreshToken);
    return new Response(JSON.stringify(tokens), { headers: { "Content-Type": "application/json" } });
  }
}
