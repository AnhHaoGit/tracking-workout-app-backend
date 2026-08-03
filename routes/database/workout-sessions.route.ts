import { Router } from "express";
import { withAuth } from "../../middlewares/auth.middleware.ts";
import {
  createWorkoutSession,
  deleteWorkoutSession,
  getWorkoutSessions,
} from "../../controllers/database/workout-sessions.controller.ts";

const router = Router();

router.use((req, res, next) => {
  console.log(`[ROUTE] ${req.method} ${req.baseUrl}${req.path}`);
  next();
});

router.get("/", withAuth, getWorkoutSessions);
router.post("/", withAuth, createWorkoutSession);
router.delete("/", withAuth, deleteWorkoutSession);

export default router;
