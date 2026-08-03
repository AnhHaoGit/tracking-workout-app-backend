import type { Request, Response } from "express";
import { connectToDatabase } from "../../libs/connect-db.ts";

export async function updateRoutine(req: Request, res: Response) {
  const userId = req.user?.sub;
  if (!userId) {
    return res.status(401).json({ error: "Authentication required" });
  }

  const routine = req.body?.routine;
  if (!routine) {
    return res.status(400).json({ error: "Missing routine payload" });
  }

  try {
    const db = await connectToDatabase();
    const usersCollection = db.collection("users");

    const result = await usersCollection.updateOne(
      { sub: userId },
      { $set: { routine } },
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ error: "Cannot find user's data" });
    }

    return res.json({ message: "Update workout routine successfully!" });
  } catch (error) {
    console.error("Error updating user routine:", error);
    return res.status(500).json({ error: "Cannot save user's data" });
  }
}
