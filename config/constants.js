import dotenv from "dotenv";
dotenv.config({
  path: ".env.local",
});

// Authentication Constants
export const TOKEN_KEY_NAME = "accessToken";
export const USER_KEY_NAME = "userData";
export const WORKOUT_SESSIONS_KEY_NAME = "workoutSessions";

export const JWT_EXPIRATION_TIME = "30d"; // 30 days
export const REFRESH_TOKEN_EXPIRY = "30d"; // 30 days
export const REFRESH_TOKEN_MAX_AGE = 30 * 24 * 60 * 60; // 30 days in seconds

// Refresh Token Constants
export const REFRESH_BEFORE_EXPIRY_SEC = 60; // Refresh token 1 minute before expiry

// Google OAuth Constants
export const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || "";
export const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET || "";
export const GOOGLE_REDIRECT_URI = `${process.env.EXPO_PUBLIC_BASE_URL}/api/auth/callback`;
export const GOOGLE_AUTH_URL = "https://accounts.google.com/o/oauth2/v2/auth";

// Environment Constants
export const BASE_URL = process.env.EXPO_PUBLIC_BASE_URL || "";
export const APP_SCHEME = process.env.EXPO_PUBLIC_SCHEME || "";
export const JWT_SECRET = process.env.JWT_SECRET || "";
export const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || "";
export const PORT = process.env.PORT || 8000;
export const MONGODB_URI = process.env.MONGODB_URI || "";
export const MONGODB_DB_NAME = process.env.MONGODB_DB_NAME || "tracking-workout-app";
