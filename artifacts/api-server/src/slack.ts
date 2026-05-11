// Slack connector via @replit/connectors-sdk — do not cache instance (tokens expire)
import { ReplitConnectors } from "@replit/connectors-sdk";

function client() {
  return new ReplitConnectors();
}

export interface SlackChannel {
  id: string;
  name: string;
  type: "channel" | "dm" | "group";
  memberCount: number | null;
  isPrivate: boolean;
}

export interface SlackMessage {
  ts: string;
  text: string;
  userId: string | null;
  userName: string | null;
}

export async function listChannels(): Promise<SlackChannel[]> {
  // Scopes available: channels:read (public) + im:read (DMs)
  // private_channel requires groups:read — omit to avoid missing_scope
  const [pubRes, imRes] = await Promise.all([
    client().proxy(
      "slack",
      "/conversations.list?types=public_channel&exclude_archived=true&limit=100",
      { method: "GET" }
    ),
    client().proxy(
      "slack",
      "/conversations.list?types=im&limit=50",
      { method: "GET" }
    ),
  ]);

  const pubData = (await pubRes.json()) as {
    ok: boolean;
    error?: string;
    channels?: { id: string; name?: string; is_private?: boolean; num_members?: number }[];
  };
  const imData = (await imRes.json()) as {
    ok: boolean;
    error?: string;
    channels?: { id: string; user?: string }[];
  };

  const channels: SlackChannel[] = [];

  if (pubData.ok) {
    for (const ch of pubData.channels ?? []) {
      channels.push({
        id: ch.id,
        name: ch.name ?? ch.id,
        type: "channel",
        memberCount: ch.num_members ?? null,
        isPrivate: false,
      });
    }
  }

  if (imData.ok) {
    for (const ch of imData.channels ?? []) {
      channels.push({
        id: ch.id,
        name: ch.user ?? ch.id,
        type: "dm",
        memberCount: null,
        isPrivate: true,
      });
    }
  }

  return channels;
}

export async function getHistory(channelId: string, limit = 40): Promise<SlackMessage[]> {
  const res = await client().proxy(
    "slack",
    `/conversations.history?channel=${encodeURIComponent(channelId)}&limit=${limit}`,
    { method: "GET" }
  );
  const data = (await res.json()) as {
    ok: boolean;
    error?: string;
    messages?: { ts: string; text?: string; user?: string; username?: string }[];
  };
  if (!data.ok) throw new Error(data.error ?? "Slack API error");
  return (data.messages ?? [])
    .reverse()
    .map((m) => ({
      ts: m.ts,
      text: m.text ?? "",
      userId: m.user ?? null,
      userName: m.username ?? null,
    }));
}

export async function sendMessage(channelId: string, text: string): Promise<SlackMessage> {
  const res = await client().proxy("slack", "/chat.postMessage", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ channel: channelId, text }),
  });
  const data = (await res.json()) as {
    ok: boolean;
    error?: string;
    message?: { ts: string; text?: string; user?: string };
  };
  if (!data.ok) throw new Error(data.error ?? "Slack API error");
  return {
    ts: data.message?.ts ?? String(Date.now()),
    text: data.message?.text ?? text,
    userId: data.message?.user ?? null,
    userName: null,
  };
}
