import { Router } from "express";
import { withAuth } from "../../middlewares/auth.middleware.js";
import { getVolumeStatistics } from "../../controllers/statistics/volume.controller.js";

const router = Router();

router.use((req, res, next) => {
  console.log(`[ROUTE] ${req.method} ${req.baseUrl}${req.path}`);
  next();
});

router.get("/", withAuth, getVolumeStatistics);

export default router;
