import { Router, Request, Response } from "express";
import { adEngine } from "../utilities/adEngine/adEngine";
import { generateAPIKey } from "../utilities/apikey/generateAPIkey";
import { authMiddleware } from "../middleware/authMiddleware";
import { trackUsage } from "../utilities/adEngine/trackUsage";
import { trackResponse } from "../utilities/adEngine/trackResponse";
import { getAllAgents } from "../utilities/GetAllAgents";
import { validateTwitterAnalytics } from "../utilities/operator/TwitterAnalytics";
import { operator } from "../utilities/operator/operator";
import { calculateIncentive } from "../utilities/IncentiveCalculator";
import { env } from "../config/env";
import { getAllAdCampaigns } from "../utilities/GetAllAdCampaigns";
import { client } from "../config/db";

const router = Router();

router.get("/", (req: Request, res: Response) => {
  res.send("TypeScript Server is Running!");
});

router.get("/get-ad", authMiddleware, async (req: Request, res: Response) => {
  const { query } = req.body;
  const ad = await adEngine(query);
  if (ad === "No ad found") {
    res.status(404).send("No ad found");
    return;
  }
  await trackUsage(req.headers["x-api-key"] as string, ad.id, ad.chainId);
  if (ad?.ad.includes("No ad found")) {
    res.status(404).send("No ad found");
  } else {
    res.status(200).send(ad.ad);
  }
});

router.get("/get-all-ads", async (req: Request, res: Response) => {
  const db = client.db("warpads");

  const adCampaigns = await db
    .collection(`development_adCampaigns`)
    .aggregate([
      {
        $lookup: {
          from: `development_requestLogs`,
          localField: "id",
          foreignField: "adId",
          as: "insights",
        },
      },
      {
        $addFields: {
          "metadata.name": { $trim: { input: "$metadata.name" } },
        },
      },
      {
        $group: {
          _id: "$metadata.name",
          id: { $first: "$id" },
          owner: { $first: "$owner" },
          metadata: { $first: "$metadata" },
          priorityStake: { $first: "$priorityStake" },
          expiry: { $first: "$expiry" },
          active: { $first: "$active" },
          chainId: { $first: "$chainId" },
          createdAt: { $first: "$createdAt" },
          updatedAt: { $first: "$updatedAt" },
          insights: { $first: "$insights" },
        },
      },
      {
        $project: {
          _id: 0,
          id: 1,
          owner: 1,
          metadata: 1,
          priorityStake: 1,
          expiry: 1,
          active: 1,
          chainId: 1,
          createdAt: 1,
          updatedAt: 1,
          "insights.id": 1,
          "insights.adId": 1,
          "insights.adSpaceId": 1,
          "insights.requestedAt": 1,
        },
      },
    ])
    .toArray();

  res.status(200).send(adCampaigns);
});

router.get("/get-my-agents", async (req: Request, res: Response) => {
  const { address } = req.query;
  const agents = await getAllAgents(address as `0x${string}`);
  res.status(200).send(agents);
});

router.get("/generate-api-key", async (req: Request, res: Response) => {
  const { id } = req.body;
  const apiKey = await generateAPIKey(id);
  res.send(apiKey);
});

router.get("/get-my-ads", async (req: Request, res: Response) => {
  const { address } = req.query;
  const ads = await getAllAdCampaigns(address as `0x${string}`);
  res.status(200).send(ads);
});

router.post(
  "/track-response",
  authMiddleware,
  async (req: Request, res: Response) => {
    console.log("Tracking response");
    const { platform, id } = req.body;
    await trackResponse(req.headers["x-api-key"] as string, {
      platform,
      id,
    });
    res.send("Response tracked");
  }
);

router.post("/webhooks", async (req: Request, res: Response) => {
  try {
    // Log the full request details for debugging
    console.log("Webhook Headers:", req.headers);
    console.log("Webhook Body:", req.body);

    // Verify the request has a body
    if (!req.body) {
      return res.status(400).json({ error: "Missing request body" });
    }

    // TODO: Add any specific webhook processing logic here
    await validateTwitterAnalytics(req.body.task_id, req.body.output);

    // Send a more detailed success response
    return res.status(200).json({
      status: "success",
      message: "Webhook received and processed successfully",
    });
  } catch (error) {
    console.error("Webhook processing error:", error);
    return res.status(500).json({
      status: "error",
      message: "Failed to process webhook",
    });
  }
});

router.post("/operator", async (req: Request, res: Response) => {
  const { key } = req.body;
  if (key === env.OPERATOR_KEY) {
    await operator();
    res.send("Operator started");
  } else {
    res.status(401).send("Unauthorized");
  }
});

router.post("/incentive", async (req: Request, res: Response) => {
  const { key } = req.body;
  if (key === env.OPERATOR_KEY) {
    await calculateIncentive();
    res.send("Incentive calculated");
  } else {
    res.status(401).send("Unauthorized");
  }
});

export default router;
