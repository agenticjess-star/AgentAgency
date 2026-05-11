import { FC, useState, useRef, useEffect, FormEvent } from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import {
  useListSlackChannels,
  useGetSlackHistory,
  useSendSlackMessage,
} from "@workspace/api-client-react";
import type { SlackChannel } from "@workspace/api-client-react";
import { Hash, Lock, MessageSquare, RefreshCw, Send } from "lucide-react";
import { cn } from "@/lib/utils";

/* ── Message panel (only mounted when a channel is selected) ───────── */
function MessageArea({ channel }: { channel: SlackChannel }) {
  const bottomRef = useRef<HTMLDivElement>(null);
  const [draft, setDraft] = useState("");

  const {
    data: messages = [],
    isLoading,
    isFetching,
    refetch,
  } = useGetSlackHistory(channel.id);

  useEffect(() => {
    const id = setInterval(() => refetch(), 8000);
    return () => clearInterval(id);
  }, [refetch]);

  const { mutate: sendMsg, isPending: sending } = useSendSlackMessage();

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  function handleSend(e: FormEvent) {
    e.preventDefault();
    if (!draft.trim() || sending) return;
    const text = draft.trim();
    setDraft("");
    sendMsg({ data: { channelId: channel.id, text } }, { onSuccess: () => refetch() });
  }

  function formatTs(ts: string): string {
    const ms = parseFloat(ts) * 1000;
    return isNaN(ms)
      ? ""
      : new Date(ms).toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        });
  }

  return (
    <div className="flex flex-col flex-1 min-w-0">
      {/* Header */}
      <div className="h-11 px-4 border-b border-border flex items-center gap-2.5 shrink-0 bg-card">
        {channel.isPrivate ? (
          <Lock className="w-3.5 h-3.5 text-secondary-foreground" />
        ) : (
          <Hash className="w-3.5 h-3.5 text-secondary-foreground" />
        )}
        <span className="font-mono text-[11px] text-foreground uppercase tracking-wider">
          {channel.name}
        </span>
        {channel.memberCount != null && (
          <span className="font-mono text-[10px] text-secondary-foreground">
            · {channel.memberCount} members
          </span>
        )}
        <button
          onClick={() => refetch()}
          className="ml-auto text-secondary-foreground hover:text-foreground transition-colors"
          aria-label="Refresh"
        >
          <RefreshCw className={cn("w-3.5 h-3.5", isFetching && "animate-spin")} />
        </button>
      </div>

      {/* Message stream — dark terminal */}
      <div className="flex-1 overflow-y-auto bg-[#0a0a0a] p-4">
        {isLoading ? (
          <div className="flex items-center gap-2 text-[#555] font-mono text-[11px]">
            <RefreshCw className="w-3 h-3 animate-spin" />
            <span>Loading messages…</span>
          </div>
        ) : messages.length === 0 ? (
          <div className="font-mono text-[11px] text-[#333] text-center pt-10">
            No messages yet — send the first one
          </div>
        ) : (
          <div className="space-y-1.5">
            {messages.map((msg) => (
              <div key={msg.ts} className="flex items-start gap-3 group">
                <span className="font-mono text-[10px] text-[#333] shrink-0 w-11 text-right pt-0.5 group-hover:text-[#555] transition-colors">
                  {formatTs(msg.ts)}
                </span>
                <div className="flex-1 min-w-0">
                  {msg.userName && (
                    <span className="font-mono text-[10px] text-[#ea580c] uppercase tracking-wider mr-1.5">
                      {msg.userName}:
                    </span>
                  )}
                  <span className="font-mono text-[12px] text-[#c8c3bf] break-words leading-relaxed">
                    {msg.text}
                  </span>
                </div>
              </div>
            ))}
            <div ref={bottomRef} />
          </div>
        )}
      </div>

      {/* Input bar */}
      <form
        onSubmit={handleSend}
        className="px-4 py-3 border-t border-border flex items-center gap-3 shrink-0 bg-card"
      >
        <input
          type="text"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder={`Message #${channel.name}…`}
          disabled={sending}
          className="flex-1 bg-background border border-border px-3 py-2 font-mono text-[12px] text-foreground placeholder:text-secondary-foreground/40 focus:outline-none focus:border-accent disabled:opacity-40 transition-colors"
        />
        <button
          type="submit"
          disabled={!draft.trim() || sending}
          className="p-2 border border-border text-secondary-foreground hover:border-accent hover:text-accent disabled:opacity-30 transition-colors"
          aria-label="Send message"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
}

/* ── Agents page ─────────────────────────────────────────────────────── */
const AgentsPage: FC = () => {
  const [channelId, setChannelId] = useState<string>("");

  const { data: channels = [], isLoading: channelsLoading } = useListSlackChannels();

  const selectedChannel = channels.find((c) => c.id === channelId) ?? null;

  return (
    <DashboardLayout>
      <div
        className="flex overflow-hidden border border-border"
        style={{ height: "calc(100dvh - 200px)", minHeight: "320px" }}
      >
        {/* ── Channel list ───────────────────────────────────────── */}
        <aside className="w-48 md:w-60 shrink-0 border-r border-border flex flex-col bg-card">
          <div className="px-4 py-3 border-b border-border shrink-0">
            <span className="mono-label">Channels</span>
          </div>
          <div className="flex-1 overflow-y-auto">
            {channelsLoading ? (
              <div className="p-3 space-y-1.5">
                {Array(6)
                  .fill(0)
                  .map((_, i) => (
                    <div key={i} className="h-8 bg-muted animate-pulse" />
                  ))}
              </div>
            ) : channels.length === 0 ? (
              <p className="p-4 font-mono text-[11px] text-secondary-foreground">
                No channels found
              </p>
            ) : (
              channels.map((ch) => {
                const active = ch.id === channelId;
                return (
                  <button
                    key={ch.id}
                    onClick={() => setChannelId(ch.id)}
                    className={cn(
                      "w-full flex items-center gap-2 px-4 py-2.5 text-left border-b border-border/30 transition-colors",
                      active
                        ? "bg-accent/10 text-accent"
                        : "text-secondary-foreground hover:bg-muted hover:text-foreground"
                    )}
                  >
                    {ch.isPrivate ? (
                      <Lock className="w-3 h-3 shrink-0 opacity-60" />
                    ) : (
                      <Hash className="w-3 h-3 shrink-0 opacity-60" />
                    )}
                    <span className="font-mono text-[11px] uppercase tracking-wide truncate flex-1">
                      {ch.name}
                    </span>
                    {ch.memberCount != null && (
                      <span className="font-mono text-[9px] text-secondary-foreground/40 shrink-0">
                        {ch.memberCount}
                      </span>
                    )}
                  </button>
                );
              })
            )}
          </div>
        </aside>

        {/* ── Right panel ────────────────────────────────────────── */}
        {selectedChannel ? (
          <MessageArea key={selectedChannel.id} channel={selectedChannel} />
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center bg-[#0a0a0a] gap-3">
            <MessageSquare className="w-10 h-10 text-[#222]" />
            <span className="font-mono text-[11px] uppercase tracking-widest text-[#444]">
              Select a channel to start
            </span>
            <span className="font-mono text-[10px] text-[#2a2a2a] text-center max-w-xs px-4">
              Message any agent in your Slack workspace. Every platform that offers Slack is reachable from here.
            </span>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default AgentsPage;
