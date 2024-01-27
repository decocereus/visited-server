import passport from "passport";
import { Strategy as GoogleStrategy, Profile } from "passport-google-oauth20";

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.CLIENT_ID!,
      clientSecret: process.env.CLIENT_SECRET!,
      callbackURL: "https://localhost:3000/auth/google/callback",
    },
    (accessToken, refreshToken, profile: Profile, done) => {
      return done(null, profile);
    }
  )
);
