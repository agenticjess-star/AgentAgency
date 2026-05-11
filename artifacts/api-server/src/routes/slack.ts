import { Router } from "express";
import { listChannels, getHistory, sendMessage } from "../slack.js";

const router = Router();

router.get("/channels", async (req, res) => {
  try {
    const channels = await listChannels();
    res.json(channels);
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Slack error";
    req.log.error({ err }, "slack/channels failed");
    res.status(500).json({ error: msg });
  }
});

router.get("/history/:channelId", async (req, res) => {
  try {
    const messages = await getHistory(req.params.channelId);
    res.json(messages);
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Slack error";
    req.log.error({ err }, "slack/history failed");
    res.status(500).json({ error: msg });
  }
});

router.post("/send", async (req, res) => {
  const { channelId, text } = req.body as { channelId?: string; text?: string };
  if (!channelId || !text) {
    res.status(400).json({ error: "channelId and text are required" });
    return;
  }
  try {
    const message = await sendMessage(channelId, text);
    res.json(message);
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Slack error";
    req.log.error({ err }, "slack/send failed");
    res.status(500).json({ error: msg });
  }
});

export default router;
