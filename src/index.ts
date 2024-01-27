import express from "express";
import dotenv from "dotenv";
import Authentication from "./routes/Authentication";
import Database from "../src/routes/Database";
import { connectToDatabase } from "../src/config/db";

dotenv.config();
const cors = require("cors");
const app = express();
app.use(cors());
const port = process.env.PORT || 4500;

app.get("/", (req, res) => {
  res.send("Hello, TypeScript with Express!");
});

app.use("/api/v1/auth", Authentication);
app.use("/api/v1/database", Database);

app.listen(port, async () => {
  console.log("Server is listening on port", port);
  await connectToDatabase();
});
