import { MONGODB_URI, MONGODB_DB_NAME } from "../config/constants.js";
import { MongoClient } from "mongodb";

if (!MONGODB_URI) {
  throw new Error("Missing MONGODB_URI environment variable");
}

const MONGODB_NAME = MONGODB_DB_NAME;
if (!MONGODB_NAME) {
  throw new Error("Missing MONGODB_NAME environment variable");
}

const client = new MongoClient(MONGODB_URI);

let connectionPromise = null;

export const connectToDatabase = async () => {
  if (!connectionPromise) {
    connectionPromise = client
      .connect()
      .then(() => client.db(MONGODB_NAME))
      .catch((error) => {
        connectionPromise = null;
        console.error("Failed to connect to MongoDB:", error);
        throw new Error("Database connection failed");
      });
  }

  return connectionPromise;
};
