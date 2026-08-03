import dotenv from "dotenv";

dotenv.config({
  path: ".env.local",
});

export const ENV = {
  PORT: process.env.PORT || 8000,
};
