import { APP_SCHEME } from "../../config/constants.js";

export function oauthRedirectCallback(req, res) {
  const combinedPlatformAndState = req.query.state;
  if (!combinedPlatformAndState) {
    return res.status(400).json({ error: "Invalid state" });
  }

  const [platform, state] = combinedPlatformAndState.split("|");
  if (!platform || !state) {
    return res.status(400).json({ error: "Invalid state format" });
  }

  const code = req.query.code;
  if (!code) {
    return res.status(400).json({ error: "Missing authorization code" });
  }

  const outgoingParams = new URLSearchParams({ code, state });
  return res.redirect(APP_SCHEME + "?" + outgoingParams.toString());
}
