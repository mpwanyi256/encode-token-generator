import { Token } from "@types";

export interface ITokenRepository {
  create(token: Token): Promise<Token>;
  findActiveByUserId(userId: string): Promise<Token[]>;
}
