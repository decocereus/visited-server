import express, { Router, Request, Response } from "express";
import passport from "passport";
import GoogleAuthService from "../services/GoogleAuthService";

/**
 * @ BASE ROUTE /api/v1/auth
 */

const router: Router = express.Router();

router.get("/", (req, res) => res.send("Hey auth"));

router.get(
  "/google",
  GoogleAuthService.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/" }),
  (req: Request, res: Response) => {
    res.redirect("/dashboard");
  }
);

export default router;
