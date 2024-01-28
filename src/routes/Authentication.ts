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
  passport.authenticate("google", {
    failureRedirect: "https://visited-client.vercel.app/",
  }),
  (req: Request, res: Response) => {
    res.redirect("https://visited-client.vercel.app/dashboard");
  }
);

router.get("/getCurrentUser", (req: Request, res: Response) => {
  if (req.user) {
    res.send(req.user);
  } else {
    res.status(500).json({ success: false, error: "User not authenticated" });
  }
});

router.get("/logout", (req: Request, res: Response) => {
  console.log("Logging out");
  req.logout(() => {});
  res.redirect("https://visited-client.vercel.app/");
});

export default router;
