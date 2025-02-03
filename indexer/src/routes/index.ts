import { Router, Request, Response } from "express";
import { adEngine } from "../utilities/adEngine/adEngine";

const router = Router();

router.get("/", (req: Request, res: Response) => {
  res.send("TypeScript Server is Running!");
});

router.get("/getAd", async (req: Request, res: Response) => {
  const { query } = req.body;
  const ad = await adEngine(query);
  console.log(ad);
  res.send(ad);
});

export default router;
