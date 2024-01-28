import express from "express";
import dotenv from "dotenv";
import passport from "passport";
import Authentication from "./routes/Authentication";
import Database from "./routes/Database";
import cookieSession from "cookie-session";
import { connectToDatabase } from "./config/db";

dotenv.config();
const cors = require("cors");
const app = express();

const port = process.env.PORT || 4500;
const cookieKey =
  process.env.COOKIE_KEY || "VISITED_COOKIE_CLIENT_SERVER_EXTENSION";

/**@Middleware */
app.use(express.json());
app.use(
  cookieSession({
    maxAge: 30 * 24 * 60 * 60 * 1000,
    keys: [cookieKey],
  })
);
app.use(cors());
app.use(passport.initialize());
app.use(passport.session());

app.get("/", (req, res) => {
  res.send("Hello, TypeScript with Express!");
});

app.use("/api/v1/auth", Authentication);
app.use("/api/v1/database", Database);

app.listen(port, async () => {
  console.log("Server is listening on port", port);
  console.log(process.env);
  await connectToDatabase();
});
