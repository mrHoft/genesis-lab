import { executeQuery } from "~/db/client.ts";
import type { Gallery } from "~/types/gallery.ts";
import { JwtUtils } from "~/utils/jwt.ts";
import { ErrorResponse } from "~/utils/error.ts";

const JWT_TOKEN_KEY = Deno.env.get("JWT_TOKEN_KEY");
if (!JWT_TOKEN_KEY) {
  throw new Error("JWT_TOKEN_KEY environment variable is required");
}

export class GalleryService {
  async findOneById(id: string): Promise<Gallery | null> {
    const result = await executeQuery<Gallery>(
      "SELECT * FROM gallery WHERE id = $1",
      [id]
    );
    return result[0] || null;
  }

  async findAll(page: number = 1, limit: number = 10, userId?: string): Promise<{ records: Gallery[]; total: number }> {
    const offset = (page - 1) * limit;

    let whereClause = "";
    const params: string[] = [limit.toString(), offset.toString()];

    if (userId) {
      params.push(userId);
      whereClause = `WHERE user_id = $${params.length}`;
    }

    const recordsQuery = `
      SELECT * FROM gallery
      ${whereClause}
      ORDER BY created_at DESC
      LIMIT $1 OFFSET $2
    `;

    const countQuery = `
      SELECT COUNT(*) FROM gallery
      ${userId ? 'WHERE user_id = $1' : ''}
    `;

    const [recordsResult, countResult] = await Promise.all([
      executeQuery<Gallery>(recordsQuery, params),
      executeQuery<{ count: string }>(countQuery, userId ? [userId] : [])
    ]);

    return {
      records: recordsResult,
      total: parseInt(countResult[0]?.count || "0")
    };
  }

  async create(gallery: Omit<Gallery, "id" | "created_at">, token: string): Promise<Gallery> {
    let userId = 'unknown'
    try {
      const payload = await JwtUtils.verify(token, JWT_TOKEN_KEY!);
      userId = payload.id
    } catch (error) {
      throw ErrorResponse.fromError(error, 401);
    }

    const result = await executeQuery<Gallery>(
      `INSERT INTO gallery (user_id, thumbnail, props)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [
        userId,
        gallery.thumbnail,
        JSON.stringify(gallery.props || {})
      ]
    );
    return result[0];
  }

  async remove(id: string, token: string): Promise<void> {
    let userId = 'unknown'
    try {
      const payload = await JwtUtils.verify(token, JWT_TOKEN_KEY!);
      userId = payload.id
    } catch (error) {
      throw ErrorResponse.fromError(error, 401);
    }
    await executeQuery(
      "DELETE FROM gallery WHERE id = $1 AND user_id = $2",
      [id, userId]
    );
  }

  async addLike(id: string, token: string): Promise<Gallery | null> {
    let userId = 'unknown'
    try {
      const payload = await JwtUtils.verify(token, JWT_TOKEN_KEY!);
      userId = payload.id
    } catch (error) {
      throw ErrorResponse.fromError(error, 401);
    }

    const result = await executeQuery<Gallery>(
      `UPDATE gallery
     SET likes = CASE
       WHEN $2 = ANY(likes) THEN array_remove(likes, $2)
       ELSE array_append(likes, $2)
     END
     WHERE id = $1
     RETURNING *`,
      [id, userId]
    );

    return result[0] || null;
  }
}
