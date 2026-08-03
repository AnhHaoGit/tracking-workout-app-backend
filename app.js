import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth/authorize.route.ts";
import callbackRoutes from "./routes/auth/callback.route.ts";
import tokenRoutes from "./routes/auth/token.route.ts";
import userRoutes from "./routes/database/user.route.ts";
import routineRoutes from "./routes/database/routine.route.ts";
import workoutSessionRoutes from "./routes/database/workout-session.route.ts";
import workoutSessionsRoutes from "./routes/database/workout-sessions.route.ts";
import workoutSessionExerciseRoutes from "./routes/database/workout-session-exercise.route.ts";
import workoutSessionStatusRoutes from "./routes/database/workout-session-status.route.ts";
import durationRoutes from "./routes/statistics/duration.route.ts";
import repsRoutes from "./routes/statistics/reps.route.ts";
import repsWeightRoutes from "./routes/statistics/reps-weight.route.ts";
import volumeRoutes from "./routes/statistics/volume.route.ts";

const app = express();

app.use(express.json());
app.use(cors({ origin: "*" }));

app.use("/api/auth", authRoutes);
app.use("/api/auth", callbackRoutes);
app.use("/api/auth", tokenRoutes);
app.use("/api/database/user", userRoutes);
app.use("/api/database/routine", routineRoutes);
app.use("/api/database/workout-session", workoutSessionRoutes);
app.use("/api/database/workout-sessions", workoutSessionsRoutes);
app.use("/api/database/workout-session-exercise", workoutSessionExerciseRoutes);
app.use("/api/database/workout-session-status", workoutSessionStatusRoutes);
app.use("/api/statistics/duration", durationRoutes);
app.use("/api/statistics/reps", repsRoutes);
app.use("/api/statistics/reps-weight", repsWeightRoutes);
app.use("/api/statistics/volume", volumeRoutes);

app.use((req, res) => {
  res.status(404).json({ error: "Endpoint not found" });
});

export default app;
