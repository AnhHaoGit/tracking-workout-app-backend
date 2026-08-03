import type { Request, Response, NextFunction } from "express";
import * as jose from "jose";
import { JWT_SECRET } from "../config/constants.ts";
import type { AuthUser } from "../config/type.ts";

declare global {
  namespace Express {
    interface Request {
      user?: AuthUser;
    }
  }
}

export async function withAuth(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    let token: string | null = null;

    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith("Bearer ")) {
      token = authHeader.split(" ")[1];
    }

    if (!token) {
      res.status(401).json({ error: "Authentication required" });
      return;
    }

    const jwtSecret = JWT_SECRET;
    if (!jwtSecret) {
      res.status(500).json({ error: "Server misconfiguration" });
      return;
    }

    const verified = await jose.jwtVerify(
      token,
      new TextEncoder().encode(jwtSecret),
    );

    const payload = verified.payload as AuthUser & { type?: string };
    if (payload.type !== "access") {
      res.status(401).json({ error: "Access token required" });
      return;
    }

    req.user = payload;
    next();
  } catch (error) {
    if (error instanceof jose.errors.JWTExpired) {
      console.error("Token expired:", error.reason);
      res.status(401).json({ error: "Token expired" });
    } else if (error instanceof jose.errors.JWTInvalid) {
      console.error("Invalid token:", error.message);
      res.status(401).json({ error: "Invalid token" });
    } else {
      console.error("Auth error:", error);
      res.status(500).json({ error: "Authentication failed" });
    }
  }
}
