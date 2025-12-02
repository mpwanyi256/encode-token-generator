import { APIError, ErrCode, Header } from "encore.dev/api";

const VALID_API_KEY = process.env.API_KEY || "dev-api-key-12345";

export interface WithAPIKey {
  apiKey: Header<"X-API-Key">;
}

/**
 * Validates the API key from the X-API-Key header
 * @param apiKey The API key from the request header
 * @throws APIError if the key is missing or invalid
 */
export function validateApiKey(apiKey: string): void {
  if (!apiKey) {
    throw new APIError(
      ErrCode.Unauthenticated,
      "API key is required. Please provide X-API-Key header."
    );
  }

  if (apiKey !== VALID_API_KEY) {
    throw new APIError(ErrCode.Unauthenticated, "Invalid API key");
  }
}
