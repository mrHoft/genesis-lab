import * as bcrypt from "bcrypt";
import { CreateUserDto, UpdateUserDto, User } from "~/types/user.ts";
import { JwtUtils, type JwtPayload } from "~/utils/jwt.ts";
import { executeQuery } from "~/db/client.ts";
import { validatePassword } from "~/utils/validation.ts";
import { ErrorResponse } from "~/utils/error.ts";

const JWT_TOKEN_KEY = Deno.env.get("JWT_TOKEN_KEY");
const JWT_REFRESH_KEY = Deno.env.get("JWT_REFRESH_KEY");

if (!JWT_TOKEN_KEY) {
  throw new Error("JWT_TOKEN_KEY environment variable is required");
}
if (!JWT_REFRESH_KEY) {
  throw new Error("JWT_REFRESH_KEY environment variable is required");
}

const TOKEN_EXPIRE_TIME = Deno.env.get("TOKEN_EXPIRE_TIME") || "1h";
const REFRESH_EXPIRE_TIME = Deno.env.get("REFRESH_EXPIRE_TIME") || "7d";

export class UserService {
  findAll(): Promise<User[]> {
    return executeQuery<User>(
      "SELECT id, name, login, email, version, created_at as \"createdAt\", updated_at as \"updatedAt\" FROM users"
    );
  }

  async findOneById(id: string): Promise<User | null> {
    const users = await executeQuery<User>(
      "SELECT id, name, login, email, password, version, created_at as \"createdAt\", updated_at as \"updatedAt\" FROM users WHERE id = $1",
      [id]
    );
    return users[0] || null;
  }

  async findOneByLogin(login: string): Promise<User | null> {
    const users = await executeQuery<User>(
      "SELECT id, name, login, email, password, version, created_at as \"createdAt\", updated_at as \"updatedAt\" FROM users WHERE login = $1",
      [login]
    );
    return users[0] || null;
  }

  async findOneByToken(token: string): Promise<User | null> {
    try {
      const payload = await JwtUtils.verify(token, JWT_TOKEN_KEY!);
      return this.findOneById(payload.id);
    } catch (error) {
      throw ErrorResponse.fromError(error, 401);
    }
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    if (createUserDto.password) {
      validatePassword(createUserDto.password);
    }

    const hashedPassword = createUserDto.password ? bcrypt.hashSync(createUserDto.password) : undefined;

    const users = await executeQuery<User>(
      `INSERT INTO users (name, login, email, password)
       VALUES ($1, $2, $3, $4)
       RETURNING id, name, login, email, version, created_at as \"createdAt\", updated_at as \"updatedAt\"`,
      [
        createUserDto.name || `User_${Math.random().toString(36).slice(2, 10)}`,
        createUserDto.login,
        createUserDto.email,
        hashedPassword
      ]
    );

    return users[0];
  }

  async login(loginUserDto: CreateUserDto): Promise<User> {
    if (!loginUserDto.login || !loginUserDto.password) {
      throw ErrorResponse.unauthorized("Invalid credentials")
    }
    const user = await this.findOneByLogin(loginUserDto.login)

    if (!user || !user.password) {
      throw ErrorResponse.unauthorized()
    }

    const isValid = bcrypt.compareSync(loginUserDto.password, user.password);
    if (!isValid) {
      throw ErrorResponse.unauthorized("Invalid credentials");
    }

    return user
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    if (updateUserDto.newPassword) {
      try {
        validatePassword(updateUserDto.newPassword);
      } catch (error) {
        throw ErrorResponse.fromError(error, 400)
      }
    }

    if (updateUserDto.login) {
      const exists = await executeQuery<{ id: string }>(
        "SELECT id FROM users WHERE login = $1",
        [updateUserDto.login]
      );
      if (exists.length > 0 && exists[0].id !== id) {
        throw ErrorResponse.badRequest(`User with ${updateUserDto.login} login already exists`)
      }
    }

    const user = (await executeQuery<{ password?: string }>(
      "SELECT password FROM users WHERE id = $1",
      [id]
    ))[0];

    if (user?.password) {
      const isValid = bcrypt.compareSync(updateUserDto.password, user.password);
      if (!isValid) {
        throw ErrorResponse.unauthorized("Invalid credentials");
      }
    }

    const updates: string[] = [];
    const values: string[] = [];
    let paramCount = 1;

    if (updateUserDto.name) {
      updates.push(`name = $${paramCount}`);
      values.push(updateUserDto.name);
      paramCount++;
    }

    if (updateUserDto.login) {
      updates.push(`login = $${paramCount}`);
      values.push(updateUserDto.login);
      paramCount++;
    }

    if (updateUserDto.email) {
      updates.push(`email = $${paramCount}`);
      values.push(updateUserDto.email);
      paramCount++;
    }

    if (updateUserDto.newPassword) {
      updates.push(`password = $${paramCount}`);
      values.push(bcrypt.hashSync(updateUserDto.newPassword));
      paramCount++;
    }

    updates.push(`version = version + 1`);
    updates.push(`updated_at = EXTRACT(EPOCH FROM NOW())::integer`);

    values.push(id);

    const query = /* sql */`
      UPDATE users
      SET ${updates.join(", ")}
      WHERE id = $${paramCount}
      RETURNING id, name, login, email, version, created_at as \"createdAt\", updated_at as \"updatedAt\"
    `;

    const result = await executeQuery<User>(query, values);
    return result[0];
  }

  async updateByToken(token: string, updateUserDto: UpdateUserDto): Promise<User> {
    try {
      const payload = await JwtUtils.verify(token, JWT_TOKEN_KEY!);
      return this.update(payload.id, updateUserDto);
    } catch (error) {
      throw ErrorResponse.fromError(error, 401);
    }
  }

  async remove(id: string): Promise<void> {
    await executeQuery(
      "DELETE FROM users WHERE id = $1",
      [id]
    );
  }

  async refresh(refreshToken: string): Promise<{ accessToken: string; refreshToken: string }> {
    try {
      const payload = await JwtUtils.verify(refreshToken, JWT_REFRESH_KEY!);
      const user = await this.findOneById(payload.id);

      if (!user) {
        throw ErrorResponse.notFound("User not found");
      }

      return this.generateTokens(user);
    } catch (error) {
      throw ErrorResponse.fromError(error, 401);
    }
  }

  async generateTokens(user: User): Promise<{ accessToken: string; refreshToken: string }> {
    const payload: JwtPayload = { id: user.id };
    if (user.login) {
      payload.login = user.login;
    }

    return {
      accessToken: await JwtUtils.sign(payload, JWT_TOKEN_KEY!, TOKEN_EXPIRE_TIME),
      refreshToken: await JwtUtils.sign(payload, JWT_REFRESH_KEY!, REFRESH_EXPIRE_TIME),
    };
  }
}
