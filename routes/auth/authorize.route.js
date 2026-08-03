import { Router } from "express";
import { googleAuthRedirect } from "../../controllers/auth/authorize.controller.js";

const router = Router();

router.use((req, res, next) => {
  console.log(`[ROUTE] ${req.method} ${req.baseUrl}${req.path}`);
  next();
});

router.get("/authorize", googleAuthRedirect);

export default router;
