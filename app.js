import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth/authorize.route.js";
import callbackRoutes from "./routes/auth/callback.route.js";
import tokenRoutes from "./routes/auth/token.route.js";
import userRoutes from "./routes/database/user.route.js";
import routineRoutes from "./routes/database/routine.route.js";
import workoutSessionRoutes from "./routes/database/workout-session.route.js";
import workoutSessionsRoutes from "./routes/database/workout-sessions.route.js";
import workoutSessionExerciseRoutes from "./routes/database/workout-session-exercise.route.js";
import workoutSessionStatusRoutes from "./routes/database/workout-session-status.route.js";
import durationRoutes from "./routes/statistics/duration.route.js";
import repsRoutes from "./routes/statistics/reps.route.js";
import repsWeightRoutes from "./routes/statistics/reps-weight.route.js";
import volumeRoutes from "./routes/statistics/volume.route.js";

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
