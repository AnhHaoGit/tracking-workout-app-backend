import { Router } from "express";
import { withAuth } from "../../middlewares/auth.middleware.js";
import { updateWorkoutSessionStatus } from "../../controllers/database/workout-session-status.controller.js";

const router = Router();

router.use((req, res, next) => {
  console.log(`[ROUTE] ${req.method} ${req.baseUrl}${req.path}`);
  next();
});

router.post("/", withAuth, updateWorkoutSessionStatus);

export default router;
