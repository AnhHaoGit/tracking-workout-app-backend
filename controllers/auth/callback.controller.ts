import type { Request, Response } from "express";
import { APP_SCHEME } from "../../config/constants.ts";

export function oauthRedirectCallback(req: Request, res: Response) {
  const combinedPlatformAndState = req.query.state as string | undefined;
  if (!combinedPlatformAndState) {
    return res.status(400).json({ error: "Invalid state" });
  }

  const [platform, state] = combinedPlatformAndState.split("|");
  if (!platform || !state) {
    return res.status(400).json({ error: "Invalid state format" });
  }

  const code = req.query.code as string | undefined;
  if (!code) {
    return res.status(400).json({ error: "Missing authorization code" });
  }

  const outgoingParams = new URLSearchParams({ code, state });
  return res.redirect(APP_SCHEME + "?" + outgoingParams.toString());
}
