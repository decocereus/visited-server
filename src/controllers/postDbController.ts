import { Request, Response } from "express";
import { sql } from "@vercel/postgres";

export const createTable = async (req: Request, res: Response) => {
  try {
    const result = await sql`CREATE TABLE IF NOT EXISTS visited_users (
  id SERIAL PRIMARY KEY,
  userID VARCHAR(255),
  URL VARCHAR(255)
);`;

    res.status(200).json({ success: true, result });
  } catch (error: any) {
    console.error("Error creating table:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};

export const addVisitedURL = async (req: Request, res: Response) => {
  try {
    const { userID, URL } = req.body;
    if (!userID || !URL) {
      return res.status(400).json({
        success: false,
        error: "Both userID and URL are required.",
      });
    }
    const result: any =
      await sql`INSERT INTO visited_users (userID, URL) VALUES (${userID}, ${URL}) RETURNING *`;

    res.status(200).json({ success: true, data: result[0] });
  } catch (error: any) {
    console.error("Error Adding user:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};

export const getVisitedURLs = async (req: Request, res: Response) => {
  try {
    const { userID } = req.params;
    if (!userID) {
      return res
        .status(400)
        .json({ success: false, error: "userID is required." });
    }
    const result =
      await sql`SELECT * FROM visited_users WHERE userID = ${userID}`;

    res.status(200).json({ success: true, data: result });
  } catch (error: any) {
    console.error("Error fetching rows:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};
