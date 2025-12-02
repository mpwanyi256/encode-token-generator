import { APIError, ErrCode } from "encore.dev/api";

export class BadRequestError extends APIError {
  constructor(message: string) {
    super(ErrCode.InvalidArgument, message);
  }
}

export class NotFoundError extends APIError {
  constructor(message: string) {
    super(ErrCode.NotFound, message);
  }
}

export class InternalError extends APIError {
  constructor(message: string) {
    super(ErrCode.Internal, message);
  }
}

export class DatabaseError extends APIError {
  constructor(message: string, public originalError?: any) {
    super(ErrCode.Internal, message);
  }
}

