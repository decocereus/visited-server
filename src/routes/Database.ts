import { Router } from "express";
import { Request, Response } from "express";
import {
  createTable,
  addVisitedURL,
  getVisitedURL,
} from "../controllers/postDbController";

const router = Router();

/**
 * @BASE_ROUTE /api/v1/database/
 */

router.get("/", (req: any, res: any) => {
  res.send("Database Home");
});

router.get("/createTable", async (req: Request, res: Response) => {
  await createTable(req, res);
});

router.post("/addVisitedURL", async (req: Request, res: Response) => {
  await addVisitedURL(req, res);
});

router.get("/getVisitedURLs", async (req: Request, res: Response) => {
  await getVisitedURL(req, res);
});

export default router;
