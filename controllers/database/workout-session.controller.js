import { connectToDatabase } from "../../libs/connect-db.js";
import { ObjectId } from "mongodb";

export async function updateWorkoutSession(req, res) {
  const userId = req.user?.sub;
  if (!userId) {
    return res.status(401).json({ error: "Authentication required" });
  }

  const updatedWorkoutSession = req.body?.updatedWorkoutSession;
  if (!updatedWorkoutSession || !updatedWorkoutSession._id) {
    return res.status(400).json({ error: "Missing workout session data" });
  }

  const { _id, userId: providedUserId, ...sessionData } = updatedWorkoutSession;
  if (!_id || !ObjectId.isValid(_id)) {
    return res.status(400).json({ error: "Invalid session id" });
  }

  try {
    const db = await connectToDatabase();
    const sessionsCollection = db.collection("workoutSessions");

    const result = await sessionsCollection.updateOne(
      { _id: new ObjectId(_id), userId },
      { $set: sessionData },
    );

    if (result.matchedCount === 0) {
      return res
        .status(404)
        .json({ error: "Session not found or not authorized" });
    }

    return res.json({ message: "Save the session successfully!" });
  } catch (error) {
    console.error("Error saving workout session:", error);
    return res.status(500).json({ error: "Cannot save workout session" });
  }
}

export async function getWorkoutSession(req, res) {
  const userId = req.user?.sub;
  if (!userId) {
    return res.status(401).json({ error: "Authentication required" });
  }

  const idQuery = req.query.id;
  const id =
    typeof idQuery === "string"
      ? idQuery
      : Array.isArray(idQuery)
        ? idQuery[0]
        : undefined;

  if (!id || typeof id !== "string" || !ObjectId.isValid(id)) {
    return res.status(400).json({ error: "Invalid session id" });
  }

  try {
    const db = await connectToDatabase();
    const result = await db.collection("workoutSessions").findOne({
      _id: new ObjectId(id),
      userId,
    });

    if (!result) {
      return res
        .status(404)
        .json({ error: "Session not found or not authorized" });
    }

    return res.json(result);
  } catch (error) {
    console.error("Error fetching workout session:", error);
    return res.status(500).json({ error: "Cannot fetch workout session" });
  }
}