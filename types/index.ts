export type TokenScopes = "read" | "write" | "delete";

export interface CreateTokenParams {
  userId: string;
  scopes: TokenScopes[];
  expiresInMinutes: number;
}

export interface TokenResponse {
  id: string;
  userId: string;
  scopes: TokenScopes[];
  createdAt: string;
  expiresAt: string;
  token: string;
}
