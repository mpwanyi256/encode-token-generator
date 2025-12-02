import { api } from "encore.dev/api";
import { tokenService } from "@/token/token.service";
import {
  CreateTokenParams,
  GetTokensParams,
  GetTokensResponse,
  Token,
} from "@types";

export const create = api(
  { method: "POST", path: "/api/tokens", expose: true },
  async (params: CreateTokenParams): Promise<Token> => {
    const token = await tokenService.createToken(
      params.userId,
      params.scopes,
      params.expiresInMinutes
    );

    return token;
  }
);

export const list = api<GetTokensParams, GetTokensResponse>(
  { method: "GET", path: "/api/tokens", expose: true },
  async ({ userId }) => {
    const tokens = await tokenService.getActiveTokensByUserId(userId);
    return { tokens };
  }
);
