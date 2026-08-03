import { connectToDatabase } from "../../libs/connect-db.js";
import { ObjectId } from "mongodb";

export async function updateWorkoutSessionStatus(req, res) {
  const userId = req.user?.sub;
  if (!userId) {
    return res.status(401).json({ error: "Authentication required" });
  }

  const { _id, status } = req.body || {};
  if (!_id || !ObjectId.isValid(_id)) {
    return res.status(400).json({ error: "Invalid session id" });
  }

  if (!status || typeof status !== "string") {
    return res.status(400).json({ error: "Invalid status" });
  }

  try {
    const current = new Date();
    const db = await connectToDatabase();
    const sessionsCollection = db.collection("workoutSessions");

    const update =
      status === "In progress"
        ? { $set: { status, startedAt: current } }
        : { $set: { status, finishedAt: current } };

    const result = await sessionsCollection.updateOne(
      { _id: new ObjectId(_id), userId },
      update,
    );

    if (result.matchedCount === 0) {
      return res
        .status(404)
        .json({ error: "Session not found or not authorized" });
    }

    return res.json({
      message: "Workout session status updated successfully!",
      current,
    });
  } catch (error) {
    console.error("Error changing workout session status:", error);
    return res
      .status(500)
      .json({ error: "Cannot change workout session status" });
  }
}