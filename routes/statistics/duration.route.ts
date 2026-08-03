import { Router } from "express";
import { withAuth } from "../../middlewares/auth.middleware.ts";
import { getDurationStatistics } from "../../controllers/statistics/duration.controller.ts";

const router = Router();

router.use((req, res, next) => {
  console.log(`[ROUTE] ${req.method} ${req.baseUrl}${req.path}`);
  next();
});

router.get("/", withAuth, getDurationStatistics);

export default router;
