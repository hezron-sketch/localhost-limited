import { describe, it, expect, beforeAll } from "vitest";
import { sdk } from "./_core/sdk";

describe("Google OAuth Configuration", () => {
  it("should have Google OAuth credentials configured", () => {
    const clientId = process.env.GOOGLE_CLIENT_ID;
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
    const redirectUri = process.env.GOOGLE_REDIRECT_URI;

    expect(clientId).toBeDefined();
    expect(clientId).not.toBe("");
    expect(clientSecret).toBeDefined();
    expect(clientSecret).not.toBe("");
    expect(redirectUri).toBeDefined();
    expect(redirectUri).not.toBe("");
  });

  it("should have frontend Google Client ID configured", () => {
    const frontendClientId = process.env.VITE_GOOGLE_CLIENT_ID;
    expect(frontendClientId).toBeDefined();
    expect(frontendClientId).not.toBe("");
  });

  it("should have matching Client IDs between backend and frontend", () => {
    const backendClientId = process.env.GOOGLE_CLIENT_ID;
    const frontendClientId = process.env.VITE_GOOGLE_CLIENT_ID;
    expect(backendClientId).toBe(frontendClientId);
  });

  it("should have valid redirect URI format", () => {
    const redirectUri = process.env.GOOGLE_REDIRECT_URI;
    expect(redirectUri).toMatch(/^https?:\/\/.+\/api\/oauth\/callback$/);
  });

  it("should have database URL configured", () => {
    const databaseUrl = process.env.DATABASE_URL;
    expect(databaseUrl).toBeDefined();
    // Accept both PostgreSQL and MySQL for migration purposes
    expect(databaseUrl).toMatch(/^(postgresql|mysql):\/\//);
  });

  it("should have JWT secret configured", () => {
    const jwtSecret = process.env.JWT_SECRET;
    expect(jwtSecret).toBeDefined();
    expect(jwtSecret).not.toBe("");
  });
});
