import type { Request, Response } from "express";
import { connectToDatabase } from "../../libs/connect-db.ts";
import formatDate from "../../libs/format-date.ts";

export async function getRepsStatistics(req: Request, res: Response) {
  const userId = req.user?.sub;
  if (!userId) {
    return res.status(401).json({ error: "Authentication required" });
  }

  const exerciseIdParam = Array.isArray(req.query.exerciseId)
    ? req.query.exerciseId[0]
    : req.query.exerciseId;

  if (!exerciseIdParam) {
    return res
      .status(400)
      .json({ error: "Missing required query param: exerciseId" });
  }

  const exerciseId = Number(exerciseIdParam);
  if (Number.isNaN(exerciseId)) {
    return res.status(400).json({ error: "exerciseId must be a number" });
  }

  try {
    const db = await connectToDatabase();
    const sessionsCollection = db.collection("workoutSessions");

    const result = await sessionsCollection
      .aggregate([
        {
          $match: {
            userId,
            status: "Completed",
            "exercises.id": exerciseId,
          },
        },
        { $unwind: "$exercises" },
        { $match: { "exercises.id": exerciseId } },
        { $unwind: "$exercises.sets" },
        {
          $group: {
            _id: "$_id",
            date: { $first: "$date" },
            time: { $first: "$time" },
            totalReps: {
              $sum: {
                $cond: [
                  { $ne: ["$exercises.sets.reps", null] },
                  "$exercises.sets.reps",
                  0,
                ],
              },
            },
          },
        },
        { $sort: { date: 1, time: 1 } },
      ])
      .toArray();

    const data = result.map((session) => ({
      label: formatDate(session.date),
      value: session.totalReps,
    }));

    return res.json(data);
  } catch (error) {
    console.error("Error fetching reps statistics:", error);
    return res.status(500).json({ error: "Cannot fetch reps statistics" });
  }
}
