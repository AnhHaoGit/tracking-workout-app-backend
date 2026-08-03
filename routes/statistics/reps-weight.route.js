import { Router } from "express";
import { withAuth } from "../../middlewares/auth.middleware.ts";
import { getRepsWeightStatistics } from "../../controllers/statistics/reps-weight.controller.ts";

const router = Router();

router.use((req, res, next) => {
  console.log(`[ROUTE] ${req.method} ${req.baseUrl}${req.path}`);
  next();
});

router.get("/", withAuth, getRepsWeightStatistics);

export default router;
