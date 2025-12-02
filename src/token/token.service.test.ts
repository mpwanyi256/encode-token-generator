import { describe, it, expect, vi, beforeEach } from "vitest";
import { TokenService } from "./token.service";
import { ITokenRepository } from "@/repositories/interfaces/ITokenRepository";
import { Token, TokenScopes } from "@types";
import { APIError } from "encore.dev/api";

// Mock repository
const mockRepository: ITokenRepository = {
  create: vi.fn(),
  findActiveByUserId: vi.fn(),
};

describe("TokenService", () => {
  let tokenService: TokenService;

  beforeEach(() => {
    vi.clearAllMocks();
    tokenService = new TokenService(mockRepository);
  });

  describe("createToken", () => {
    it("should create a token with valid parameters", async () => {
      const userId = "user123";
      const scopes: TokenScopes[] = ["read", "write"];
      const expiresInMinutes = 60;

      const mockToken: Token = {
        id: "token_123",
        userId,
        scopes,
        createdAt: new Date().toISOString(),
        expiresAt: new Date(
          Date.now() + expiresInMinutes * 60 * 1000
        ).toISOString(),
        token: "abc123",
      };

      vi.mocked(mockRepository.create).mockResolvedValue(mockToken);

      const result = await tokenService.createToken(
        userId,
        scopes,
        expiresInMinutes
      );

      expect(result).toBeDefined();
      expect(result.userId).toBe(userId);
      expect(result.scopes).toEqual(scopes);
      expect(mockRepository.create).toHaveBeenCalledTimes(1);
      expect(mockRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({
          userId,
          scopes,
        })
      );
    });

    it("should generate a unique token ID with token_ prefix", async () => {
      const userId = "user123";
      const scopes: TokenScopes[] = ["read"];
      const expiresInMinutes = 30;

      vi.mocked(mockRepository.create).mockImplementation(
        async (token) => token
      );

      const result = await tokenService.createToken(
        userId,
        scopes,
        expiresInMinutes
      );

      expect(result.id).toMatch(/^token_[a-f0-9-]{36}$/);
    });

    it("should generate a 64-character hex token", async () => {
      const userId = "user123";
      const scopes: TokenScopes[] = ["read"];
      const expiresInMinutes = 30;

      vi.mocked(mockRepository.create).mockImplementation(
        async (token) => token
      );

      const result = await tokenService.createToken(
        userId,
        scopes,
        expiresInMinutes
      );

      expect(result.token).toMatch(/^[a-f0-9]{64}$/);
    });

    it("should calculate correct expiry time", async () => {
      const userId = "user123";
      const scopes: TokenScopes[] = ["read"];
      const expiresInMinutes = 60;

      const beforeCreate = Date.now();
      vi.mocked(mockRepository.create).mockImplementation(
        async (token) => token
      );

      const result = await tokenService.createToken(
        userId,
        scopes,
        expiresInMinutes
      );

      const afterCreate = Date.now();
      const createdAt = new Date(result.createdAt).getTime();
      const expiresAt = new Date(result.expiresAt).getTime();

      expect(createdAt).toBeGreaterThanOrEqual(beforeCreate);
      expect(createdAt).toBeLessThanOrEqual(afterCreate);
      expect(expiresAt - createdAt).toBe(expiresInMinutes * 60 * 1000);
    });

    it("should throw BadRequestError if userId is empty", async () => {
      await expect(tokenService.createToken("", ["read"], 60)).rejects.toThrow(
        APIError
      );
      await expect(tokenService.createToken("", ["read"], 60)).rejects.toThrow(
        "userId is required"
      );
    });

    it("should throw BadRequestError if scopes is empty array", async () => {
      await expect(tokenService.createToken("user123", [], 60)).rejects.toThrow(
        APIError
      );
      await expect(tokenService.createToken("user123", [], 60)).rejects.toThrow(
        "scopes must be a non-empty array"
      );
    });

    it("should throw BadRequestError if scopes is null", async () => {
      await expect(
        tokenService.createToken("user123", null as any, 60)
      ).rejects.toThrow(APIError);
    });

    it("should throw BadRequestError if expiresInMinutes is zero", async () => {
      await expect(
        tokenService.createToken("user123", ["read"], 0)
      ).rejects.toThrow(APIError);
      await expect(
        tokenService.createToken("user123", ["read"], 0)
      ).rejects.toThrow("expiresInMinutes must be a positive integer");
    });

    it("should throw BadRequestError if expiresInMinutes is negative", async () => {
      await expect(
        tokenService.createToken("user123", ["read"], -10)
      ).rejects.toThrow(APIError);
    });
  });

  describe("getActiveTokensByUserId", () => {
    it("should return active tokens for a valid userId", async () => {
      const userId = "user123";
      const mockTokens: Token[] = [
        {
          id: "token_1",
          userId,
          scopes: ["read"],
          createdAt: new Date().toISOString(),
          expiresAt: new Date(Date.now() + 3600000).toISOString(),
          token: "abc123",
        },
        {
          id: "token_2",
          userId,
          scopes: ["write"],
          createdAt: new Date().toISOString(),
          expiresAt: new Date(Date.now() + 7200000).toISOString(),
          token: "def456",
        },
      ];

      vi.mocked(mockRepository.findActiveByUserId).mockResolvedValue(
        mockTokens
      );

      const result = await tokenService.getActiveTokensByUserId(userId);

      expect(result).toEqual(mockTokens);
      expect(result).toHaveLength(2);
      expect(mockRepository.findActiveByUserId).toHaveBeenCalledWith(userId);
    });

    it("should return empty array if no active tokens exist", async () => {
      const userId = "user123";

      vi.mocked(mockRepository.findActiveByUserId).mockResolvedValue([]);

      const result = await tokenService.getActiveTokensByUserId(userId);

      expect(result).toEqual([]);
      expect(result).toHaveLength(0);
    });

    it("should throw BadRequestError if userId is empty string", async () => {
      await expect(tokenService.getActiveTokensByUserId("")).rejects.toThrow(
        APIError
      );
      await expect(tokenService.getActiveTokensByUserId("")).rejects.toThrow(
        "userId is required and must be a non-empty string"
      );
    });

    it("should throw BadRequestError if userId contains only whitespace", async () => {
      await expect(tokenService.getActiveTokensByUserId("   ")).rejects.toThrow(
        APIError
      );
      await expect(tokenService.getActiveTokensByUserId("   ")).rejects.toThrow(
        "userId is required and must be a non-empty string"
      );
    });
  });
});
