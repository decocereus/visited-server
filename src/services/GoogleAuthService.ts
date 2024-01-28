import passport from "passport";
import dotenv from "dotenv";
import { db } from "../config/db";
dotenv.config();
const GoogleStrategy = require("passport-google-oauth20").Strategy;

export interface User {
  accessToken: any;
  refreshToken: any;
  name: string;
  email: string;
  googleId: string;
  avatarUrl: string;
  isVerified: boolean;
}

export default passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      callbackURL: "/api/v1/auth/google/callback",
      passReqToCallback: true,
      scope: ["profile", "email"],
    },
    async function (
      request: any,
      accessToken: string,
      refreshToken: string,
      profile: any,
      done: any
    ) {
      const user: User = {
        accessToken: accessToken ? accessToken : "null",
        refreshToken: refreshToken ? refreshToken : "null",
        name: profile.displayName,
        email: profile.emails[0].value,
        googleId: profile.id,
        avatarUrl: profile.photos[0].value,
        isVerified: profile.emails[0].verified,
      };
      try {
        // Check if the user already exists in the database
        const existingUser = await db.oneOrNone(
          "SELECT * FROM auth_users WHERE googleId = $1",
          [user.googleId]
        );
        console.log("In passport strat", user);
        if (existingUser) {
          return done(null, existingUser);
        } else {
          const newUser = await db.one(
            "INSERT INTO auth_users (accessToken, refreshToken, name, email, googleId, avatarUrl, isVerified) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *",
            [
              user.accessToken,
              user.refreshToken,
              user.name,
              user.email,
              user.googleId,
              user.avatarUrl,
              user.isVerified,
            ]
          );
          console.log("In passport strat new User", newUser);
          return done(null, newUser);
        }
      } catch (error) {
        console.error("Error checking/inserting user:", error);
        return done(error, null);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  console.log("in serializing user", user);
  done(null, user);
});

passport.deserializeUser(async (incomingUser: User, done) => {
  try {
    // Retrieve the user from the database
    const existingUser = await db.oneOrNone(
      "SELECT * FROM auth_users WHERE googleId = $1",
      [incomingUser.googleId]
    );
    if (existingUser) {
      console.log("found user");
      return done(null, existingUser);
    } else {
      console.log("Not found user returning incoing", incomingUser);
      return done(null, incomingUser);
    }
  } catch (error) {
    console.error("Error deserializing user:", error);
    return done(error, null);
  }
});
