import { Router } from "express";
import { withAuth } from "../../middlewares/auth.middleware.js";
import {
  addWorkoutSessionExercises,
  deleteWorkoutSessionExercise,
} from "../../controllers/database/workout-session-exercise.controller.js";

const router = Router();

router.use((req, res, next) => {
  console.log(`[ROUTE] ${req.method} ${req.baseUrl}${req.path}`);
  next();
});

router.post("/", withAuth, addWorkoutSessionExercises);
router.delete("/", withAuth, deleteWorkoutSessionExercise);

export default router;
