export type TokenScopes = "read" | "write" | "delete";

export interface UserTokenData {
  id: string;
  userId: string;
  scopes: TokenScopes[];
}

export interface Token {
  id: string;
  userId: string;
  scopes: string[];
  createdAt: string;
  expiresAt: string;
  token: string;
}

export interface CreateTokenParams extends Omit<UserTokenData, "id"> {
  expiresInMinutes: number;
}

export interface TokenResponse extends UserTokenData {
  createdAt: string;
  expiresAt: string;
  token: string;
}

export interface GetTokensParams {
  userId: string;
}

export interface GetTokensResponse {
  tokens: Token[];
}
