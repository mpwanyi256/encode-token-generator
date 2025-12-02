import { api } from "encore.dev/api";
import { tokenService } from "@/token/token.service";
import {
  CreateTokenParams,
  GetTokensParams,
  GetTokensResponse,
  Token,
} from "@types";
import { validateApiKey, WithAPIKey } from "@/middleware/apiKey";

type CreateTokenRequest = CreateTokenParams & WithAPIKey;

export const create = api<CreateTokenRequest, Token>(
  { method: "POST", path: "/api/tokens", expose: true },
  async ({ userId, scopes, expiresInMinutes, apiKey }) => {
    validateApiKey(apiKey);
    const token = await tokenService.createToken(
      userId,
      scopes,
      expiresInMinutes
    );
    return token;
  }
);

type ListTokensRequest = GetTokensParams & WithAPIKey;

export const list = api<ListTokensRequest, GetTokensResponse>(
  { method: "GET", path: "/api/tokens", expose: true },
  async ({ userId, apiKey }) => {
    validateApiKey(apiKey);
    const tokens = await tokenService.getActiveTokensByUserId(userId);
    return { tokens };
  }
);
