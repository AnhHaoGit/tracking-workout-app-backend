import { Router } from "express";
import { withAuth } from "../../middlewares/auth.middleware.ts";
import { getRepsStatistics } from "../../controllers/statistics/reps.controller.ts";

const router = Router();

router.use((req, res, next) => {
  console.log(`[ROUTE] ${req.method} ${req.baseUrl}${req.path}`);
  next();
});

router.get("/", withAuth, getRepsStatistics);

export default router;
