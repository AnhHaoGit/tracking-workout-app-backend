import { Router } from "express";
import { withAuth } from "../../middlewares/auth.middleware.js";
import { getRepsWeightStatistics } from "../../controllers/statistics/reps-weight.controller.js";

const router = Router();

router.use((req, res, next) => {
  console.log(`[ROUTE] ${req.method} ${req.baseUrl}${req.path}`);
  next();
});

router.get("/", withAuth, getRepsWeightStatistics);

export default router;
