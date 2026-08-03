import { Router } from "express";
import { oauthRedirectCallback } from "../../controllers/auth/callback.controller.js";

const router = Router();

router.use((req, res, next) => {
  console.log(`[ROUTE] ${req.method} ${req.baseUrl}${req.path}`);
  next();
});

router.get("/callback", oauthRedirectCallback);

export default router;
