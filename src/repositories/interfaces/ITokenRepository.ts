import { Token } from "../../token/token.interface";

export interface ITokenRepository {
  create(token: Token): Promise<Token>;
  findActiveByUserId(userId: string): Promise<Token[]>;
}

