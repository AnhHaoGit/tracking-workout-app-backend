import type { Request, Response as ExpressResponse } from "express";
import * as jose from "jose";
import {
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  GOOGLE_REDIRECT_URI,
  JWT_EXPIRATION_TIME,
  JWT_SECRET,
} from "../../config/constants.ts";
import { connectToDatabase } from "../../libs/connect-db.ts";

const GOOGLE_JWKS = jose.createRemoteJWKSet(
  new URL("https://www.googleapis.com/oauth2/v3/certs"),
);

export async function exchangeGoogleToken(req: Request, res: ExpressResponse) {
  const code = req.body?.code as string | undefined;

  if (!code) {
    return res.status(400).json({ error: "Missing authorization code" });
  }

  if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET || !GOOGLE_REDIRECT_URI) {
    return res
      .status(500)
      .json({ error: "OAuth server configuration is incomplete" });
  }

  let fetchResponse: globalThis.Response;
  let data: any;

  try {
    fetchResponse = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        client_id: GOOGLE_CLIENT_ID,
        client_secret: GOOGLE_CLIENT_SECRET,
        redirect_uri: GOOGLE_REDIRECT_URI,
        grant_type: "authorization_code",
        code,
      }),
    });

    data = await fetchResponse.json();
  } catch (error) {
    console.error("Error fetching Google token:", error);
    return res
      .status(502)
      .json({ error: "Failed to contact Google OAuth server" });
  }

  if (!fetchResponse.ok || data.error) {
    return res.status(400).json({
      error: data.error || "Invalid OAuth response",
      error_description: data.error_description,
      message:
        "OAuth validation error - please ensure the app complies with Google's OAuth 2.0 policy",
    });
  }

  if (!data.id_token) {
    return res.status(400).json({ error: "Missing required parameters" });
  }

  let userInfo: Record<string, unknown>;
  try {
    const verified = await jose.jwtVerify(data.id_token, GOOGLE_JWKS, {
      issuer: ["https://accounts.google.com", "accounts.google.com"],
      audience: GOOGLE_CLIENT_ID,
    });
    userInfo = verified.payload as Record<string, unknown>;
  } catch (error) {
    return res.status(401).json({ error: "Invalid ID token" });
  }

  // Loại bỏ exp khỏi payload gốc trước khi ký token mới
  const { exp, ...userInfoWithoutExp } = userInfo as any;

  const sub = (userInfo as { sub: string }).sub;
  const issuedAt = Math.floor(Date.now() / 1000);

  if (!JWT_SECRET) {
    return res.status(500).json({ error: "Server misconfiguration" });
  }
  const jwtSecretBytes = new TextEncoder().encode(JWT_SECRET);

  const accessToken = await new jose.SignJWT({
    ...userInfoWithoutExp,
    type: "access",
  })
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime(JWT_EXPIRATION_TIME)
    .setSubject(sub)
    .setIssuedAt(issuedAt)
    .sign(jwtSecretBytes);

  try {
    const db = await connectToDatabase();
    const usersCollection = db.collection("users");
    const decoded = jose.decodeJwt(accessToken);
    const existingUser = await usersCollection.findOne({ sub: decoded.sub });

    if (!existingUser) {
      const newUser = {
        sub: decoded.sub,
        email: decoded.email,
        name: decoded.name,
        picture: decoded.picture,
        given_name: decoded.given_name,
        family_name: decoded.family_name,
        iat: decoded.iat,
        exp: decoded.exp,
      };
      await usersCollection.insertOne(newUser);
    } else {
      await usersCollection.updateOne(
        { sub: decoded.sub },
        { $set: { iat: decoded.iat, exp: decoded.exp } },
      );
    }
  } catch (e) {
    console.error("Error creating user:", e);
    return res.status(500).json({ error: "Cannot save user's data" });
  }

  return res.json({ accessToken });
}
