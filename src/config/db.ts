import pgPromise from "pg-promise";
import dotenv from "dotenv";

dotenv.config();

const pgp = pgPromise();
export const db = pgp({
  connectionString: process.env.POSTGRES_URL,
  ssl: { rejectUnauthorized: false },
});

export const connectToDatabase = async () => {
  try {
    await db.connect();
    console.log("Connected to the database");
  } catch (error: any) {
    console.error("Error connecting to the database:", error.message);
    console.error("Connection details:", process.env.POSTGRES_URL);
    throw error;
  }
};
