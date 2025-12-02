import { describe, it, expect } from "vitest";
import { validateApiKey } from "./apiKey";
import { APIError } from "encore.dev/api";

describe("API Key Middleware", () => {
  const VALID_API_KEY = process.env.API_KEY || "dev-api-key-12345";

  describe("validateApiKey", () => {
    it("should accept valid API key", () => {
      expect(() => validateApiKey(VALID_API_KEY)).not.toThrow();
    });

    it("should throw APIError for missing API key", () => {
      expect(() => validateApiKey("")).toThrow(APIError);
      expect(() => validateApiKey("")).toThrow(
        "API key is required. Please provide X-API-Key header."
      );
    });

    it("should throw APIError for invalid API key", () => {
      expect(() => validateApiKey("invalid-key")).toThrow(APIError);
      expect(() => validateApiKey("invalid-key")).toThrow("Invalid API key");
    });

    it("should throw APIError for wrong API key", () => {
      expect(() => validateApiKey("wrong-api-key-54321")).toThrow(APIError);
    });
  });
});
