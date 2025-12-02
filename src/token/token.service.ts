import { randomBytes, randomUUID } from "node:crypto";
import { Token } from "@types";
import { ITokenRepository } from "@/repositories/interfaces/ITokenRepository";
import { TokenRepository } from "@/repositories/TokenRepository";
import { BadRequestError } from "@/core/errors";

export class TokenService {
  constructor(private tokenRepo: ITokenRepository = new TokenRepository()) {}

  async createToken(
    userId: string,
    scopes: string[],
    expiresInMinutes: number
  ): Promise<Token> {
    if (!userId) throw new BadRequestError("userId is required");
    if (!scopes || scopes.length === 0)
      throw new BadRequestError("scopes must be a non-empty array");
    if (!expiresInMinutes || expiresInMinutes <= 0)
      throw new BadRequestError("expiresInMinutes must be a positive integer");

    const now = new Date();
    const expiresAt = new Date(now.getTime() + expiresInMinutes * 60 * 1000);

    const token: Token = {
      id: `token_${randomUUID()}`,
      userId,
      scopes,
      createdAt: now.toISOString(),
      expiresAt: expiresAt.toISOString(),
      token: randomBytes(32).toString("hex"),
    };

    return await this.tokenRepo.create(token);
  }

  async getActiveTokensByUserId(userId: string): Promise<Token[]> {
    if (!userId || userId.trim() === "") {
      throw new BadRequestError(
        "userId is required and must be a non-empty string"
      );
    }

    return await this.tokenRepo.findActiveByUserId(userId);
  }
}

export const tokenService = new TokenService();
