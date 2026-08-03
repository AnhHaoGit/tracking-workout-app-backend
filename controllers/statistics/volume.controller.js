import { connectToDatabase } from "../../libs/connect-db.js";
import formatDate from "../../libs/format-date.js";

export async function getVolumeStatistics(req, res) {
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
        { $match: { userId, status: "Completed", name } },
        { $unwind: "$exercises" },
        { $unwind: "$exercises.sets" },
        {
          $group: {
            _id: "$_id",
            date: { $first: "$date" },
            time: { $first: "$time" },
            volume: {
              $sum: {
                $cond: [
                  {
                    $and: [
                      { $ne: ["$exercises.sets.weight", null] },
                      { $ne: ["$exercises.sets.reps", null] },
                    ],
                  },
                  {
                    $multiply: [
                      "$exercises.sets.weight",
                      "$exercises.sets.reps",
                    ],
                  },
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
      value: Math.round(session.volume * 100) / 100,
    }));

    return res.json(data);
  } catch (error) {
    console.error("Error fetching volume statistics:", error);
    return res.status(500).json({ error: "Cannot fetch volume statistics" });
  }
}
