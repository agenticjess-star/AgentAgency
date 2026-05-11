import { FC, useState, useMemo } from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { useListLeads, useCreateLead, getListLeadsQueryKey } from "@workspace/api-client-react";
import { Link } from "wouter";
import { Plus, Search, ChevronRight, ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger,
} from "@/components/ui/sheet";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useQueryClient } from "@tanstack/react-query";
import { StatusPill } from "@/components/ui/status-pill";

const createLeadSchema = z.object({
  businessName: z.string().min(1, "Required"),
  domain: z.string().optional(),
  vertical: z.string().min(1, "Required"),
  geo: z.string().min(1, "Required"),
  opportunityTag: z.enum(["no_website", "weak_website", "outdated", "not_ai_citable"]),
});

type SortKey = "businessName" | "vertical" | "status" | "opportunityTag";
type SortDir = "asc" | "desc";

function SortHeader({ label, sortKey, current, dir, onSort }: {
  label: string; sortKey: SortKey; current: SortKey | null; dir: SortDir; onSort: (k: SortKey) => void;
}) {
  const active = current === sortKey;
  return (
    <th
      className="cursor-pointer select-none"
      onClick={() => onSort(sortKey)}
    >
      <div className="flex items-center gap-1 group">
        {label}
        {active ? (
          dir === "asc" ? <ArrowUp className="w-2.5 h-2.5 text-accent" /> : <ArrowDown className="w-2.5 h-2.5 text-accent" />
        ) : (
          <ArrowUpDown className="w-2.5 h-2.5 text-border group-hover:text-secondary-foreground transition-colors" />
        )}
      </div>
    </th>
  );
}

const LeadsPage: FC = () => {
  const qc = useQueryClient();
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [sortKey, setSortKey] = useState<SortKey | null>("businessName");
  const [sortDir, setSortDir] = useState<SortDir>("asc");

  const { data: leads, isLoading } = useListLeads();
  const createLead = useCreateLead();

  const form = useForm({
    resolver: zodResolver(createLeadSchema),
    defaultValues: {
      businessName: "",
      domain: "",
      vertical: "",
      geo: "",
      opportunityTag: "weak_website" as const,
    },
  });

  const onSubmit = (values: any) => {
    createLead.mutate({ data: values }, {
      onSuccess: () => {
        qc.invalidateQueries({ queryKey: getListLeadsQueryKey() });
        setOpen(false);
        form.reset();
      },
    });
  };

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  };

  const filteredAndSorted = useMemo(() => {
    let data = leads ?? [];
    if (search) {
      const q = search.toLowerCase();
      data = data.filter(
        (l) =>
          l.businessName.toLowerCase().includes(q) ||
          l.vertical.toLowerCase().includes(q) ||
          (l.geo ?? "").toLowerCase().includes(q)
      );
    }
    if (sortKey) {
      data = [...data].sort((a, b) => {
        const av = (a[sortKey] ?? "") as string;
        const bv = (b[sortKey] ?? "") as string;
        return sortDir === "asc" ? av.localeCompare(bv) : bv.localeCompare(av);
      });
    }
    return data;
  }, [leads, search, sortKey, sortDir]);

  const InjectForm = (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField control={form.control} name="businessName" render={({ field }) => (
          <FormItem>
            <FormLabel className="mono-label">Business Name</FormLabel>
            <FormControl><Input {...field} className="rounded-none bg-background border-border font-mono text-sm" /></FormControl>
            <FormMessage />
          </FormItem>
        )} />
        <div className="grid grid-cols-2 gap-3">
          <FormField control={form.control} name="vertical" render={({ field }) => (
            <FormItem>
              <FormLabel className="mono-label">Vertical</FormLabel>
              <FormControl><Input {...field} className="rounded-none bg-background border-border font-mono text-sm" /></FormControl>
              <FormMessage />
            </FormItem>
          )} />
          <FormField control={form.control} name="geo" render={({ field }) => (
            <FormItem>
              <FormLabel className="mono-label">Geo</FormLabel>
              <FormControl><Input {...field} className="rounded-none bg-background border-border font-mono text-sm" /></FormControl>
              <FormMessage />
            </FormItem>
          )} />
        </div>
        <FormField control={form.control} name="domain" render={({ field }) => (
          <FormItem>
            <FormLabel className="mono-label">Domain (optional)</FormLabel>
            <FormControl><Input {...field} className="rounded-none bg-background border-border font-mono text-sm" placeholder="example.com" /></FormControl>
            <FormMessage />
          </FormItem>
        )} />
        <FormField control={form.control} name="opportunityTag" render={({ field }) => (
          <FormItem>
            <FormLabel className="mono-label">Opportunity Tag</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger className="rounded-none bg-background border-border font-mono text-sm">
                  <SelectValue />
                </SelectTrigger>
              </FormControl>
              <SelectContent className="rounded-none border-border font-mono text-sm">
                <SelectItem value="no_website">No Website</SelectItem>
                <SelectItem value="weak_website">Weak Website</SelectItem>
                <SelectItem value="outdated">Outdated</SelectItem>
                <SelectItem value="not_ai_citable">Not AI Citable</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )} />
        <Button
          type="submit"
          disabled={createLead.isPending}
          className="w-full bg-accent hover:bg-accent/90 text-white rounded-none font-mono text-[10px] uppercase tracking-wider mt-2"
        >
          {createLead.isPending ? "Submitting..." : "Submit Entry"}
        </Button>
      </form>
    </Form>
  );

  return (
    <DashboardLayout>
      <div className="space-y-5">

        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="heading-lg">Leads</h1>
            <p className="caption mt-0.5">{leads?.length ?? 0} prospects indexed</p>
          </div>
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button className="bg-accent hover:bg-accent/90 text-white font-mono text-[10px] uppercase tracking-wider rounded-none gap-1.5">
                <Plus className="w-3.5 h-3.5" /> Inject Lead
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="bg-card border-l border-border rounded-none w-full sm:max-w-md overflow-y-auto">
              <SheetHeader className="mb-6">
                <SheetTitle className="font-mono text-[11px] uppercase tracking-wider">New Lead Entry</SheetTitle>
              </SheetHeader>
              {InjectForm}
            </SheetContent>
          </Sheet>
        </div>

        {/* Search */}
        <div className="flex items-center gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-secondary-foreground" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search leads..."
              className="pl-9 rounded-none border-border bg-card font-mono text-sm h-9"
            />
          </div>
          <span className="font-mono text-[10px] text-secondary-foreground uppercase tracking-wider">
            {filteredAndSorted.length} result{filteredAndSorted.length !== 1 ? "s" : ""}
          </span>
        </div>

        {/* ── Desktop table (md+) ──────────────────────────────────── */}
        <div className="hidden md:block border border-border bg-card">
          <div className="overflow-x-auto">
            <table className="w-full text-left op-table">
              <thead>
                <tr>
                  <SortHeader label="Business" sortKey="businessName" current={sortKey} dir={sortDir} onSort={handleSort} />
                  <th>Vertical / Geo</th>
                  <SortHeader label="Status" sortKey="status" current={sortKey} dir={sortDir} onSort={handleSort} />
                  <SortHeader label="Opportunity" sortKey="opportunityTag" current={sortKey} dir={sortDir} onSort={handleSort} />
                  <th className="text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  Array(5).fill(0).map((_, i) => (
                    <tr key={i}>
                      <td><Skeleton className="h-4 w-36" /></td>
                      <td><Skeleton className="h-4 w-28" /></td>
                      <td><Skeleton className="h-5 w-20" /></td>
                      <td><Skeleton className="h-4 w-24" /></td>
                      <td />
                    </tr>
                  ))
                ) : filteredAndSorted.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-12 text-center text-secondary-foreground font-mono text-xs">
                      No leads found in index.
                    </td>
                  </tr>
                ) : (
                  filteredAndSorted.map((lead) => (
                    <tr key={lead.id}>
                      <td>
                        <div className="font-medium text-[13px]">{lead.businessName}</div>
                        {lead.domain && (
                          <div className="font-mono text-[11px] text-secondary-foreground mt-0.5">{lead.domain}</div>
                        )}
                      </td>
                      <td>
                        <div className="text-[13px]">{lead.vertical}</div>
                        <div className="font-mono text-[11px] text-secondary-foreground mt-0.5">{lead.geo}</div>
                      </td>
                      <td><StatusPill status={lead.status} /></td>
                      <td>
                        <span className="font-mono text-[11px] text-secondary-foreground">
                          {lead.opportunityTag.replace(/_/g, " ")}
                        </span>
                      </td>
                      <td className="text-right">
                        <Link href={`/leads/${lead.id}`}>
                          <Button variant="ghost" size="sm" className="font-mono text-[10px] uppercase tracking-wider text-secondary-foreground hover:text-foreground h-7 px-2 gap-1">
                            View <ChevronRight className="w-3 h-3" />
                          </Button>
                        </Link>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* ── Mobile card list (< md) ──────────────────────────────── */}
        <div className="md:hidden space-y-2">
          {isLoading ? (
            Array(4).fill(0).map((_, i) => (
              <div key={i} className="border border-border bg-card p-4 space-y-2">
                <Skeleton className="h-4 w-40" />
                <Skeleton className="h-4 w-28" />
                <Skeleton className="h-5 w-20" />
              </div>
            ))
          ) : filteredAndSorted.length === 0 ? (
            <div className="border border-border bg-card py-12 text-center font-mono text-xs text-secondary-foreground">
              No leads found in index.
            </div>
          ) : (
            filteredAndSorted.map((lead) => (
              <Link key={lead.id} href={`/leads/${lead.id}`}>
                <div className="border border-border bg-card p-4 hover:bg-muted/30 transition-colors active:bg-muted/50">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="font-medium text-[13px] leading-tight">{lead.businessName}</div>
                    <StatusPill status={lead.status} />
                  </div>
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                    <span className="font-mono text-[11px] text-secondary-foreground">{lead.vertical}</span>
                    <span className="text-border font-mono text-[11px]">·</span>
                    <span className="font-mono text-[11px] text-secondary-foreground">{lead.geo}</span>
                  </div>
                  {lead.domain && (
                    <div className="font-mono text-[10px] text-secondary-foreground mt-1">{lead.domain}</div>
                  )}
                  <div className="font-mono text-[10px] text-accent mt-2 uppercase tracking-wider">
                    {lead.opportunityTag.replace(/_/g, " ")}
                  </div>
                </div>
              </Link>
            ))
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default LeadsPage;
