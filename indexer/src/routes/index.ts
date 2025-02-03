import { Router, Request, Response } from "express";
import { adEngine } from "../utilities/adEngine/adEngine";
import { generateAPIKey } from "../utilities/apikey/generateAPIkey";
import { authMiddleware } from "../middleware/authMiddleware";

const router = Router();

router.get("/", (req: Request, res: Response) => {
  res.send("TypeScript Server is Running!");
});

router.get("/getAd", authMiddleware, async (req: Request, res: Response) => {
  const { query } = req.body;
  const ad = await adEngine(query);
  console.log(ad);
  res.send(ad);
});

router.get("/generateAPIkey", async (req: Request, res: Response) => {
  const { id } = req.body;
  const apiKey = await generateAPIKey(id);
  res.send(apiKey);
});

export default router;
