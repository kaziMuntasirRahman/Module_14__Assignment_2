import express, { Request, Response } from "express";
import { initDB } from "./config/db";
const app = express();

initDB();

app.get("/", (req: Request, res: Response) => {
  res.send("Hello from EasyRent Server...");
});

export default app;
