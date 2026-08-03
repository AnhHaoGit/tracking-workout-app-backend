import { connectToDatabase } from "../../libs/connect-db.ts";
import { ObjectId } from "mongodb";

export async function getWorkoutSessions(req, res) {
  const userId = req.user?.sub;
  if (!userId) {
    return res.status(401).json({ error: "Authentication required" });
  }

  try {
    const db = await connectToDatabase();
    const sessionsCollection = db.collection("workoutSessions");
    const sessions = await sessionsCollection
      .find({ userId })
      .sort({ createdAt: -1 })
      .toArray();

    return res.json(sessions);
  } catch (error) {
    console.error("Error fetching workout sessions:", error);
    return res.status(500).json({ error: "Cannot fetch workout sessions" });
  }
}

export async function createWorkoutSession(req, res) {
  const userId = req.user?.sub;
  if (!userId) {
    return res.status(401).json({ error: "Authentication required" });
  }

  const body = req.body;
  if (!body || typeof body !== "object") {
    return res.status(400).json({ error: "Invalid session payload" });
  }

  try {
    const db = await connectToDatabase();
    const sessionsCollection = db.collection("workoutSessions");

    const session = {
      ...body,
      userId,
      createdAt: body.createdAt ? new Date(body.createdAt) : new Date(),
    };

    const insertResult = await sessionsCollection.insertOne(session);
    const createdSession = { ...session, _id: insertResult.insertedId };
    return res.status(201).json(createdSession);
  } catch (error) {
    console.error("Error creating workout session:", error);
    return res.status(500).json({ error: "Cannot create workout session" });
  }
}

export async function deleteWorkoutSession(req, res) {
  const userId = req.user?.sub;
  if (!userId) {
    return res.status(401).json({ error: "Authentication required" });
  }

  const id = req.body?._id;
  if (!id || !ObjectId.isValid(id)) {
    return res.status(400).json({ error: "Invalid session id" });
  }

  try {
    const db = await connectToDatabase();
    const sessionsCollection = db.collection("workoutSessions");
    const result = await sessionsCollection.deleteOne({
      _id: new ObjectId(id),
      userId,
    });

    if (result.deletedCount === 0) {
      return res
        .status(404)
        .json({ error: "Session not found or not authorized" });
    }

    return res.json({ success: true, _id: id });
  } catch (error) {
    console.error("Error deleting workout session:", error);
    return res.status(500).json({ error: "Cannot delete workout session" });
  }
}