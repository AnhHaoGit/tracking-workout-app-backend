import { Router } from "express";
import { withAuth } from "../../middlewares/auth.middleware.js";
import { getUserData } from "../../controllers/database/user.controller.js";

const router = Router();

router.use((req, res, next) => {
  console.log(`[ROUTE] ${req.method} ${req.baseUrl}${req.path}`);
  next();
});

router.get("/", withAuth, getUserData);

export default router;
