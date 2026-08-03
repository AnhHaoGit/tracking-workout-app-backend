import { connectToDatabase } from "../../libs/connect-db.js";
import { ObjectId } from "mongodb";

export async function deleteWorkoutSessionExercise(req, res) {
  const userId = req.user?.sub;
  if (!userId) {
    return res.status(401).json({ error: "Authentication required" });
  }

  const { _id, exerciseIndex } = req.body || {};
  if (!_id || !ObjectId.isValid(_id)) {
    return res.status(400).json({ error: "Invalid session id" });
  }

  if (
    typeof exerciseIndex !== "number" ||
    !Number.isInteger(exerciseIndex) ||
    exerciseIndex < 0
  ) {
    return res.status(400).json({ error: "Invalid exercise index" });
  }

  try {
    const db = await connectToDatabase();
    const sessionsCollection = db.collection("workoutSessions");

    const session = await sessionsCollection.findOne({
      _id: new ObjectId(_id),
      userId,
    });

    if (!session) {
      return res.status(404).json({ error: "Workout session not found." });
    }

    if (
      !Array.isArray(session.exercises) ||
      exerciseIndex >= session.exercises.length
    ) {
      return res.status(400).json({ error: "Exercise index out of range" });
    }

    const updatedExercises = session.exercises.filter(
      (_, idx) => idx !== exerciseIndex,
    );

    const result = await sessionsCollection.findOneAndUpdate(
      { _id: new ObjectId(_id), userId },
      { $set: { exercises: updatedExercises } },
      { returnDocument: "after" },
    );

    if (!result) {
      return res
        .status(404)
        .json({ error: "Workout session not found after update." });
    }

    return res.json({
      message: "Delete exercise successfully!",
      session: result,
    });
  } catch (error) {
    console.error("Error deleting exercise:", error);
    return res.status(500).json({ error: "Cannot delete exercise." });
  }
}

export async function addWorkoutSessionExercises(req, res) {
  const userId = req.user?.sub;
  if (!userId) {
    return res.status(401).json({ error: "Authentication required" });
  }

  const { _id, exercises } = req.body || {};
  if (!_id || !ObjectId.isValid(_id)) {
    return res.status(400).json({ error: "Invalid session id" });
  }

  if (!Array.isArray(exercises)) {
    return res.status(400).json({ error: "Invalid exercises payload" });
  }

  try {
    const db = await connectToDatabase();
    const sessionsCollection = db.collection("workoutSessions");

    const session = await sessionsCollection.findOne({
      _id: new ObjectId(_id),
      userId,
    });

    if (!session) {
      return res.status(404).json({ error: "Workout session not found." });
    }

    const updatedExercises = [...session.exercises, ...exercises];

    const result = await sessionsCollection.findOneAndUpdate(
      { _id: new ObjectId(_id), userId },
      { $set: { exercises: updatedExercises } },
      { returnDocument: "after" },
    );

    return res.json({
      message: "Add exercises successfully!",
      session: result,
    });
  } catch (error) {
    console.error("Error adding exercises:", error);
    return res.status(500).json({ error: "Cannot add exercises." });
  }
}
