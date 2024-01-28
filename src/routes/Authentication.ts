import express, { Router, Request, Response } from "express";
import passport from "passport";
import GoogleAuthService from "../services/GoogleAuthService";

/**
 * @BASE_ROUTE /api/v1/auth
 */

export interface User {
  name: string;
  email: string;
  avatarurl: string;
  isverified: boolean;
  accessToken: string;
  refreshToken: string;
  googleid: string;
  id: number;
}

const router: Router = express.Router();

let googleAuthData: Partial<User> | null;

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
    console.log(req.user);
    googleAuthData = req?.user || null;
    res.send(req.user);
  }
);

router.get("/getCurrentUser", (req: Request, res: Response) => {
  console.log("In get user", req, res);
  if (googleAuthData) {
    res.send(googleAuthData);
  } else {
    res.status(500).json({ success: false, error: "User not authenticated" });
  }
});

router.get("/logout", (req: Request, res: Response) => {
  console.log("Logging out");
  googleAuthData = null;
  req.logout(() => {});
  res.redirect("https://visited-client.vercel.app/");
});

export default router;
