import { api } from "encore.dev/api";
import { tokenService } from "../token/token.service";
import { CreateTokenParams } from "../../types";
import { Token } from "../token/token.interface";

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
