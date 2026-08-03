import type { Request, Response } from "express";
import { connectToDatabase } from "../../libs/connect-db.ts";
import formatDate from "../../libs/format-date.ts";

export async function getDurationStatistics(req: Request, res: Response) {
  const userId = req.user?.sub;
  if (!userId) {
    return res.status(401).json({ error: "Authentication required" });
  }

  const name = Array.isArray(req.query.name)
    ? req.query.name[0]
    : req.query.name;
  if (!name) {
    return res
      .status(400)
      .json({ error: "Missing required query param: name" });
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
            name,
            startedAt: { $ne: null },
            finishedAt: { $ne: null },
          },
        },
        {
          $project: {
            date: 1,
            time: 1,
            durationMinutes: {
              $divide: [
                {
                  $subtract: [
                    { $toDate: "$finishedAt" },
                    { $toDate: "$startedAt" },
                  ],
                },
                60000,
              ],
            },
          },
        },
        { $sort: { date: 1, time: 1 } },
      ])
      .toArray();

    const data = result.map((session) => ({
      label: formatDate(session.date),
      value: Math.round(session.durationMinutes * 100) / 100,
    }));

    return res.json(data);
  } catch (error) {
    console.error("Error fetching duration statistics:", error);
    return res.status(500).json({ error: "Cannot fetch duration statistics" });
  }
}
