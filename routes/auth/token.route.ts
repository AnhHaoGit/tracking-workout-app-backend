import { Router } from "express";
import { exchangeGoogleToken } from "../../controllers/auth/token.controller.ts";
import multer from "multer";
const upload = multer();

const router = Router();

router.use((req, res, next) => {
  console.log(`[ROUTE] ${req.method} ${req.baseUrl}${req.path}`);
  next();
});

router.post("/token", upload.none(), exchangeGoogleToken);

export default router;
