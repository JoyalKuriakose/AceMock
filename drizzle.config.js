// import type { Config } from "drizzle-kit";
/** @type { import("drizzle-kit").Config } */
export default {
  dialect: "postgresql", // "mysql" | "sqlite" | "postgresql"
  schema: "./utils/schema.js",
  out: "./drizzle",
  dbCredentials: {
    url: "postgresql://neondb_owner:npg_kG3jxWbEUDs1@ep-flat-tooth-a5x5sdpr-pooler.us-east-2.aws.neon.tech/mainproject?sslmode=require",
  },
};
