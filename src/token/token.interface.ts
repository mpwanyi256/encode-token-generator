export interface Token {
  id: string;
  userId: string;
  scopes: string[];
  createdAt: string;
  expiresAt: string;
  token: string;
}
