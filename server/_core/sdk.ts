import { AXIOS_TIMEOUT_MS, COOKIE_NAME, ONE_YEAR_MS } from "@shared/const";
import { ForbiddenError } from "@shared/_core/errors";
import axios, { type AxiosInstance } from "axios";
import { parse as parseCookieHeader } from "cookie";
import type { Request } from "express";
import { SignJWT, jwtVerify } from "jose";
import type { User } from "../../drizzle/schema";
import * as db from "../db";
import { ENV } from "./env";

// Utility function
const isNonEmptyString = (value: unknown): value is string =>
  typeof value === "string" && value.length > 0;

export type SessionPayload = {
  googleId: string;
  email: string;
  name: string;
};

export type GoogleTokenResponse = {
  access_token: string;
  expires_in: number;
  refresh_token?: string;
  scope: string;
  token_type: string;
  id_token: string;
};

export type GoogleUserInfo = {
  sub: string; // Google's unique user ID
  email: string;
  email_verified: boolean;
  name: string;
  picture: string;
  given_name?: string;
  family_name?: string;
  locale?: string;
};

class GoogleOAuthService {
  private clientId: string;
  private clientSecret: string;
  private redirectUri: string;

  constructor(clientId: string, clientSecret: string, redirectUri: string) {
    this.clientId = clientId;
    this.clientSecret = clientSecret;
    this.redirectUri = redirectUri;
    
    if (!clientId || !clientSecret) {
      console.error(
        "[OAuth] ERROR: Google OAuth credentials not configured! Set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET environment variables."
      );
    }
  }

  async exchangeCodeForToken(code: string): Promise<GoogleTokenResponse> {
    try {
      const { data } = await axios.post<GoogleTokenResponse>(
        "https://oauth2.googleapis.com/token",
        {
          code,
          client_id: this.clientId,
          client_secret: this.clientSecret,
          redirect_uri: this.redirectUri,
          grant_type: "authorization_code",
        },
        { timeout: AXIOS_TIMEOUT_MS }
      );
      return data;
    } catch (error) {
      console.error("[OAuth] Token exchange failed:", error);
      throw new Error("Failed to exchange authorization code for token");
    }
  }

  async getUserInfo(accessToken: string): Promise<GoogleUserInfo> {
    try {
      const { data } = await axios.get<GoogleUserInfo>(
        "https://www.googleapis.com/oauth2/v2/userinfo",
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          timeout: AXIOS_TIMEOUT_MS,
        }
      );
      return data;
    } catch (error) {
      console.error("[OAuth] Failed to get user info:", error);
      throw new Error("Failed to retrieve user information from Google");
    }
  }

  decodeIdToken(idToken: string): GoogleUserInfo {
    try {
      // Decode JWT without verification (in production, you should verify the signature)
      const parts = idToken.split(".");
      if (parts.length !== 3) {
        throw new Error("Invalid token format");
      }

      const decoded = JSON.parse(
        Buffer.from(parts[1], "base64").toString("utf-8")
      );

      return decoded as GoogleUserInfo;
    } catch (error) {
      console.error("[OAuth] Failed to decode ID token:", error);
      throw new Error("Failed to decode ID token");
    }
  }
}

class SDKServer {
  private readonly googleOAuth: GoogleOAuthService;

  constructor(
    clientId: string = ENV.googleClientId,
    clientSecret: string = ENV.googleClientSecret,
    redirectUri: string = ENV.googleRedirectUri
  ) {
    this.googleOAuth = new GoogleOAuthService(clientId, clientSecret, redirectUri);
  }

  /**
   * Exchange OAuth authorization code for access token
   */
  async exchangeCodeForToken(code: string): Promise<GoogleTokenResponse> {
    return this.googleOAuth.exchangeCodeForToken(code);
  }

  /**
   * Get user information using access token
   */
  async getUserInfo(accessToken: string): Promise<GoogleUserInfo> {
    return this.googleOAuth.getUserInfo(accessToken);
  }

  /**
   * Decode and extract user info from ID token
   */
  decodeIdToken(idToken: string): GoogleUserInfo {
    return this.googleOAuth.decodeIdToken(idToken);
  }

  private parseCookies(cookieHeader: string | undefined) {
    if (!cookieHeader) {
      return new Map<string, string>();
    }

    const parsed = parseCookieHeader(cookieHeader);
    return new Map(Object.entries(parsed));
  }

  private getSessionSecret() {
    const secret = ENV.cookieSecret;
    return new TextEncoder().encode(secret);
  }

  /**
   * Create a session token for a Google user
   */
  async createSessionToken(
    googleId: string,
    email: string,
    options: { expiresInMs?: number; name?: string } = {}
  ): Promise<string> {
    return this.signSession(
      {
        googleId,
        email,
        name: options.name || "",
      },
      options
    );
  }

  async signSession(
    payload: SessionPayload,
    options: { expiresInMs?: number } = {}
  ): Promise<string> {
    const issuedAt = Date.now();
    const expiresInMs = options.expiresInMs ?? ONE_YEAR_MS;
    const expirationSeconds = Math.floor((issuedAt + expiresInMs) / 1000);
    const secretKey = this.getSessionSecret();

    return new SignJWT({
      googleId: payload.googleId,
      email: payload.email,
      name: payload.name,
    })
      .setProtectedHeader({ alg: "HS256", typ: "JWT" })
      .setExpirationTime(expirationSeconds)
      .sign(secretKey);
  }

  async verifySession(
    cookieValue: string | undefined | null
  ): Promise<{ googleId: string; email: string; name: string } | null> {
    if (!cookieValue) {
      console.warn("[Auth] Missing session cookie");
      return null;
    }

    try {
      const secretKey = this.getSessionSecret();
      const { payload } = await jwtVerify(cookieValue, secretKey, {
        algorithms: ["HS256"],
      });
      const { googleId, email, name } = payload as Record<string, unknown>;

      if (
        !isNonEmptyString(googleId) ||
        !isNonEmptyString(email) ||
        !isNonEmptyString(name)
      ) {
        console.warn("[Auth] Session payload missing required fields");
        return null;
      }

      return {
        googleId,
        email,
        name,
      };
    } catch (error) {
      console.warn("[Auth] Session verification failed", String(error));
      return null;
    }
  }

  async authenticateRequest(req: Request): Promise<User> {
    // Regular authentication flow
    const cookies = this.parseCookies(req.headers.cookie);
    const sessionCookie = cookies.get(COOKIE_NAME);
    const session = await this.verifySession(sessionCookie);

    if (!session) {
      throw ForbiddenError("Invalid session cookie");
    }

    const signedInAt = new Date();
    let user = await db.getUserByGoogleId(session.googleId);

    // If user not in DB, create new user
    if (!user) {
      try {
        await db.upsertUser({
          googleId: session.googleId,
          name: session.name || null,
          email: session.email || null,
          loginMethod: "google",
          lastSignedIn: signedInAt,
        });
        user = await db.getUserByGoogleId(session.googleId);
      } catch (error) {
        console.error("[Auth] Failed to create user:", error);
        throw ForbiddenError("Failed to create user");
      }
    }

    if (!user) {
      throw ForbiddenError("User not found");
    }

    // Update last signed in time
    await db.upsertUser({
      googleId: user.googleId,
      lastSignedIn: signedInAt,
    });

    return user;
  }
}

export const sdk = new SDKServer();
