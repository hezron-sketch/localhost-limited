import { defineConfig } from "drizzle-kit";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error("DATABASE_URL is required to run drizzle commands");
}

export default defineConfig({
  schema: path.join(__dirname, "drizzle/schema.ts"),
  out: path.join(__dirname, "drizzle"),
  dialect: "postgresql",
  dbCredentials: {
    url: connectionString,
  },
});
