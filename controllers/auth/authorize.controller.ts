import type { Request, Response } from "express";
import {
  APP_SCHEME,
  BASE_URL,
  GOOGLE_AUTH_URL,
  GOOGLE_CLIENT_ID,
} from "../../config/constants.ts";

export function googleAuthRedirect(req: Request, res: Response) {
  if (!GOOGLE_CLIENT_ID) {
    return res
      .status(500)
      .json({ error: "Missing GOOGLE_CLIENT_ID environment variable" });
  }

  if (!BASE_URL || !APP_SCHEME) {
    return res
      .status(500)
      .json({ error: "Missing BASE_URL or APP_SCHEME environment variable" });
  }

  const internalClient = req.query.client_id as string | undefined;
  const redirectUri = req.query.redirect_uri as string | undefined;

  let platform: string;
  if (redirectUri === APP_SCHEME) {
    platform = "mobile";
  } else {
    return res.status(400).json({ error: "Invalid redirect_uri" });
  }

  const rawState = req.query.state as string | undefined;
  if (!rawState) {
    return res.status(400).json({ error: "Invalid state" });
  }

  // dùng state để biết đường redirect ngược lại platform
  const state = platform + "|" + rawState;

  let idpClientId: string;
  if (internalClient === "google") {
    idpClientId = GOOGLE_CLIENT_ID;
  } else {
    return res.status(400).json({ error: "Invalid client" });
  }

  const scope = (req.query.scope as string) || "identity";

  const params = new URLSearchParams({
    client_id: idpClientId,
    redirect_uri: BASE_URL + "/api/auth/callback",
    response_type: "code",
    scope,
    state,
    prompt: "select_account",
  });

  return res.redirect(GOOGLE_AUTH_URL + "?" + params.toString());
}
