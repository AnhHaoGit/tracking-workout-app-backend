import { Router } from "express";
import { withAuth } from "../../middlewares/auth.middleware.ts";
import { updateRoutine } from "../../controllers/database/routine.controller.ts";

const router = Router();

router.use((req, res, next) => {
  console.log(`[ROUTE] ${req.method} ${req.baseUrl}${req.path}`);
  next();
});

router.post("/", withAuth, updateRoutine);

export default router;
