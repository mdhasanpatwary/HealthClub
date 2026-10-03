import dotenv from "dotenv";
import { defineConfig, env } from "prisma/config";

// Prioritize .env.local for local development if present, then fallback to .env
dotenv.config({ path: ".env.local" });
dotenv.config();

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: env("DIRECT_URL") || env("DATABASE_URL"),
  },
});
