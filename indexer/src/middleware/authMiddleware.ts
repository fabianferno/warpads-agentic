import { client } from "../config/db";
import { Request, Response, NextFunction } from "express";

const validateAPIKey = async (apiKey: string) => {
  const db = client.db();
  const adSpace = await db.collection("adSpaces").findOne({ apiKey });
  if (!adSpace) {
    return false;
  }
  return true;
};

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const apiKey = req.headers["X-API-KEY"] as string;

  if (!apiKey) {
    return res.status(401).json({ message: "Unauthorized : Missing API Key" });
  }

  const isValid = await validateAPIKey(apiKey);
  if (!isValid) {
    return res.status(403).json({ message: "Unauthorized : Invalid API Key" });
  }
  next();
};
