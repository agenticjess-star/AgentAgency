import { FC, useState, useEffect } from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import {
  ExternalLink,
  Check,
  AlertCircle,
  Eye,
  EyeOff,
  Save,
  Globe,
  Database,
  Send,
  Webhook,
  Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";

/* ── Types ──────────────────────────────────────────────────────────── */
interface Integration {
  key: string;
  label: string;
  description: string;
  placeholder: string;
  docsUrl?: string;
  icon: string;
}

const INTEGRATIONS: { section: string; icon: FC<{ className?: string }>; items: Integration[] }[] = [
  {
    section: "Data & Web",
    icon: Globe,
    items: [
      {
        key: "firecrawl_api_key",
        label: "Firecrawl",
        description: "Web scraping & crawling — audit competitor sites, extract structured data from any URL.",
        placeholder: "fc-••••••••••••••••",
        docsUrl: "https://firecrawl.dev",
        icon: "🔥",
      },
      {
        key: "browserbase_api_key",
        label: "Browserbase",
        description: "Headless browser automation — run full browser sessions for complex scraping and testing.",
        placeholder: "bb_••••••••••••••••",
        docsUrl: "https://browserbase.com",
        icon: "🌐",
      },
    ],
  },
  {
    section: "Storage",
    icon: Database,
    items: [
      {
        key: "supabase_url",
        label: "Supabase URL",
        description: "Your Supabase project URL — used to store generated assets, outreach files, and pipeline outputs.",
        placeholder: "https://xxxx.supabase.co",
        docsUrl: "https://supabase.com",
        icon: "🗄️",
      },
      {
        key: "supabase_anon_key",
        label: "Supabase Anon Key",
        description: "Public anon key for the Supabase client — safe to use in frontend agents.",
        placeholder: "eyJhbGciOiJIUzI1NiIs…",
        icon: "🔑",
      },
      {
        key: "supabase_service_key",
        label: "Supabase Service Key",
        description: "Server-side service key — used by backend agents for admin-level storage access.",
        placeholder: "eyJhbGciOiJIUzI1NiIs…",
        icon: "🔐",
      },
    ],
  },
  {
    section: "Messaging",
    icon: Send,
    items: [
      {
        key: "telegram_bot_token",
        label: "Telegram Bot Token",
        description: "Your Telegram bot token — enables agents to post updates, receive commands, and trigger sequences via Telegram.",
        placeholder: "7123456789:AAH••••••••••••••••",
        docsUrl: "https://core.telegram.org/bots",
        icon: "✈️",
      },
      {
        key: "telegram_chat_id",
        label: "Telegram Chat ID",
        description: "Default chat or channel ID where agents will post notifications and pipeline updates.",
        placeholder: "-1001234567890",
        icon: "💬",
      },
    ],
  },
  {
    section: "Automation",
    icon: Zap,
    items: [
      {
        key: "webhook_inbound_url",
        label: "Inbound Webhook URL",
        description: "Expose this endpoint to receive external triggers — from n8n, Make, Zapier, or any HTTP call that should kick off a pipeline run.",
        placeholder: "https://hooks.yourapp.com/inbound",
        icon: "🔗",
      },
      {
        key: "n8n_webhook_url",
        label: "n8n Trigger URL",
        description: "Webhook URL of your n8n workflow — agents will POST to this to trigger downstream automation.",
        placeholder: "https://your-n8n.app/webhook/••••",
        docsUrl: "https://n8n.io",
        icon: "⚡",
      },
    ],
  },
];

const STORAGE_KEY = "os_integration_settings";

function loadSettings(): Record<string, string> {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "{}");
  } catch {
    return {};
  }
}

/* ── IntegrationRow ─────────────────────────────────────────────────── */
function IntegrationRow({ item }: { item: Integration }) {
  const [saved, setSaved] = useState<Record<string, string>>(loadSettings);
  const [value, setValue] = useState(saved[item.key] ?? "");
  const [visible, setVisible] = useState(false);
  const [justSaved, setJustSaved] = useState(false);

  useEffect(() => {
    setValue(loadSettings()[item.key] ?? "");
  }, [item.key]);

  const isConfigured = !!saved[item.key];

  function handleSave() {
    const current = loadSettings();
    const updated = { ...current, [item.key]: value };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    setSaved(updated);
    setJustSaved(true);
    setTimeout(() => setJustSaved(false), 2000);
  }

  const isUrl = item.key.includes("url");

  return (
    <div className="flex flex-col sm:flex-row sm:items-start gap-4 py-4 border-b border-border last:border-0">
      {/* Icon + info */}
      <div className="flex items-start gap-3 flex-1 min-w-0">
        <div className="w-8 h-8 border border-border bg-background flex items-center justify-center text-base shrink-0 mt-0.5">
          {item.icon}
        </div>
        <div className="min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-mono text-[11px] uppercase tracking-wider text-foreground font-medium">
              {item.label}
            </span>
            {isConfigured ? (
              <span className="flex items-center gap-1 font-mono text-[9px] uppercase tracking-wider text-emerald-600 border border-emerald-500/30 bg-emerald-50 px-1.5 py-0.5">
                <Check className="w-2.5 h-2.5" />
                Connected
              </span>
            ) : (
              <span className="flex items-center gap-1 font-mono text-[9px] uppercase tracking-wider text-secondary-foreground border border-border bg-muted px-1.5 py-0.5">
                <AlertCircle className="w-2.5 h-2.5" />
                Not configured
              </span>
            )}
            {item.docsUrl && (
              <a
                href={item.docsUrl}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1 font-mono text-[9px] text-secondary-foreground hover:text-accent transition-colors"
              >
                Docs <ExternalLink className="w-2.5 h-2.5" />
              </a>
            )}
          </div>
          <p className="text-[12px] text-secondary-foreground mt-1 leading-relaxed">
            {item.description}
          </p>
        </div>
      </div>

      {/* Input */}
      <div className="flex items-center gap-2 sm:w-[280px] shrink-0">
        <div className="flex-1 relative">
          <input
            type={!isUrl && !visible ? "password" : "text"}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder={item.placeholder}
            className="w-full bg-background border border-border px-3 py-2 font-mono text-[11px] text-foreground placeholder:text-secondary-foreground/40 focus:outline-none focus:border-accent transition-colors"
          />
          {!isUrl && (
            <button
              type="button"
              onClick={() => setVisible(!visible)}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-secondary-foreground hover:text-foreground transition-colors"
            >
              {visible ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
            </button>
          )}
        </div>
        <button
          onClick={handleSave}
          disabled={!value.trim()}
          className={cn(
            "flex items-center gap-1.5 px-3 py-2 font-mono text-[10px] uppercase tracking-wider border transition-colors shrink-0 disabled:opacity-30",
            justSaved
              ? "border-emerald-500 text-emerald-600 bg-emerald-50"
              : "border-border text-secondary-foreground hover:border-foreground hover:text-foreground bg-card"
          )}
        >
          {justSaved ? (
            <>
              <Check className="w-3 h-3" /> Saved
            </>
          ) : (
            <>
              <Save className="w-3 h-3" /> Save
            </>
          )}
        </button>
      </div>
    </div>
  );
}

/* ── Settings Page ──────────────────────────────────────────────────── */
const SettingsPage: FC = () => {
  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-4xl">
        {/* Header */}
        <div>
          <h1 className="heading-lg">Settings</h1>
          <p className="caption mt-1">
            Configure API keys and integrations used by the 7-agent pipeline.
            Keys are stored locally in your browser.
          </p>
        </div>

        {/* Notice */}
        <div className="border border-amber-300/50 bg-amber-50/50 px-4 py-3 flex items-start gap-3">
          <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <p className="font-mono text-[11px] uppercase tracking-wider text-amber-700 mb-0.5">
              Local Storage
            </p>
            <p className="text-[12px] text-amber-700 leading-relaxed">
              Integration keys are saved to your browser's local storage. For production deployments,
              store secrets in your server environment variables or a vault — never commit them to code.
            </p>
          </div>
        </div>

        {/* Integration sections */}
        {INTEGRATIONS.map(({ section, icon: SectionIcon, items }) => (
          <div key={section} className="border border-border bg-card">
            <div className="px-5 py-3.5 border-b border-border flex items-center gap-2">
              <SectionIcon className="w-3.5 h-3.5 text-secondary-foreground" />
              <span className="mono-label">{section}</span>
            </div>
            <div className="px-5">
              {items.map((item) => (
                <IntegrationRow key={item.key} item={item} />
              ))}
            </div>
          </div>
        ))}

        {/* Webhook section */}
        <div className="border border-border bg-card">
          <div className="px-5 py-3.5 border-b border-border flex items-center gap-2">
            <Webhook className="w-3.5 h-3.5 text-secondary-foreground" />
            <span className="mono-label">Inbound Trigger Endpoint</span>
          </div>
          <div className="px-5 py-4">
            <p className="text-[12px] text-secondary-foreground leading-relaxed mb-4">
              POST to this endpoint from any external system (Telegram, n8n, Make, Zapier, GitHub Actions)
              to inject a lead and kick off the pipeline automatically. Include a JSON body with{" "}
              <code className="font-mono text-[11px] bg-muted px-1 py-0.5">businessName</code>,{" "}
              <code className="font-mono text-[11px] bg-muted px-1 py-0.5">websiteUrl</code>, and{" "}
              <code className="font-mono text-[11px] bg-muted px-1 py-0.5">vertical</code>.
            </p>
            <div className="bg-[#0d0d0d] border border-[#2a2a2a] p-4 font-mono text-[11px] text-[#a8b0a0] leading-relaxed">
              <div className="text-[#ea580c]">POST /api/pipeline/trigger</div>
              <div className="text-[#555] mt-2">Content-Type: application/json</div>
              <div className="mt-2">{`{`}</div>
              <div className="pl-4 text-[#c8c3bf]">
                <div><span className="text-[#60a5fa]">"businessName"</span>: <span className="text-[#4ade80]">"Acme Plumbing Co"</span>,</div>
                <div><span className="text-[#60a5fa]">"websiteUrl"</span>: <span className="text-[#4ade80]">"https://acmeplumbing.com"</span>,</div>
                <div><span className="text-[#60a5fa]">"vertical"</span>: <span className="text-[#4ade80]">"home_services"</span></div>
              </div>
              <div>{`}`}</div>
            </div>
          </div>
        </div>

        {/* Slack status */}
        <div className="border border-border bg-card">
          <div className="px-5 py-3.5 border-b border-border flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-base">💬</span>
              <span className="mono-label">Slack</span>
            </div>
            <span className="flex items-center gap-1 font-mono text-[9px] uppercase tracking-wider text-emerald-600 border border-emerald-500/30 bg-emerald-50 px-1.5 py-0.5">
              <Check className="w-2.5 h-2.5" />
              Connected via Replit
            </span>
          </div>
          <div className="px-5 py-4">
            <p className="text-[12px] text-secondary-foreground leading-relaxed">
              Slack is connected via the Replit integration. Use the{" "}
              <a href="/agents" className="text-accent hover:underline">Agents console</a>{" "}
              to message channels and agents directly. To reconfigure scopes or switch workspaces,
              update the Slack connector in Replit's integration settings.
            </p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default SettingsPage;
