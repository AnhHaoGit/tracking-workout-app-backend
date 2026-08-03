import { connectToDatabase } from "../../libs/connect-db.ts";
import formatDate from "../../libs/format-date.ts";

const estimateOneRepMax = (weight, reps) => {
  return Math.round(weight * (1 + reps / 30) * 100) / 100;
};

export async function getRepsWeightStatistics(req, res) {
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
    const sessions = await sessionsCollection
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
        {
          $project: {
            date: 1,
            time: 1,
            sets: "$exercises.sets",
          },
        },
        { $sort: { date: 1, time: 1 } },
      ])
      .toArray();

    if (sessions.length === 0) {
      return res.json([]);
    }

    const maxSetsCount = sessions.reduce((max, session) => {
      const sets = Array.isArray(session.sets) ? session.sets : [];
      return Math.max(max, sets.length);
    }, 0);

    const data = Array.from({ length: maxSetsCount }, (_, setIndex) =>
      sessions.map((session) => {
        const sets = Array.isArray(session.sets) ? session.sets : [];
        const set = sets[setIndex];
        const hasData =
          set !== undefined &&
          typeof set.weight === "number" &&
          Number.isFinite(set.weight) &&
          typeof set.reps === "number" &&
          Number.isFinite(set.reps);

        return {
          label: formatDate(session.date),
          value: hasData ? estimateOneRepMax(set.weight, set.reps) : 0,
        };
      }),
    );

    return res.json(data);
  } catch (error) {
    console.error("Error fetching reps-weight statistics:", error);
    return res
      .status(500)
      .json({ error: "Cannot fetch reps-weight statistics" });
  }
}