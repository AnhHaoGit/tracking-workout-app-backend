import { Router } from "express";
import { withAuth } from "../../middlewares/auth.middleware.js";
import { updateRoutine } from "../../controllers/database/routine.controller.js";

const router = Router();

router.use((req, res, next) => {
  console.log(`[ROUTE] ${req.method} ${req.baseUrl}${req.path}`);
  next();
});

router.post("/", withAuth, updateRoutine);

export default router;
