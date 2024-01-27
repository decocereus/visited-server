import passport from "passport";
import dotenv from "dotenv";
dotenv.config();
const GoogleStrategy = require("passport-google-oauth20").Strategy;

interface User {
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
      callbackURL: "http://localhost:4500/api/v1/auth/google/callback",
      passReqToCallback: true,
    },
    function (
      request: any,
      accessToken: any,
      refreshToken: any,
      profile: any,
      done: any
    ) {
      const user: User = {
        accessToken: accessToken,
        refreshToken: refreshToken,
        name: profile.displayName,
        email: profile.emails[0].value,
        googleId: profile.id,
        avatarUrl: profile.picture,
        isVerified: profile.emails[0].verified,
      };
      return done(null, user);
    }
  )
);
