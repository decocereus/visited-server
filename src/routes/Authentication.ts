import express, { Router, Request, Response } from "express";
import passport from "passport";
import GoogleAuthService from "../services/GoogleAuthService";

/**
 * @BASE_ROUTE /api/v1/auth
 */

const router: Router = express.Router();

router.get("/", (req, res) => res.send("Hey auth"));

router.get(
  "/google",
  GoogleAuthService.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "http://localhost:3000" }),
  (req: Request, res: Response) => {
    res.redirect("http://localhost:3000/dashboard");
  }
);

router.get("/getCurrentUser", (req: Request, res: Response) => {
  console.log(req.user);
  res.send(req.user);
});

export default router;
