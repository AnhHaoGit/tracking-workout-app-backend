import { Router } from "express";
import { withAuth } from "../../middlewares/auth.middleware.ts";
import {
  getWorkoutSession,
  updateWorkoutSession,
} from "../../controllers/database/workout-session.controller.ts";

const router = Router();

router.use((req, res, next) => {
  console.log(`[ROUTE] ${req.method} ${req.baseUrl}${req.path}`);
  next();
});

router.get("/", withAuth, getWorkoutSession);
router.post("/", withAuth, updateWorkoutSession);

export default router;
