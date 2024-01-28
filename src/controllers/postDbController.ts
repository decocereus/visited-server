import { Request, Response } from "express";
import { sql } from "@vercel/postgres";

export const createTable = async (req: Request, res: Response) => {
  try {
    const result = await sql`CREATE TABLE IF NOT EXISTS visited_users (
      id SERIAL PRIMARY KEY,
      userID VARCHAR(255),
      URL VARCHAR(255)
    );`;

    res.status(200).json({ success: true, result: result });
  } catch (error: any) {
    console.error("Error creating table:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};

export const addVisitedURL = async (req: Request, res: Response) => {
  try {
    const { visitedUrl, googleId } = req.body;
    console.log("Adding visited", req.body);
    if (!visitedUrl || !googleId) {
      return res.status(400).json({
        success: false,
        error: "Both userID and URL are required.",
      });
    }
    const result: any =
      await sql`INSERT INTO visited_users (userid, url) VALUES (${googleId}, ${visitedUrl}) RETURNING *`;

    res.status(200).json({ success: true, data: result[0] });
  } catch (error: any) {
    console.error("Error Adding user:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};

export const getVisitedURL = async (req: Request, res: Response) => {
  try {
    let authUser = req?.user as { googleid?: string };
    const googleId = authUser?.googleid;
    if (!googleId) {
      return res
        .status(400)
        .json({ success: false, error: "userID is required." });
    }
    const result =
      await sql`SELECT * FROM visited_users WHERE userid = ${googleId}`;

    res.status(200).json({ success: true, data: result.rows });
  } catch (error: any) {
    console.error("Error fetching rows:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};
