import express, { Router, Request, Response } from "express";
import passport from "passport";

/**
 * @ BASE ROUTE /api/v1/auth
 */

const router: Router = express.Router();

router.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/" }),
  (req: Request, res: Response) => {
    res.redirect("/dashboard");
  }
);

export default router;
