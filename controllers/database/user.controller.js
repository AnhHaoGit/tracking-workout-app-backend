import { connectToDatabase } from "../../libs/connect-db.ts";

export async function getUserData(req, res) {
  console.log("getUserData called");
  const userId = req.user?.sub;
  if (!userId) {
    return res.status(401).json({ error: "Authentication required" });
  }

  try {
    const db = await connectToDatabase();
    const usersCollection = db.collection("users");
    const userData = await usersCollection.findOne({ sub: userId });

    if (!userData) {
      return res.status(404).json({ error: "User not found" });
    }

    return res.json(userData);
  } catch (error) {
    console.error("Error fetching user data:", error);
    return res.status(500).json({ error: "Cannot fetch user's data" });
  }
}