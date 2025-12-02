import { ITokenRepository } from "./interfaces/ITokenRepository";
import { Token } from "@types";
import { db } from "@/db";
import { DatabaseError } from "@/core/errors";

export class TokenRepository implements ITokenRepository {
  async create(token: Token): Promise<Token> {
    try {
      await db.exec`
        INSERT INTO tokens (id, user_id, scopes, created_at, expires_at, token)
        VALUES (
          ${token.id}, 
          ${token.userId}, 
          ${token.scopes}, 
          ${token.createdAt}, 
          ${token.expiresAt}, 
          ${token.token}
        )
      `;
      return token;
    } catch (error: any) {
      console.error("Error creating token:", error);
      throw new DatabaseError("Failed to create token", error);
    }
  }

  async findActiveByUserId(userId: string): Promise<Token[]> {
    try {
      const now = new Date().toISOString();
      const rows = await db.query`
        SELECT id, user_id, scopes, created_at, expires_at, token
        FROM tokens
        WHERE user_id = ${userId} AND expires_at > ${now}
      `;

      const tokens: Token[] = [];
      for await (const row of rows) {
        tokens.push({
          id: row.id,
          userId: row.user_id,
          scopes: row.scopes,
          createdAt: new Date(row.created_at).toISOString(),
          expiresAt: new Date(row.expires_at).toISOString(),
          token: row.token,
        } as Token);
      }
      return tokens;
    } catch (error: any) {
      console.error("Error finding tokens:", error);
      throw new DatabaseError("Failed to find tokens", error);
    }
  }
}
