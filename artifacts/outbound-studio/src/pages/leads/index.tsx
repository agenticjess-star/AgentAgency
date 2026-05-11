import { FC, useState } from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { useListLeads, useCreateLead, getListLeadsQueryKey } from "@workspace/api-client-react";
import { Link } from "wouter";
import { Plus, Search, ChevronRight } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
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

const LeadsPage: FC = () => {
  const qc = useQueryClient();
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);

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

  const filteredLeads = leads?.filter(
    (l) =>
      l.businessName.toLowerCase().includes(search.toLowerCase()) ||
      l.vertical.toLowerCase().includes(search.toLowerCase()) ||
      (l.geo ?? "").toLowerCase().includes(search.toLowerCase())
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
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="bg-accent hover:bg-accent/90 text-white font-mono text-[10px] uppercase tracking-wider rounded-none gap-1.5">
                <Plus className="w-3.5 h-3.5" /> Inject Lead
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-card rounded-none border-border max-w-md">
              <DialogHeader>
                <DialogTitle className="font-mono text-[11px] uppercase tracking-wider">New Lead Entry</DialogTitle>
              </DialogHeader>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-2">
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
            </DialogContent>
          </Dialog>
        </div>

        {/* Table */}
        <div className="border border-border bg-card">
          <div className="px-4 py-3 border-b border-border bg-muted/40">
            <div className="relative max-w-sm">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-secondary-foreground" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search leads..."
                className="pl-9 rounded-none border-border bg-background font-mono text-sm h-8"
              />
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left op-table">
              <thead>
                <tr>
                  <th>Business</th>
                  <th className="hidden sm:table-cell">Vertical / Geo</th>
                  <th>Status</th>
                  <th className="hidden md:table-cell">Opportunity</th>
                  <th className="text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  Array(5).fill(0).map((_, i) => (
                    <tr key={i}>
                      <td><Skeleton className="h-4 w-36" /></td>
                      <td className="hidden sm:table-cell"><Skeleton className="h-4 w-28" /></td>
                      <td><Skeleton className="h-5 w-20" /></td>
                      <td className="hidden md:table-cell"><Skeleton className="h-4 w-24" /></td>
                      <td />
                    </tr>
                  ))
                ) : filteredLeads?.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-12 text-center text-secondary-foreground font-mono text-xs">
                      No leads found in index.
                    </td>
                  </tr>
                ) : (
                  filteredLeads?.map((lead) => (
                    <tr key={lead.id}>
                      <td>
                        <div className="font-medium text-[13px]">{lead.businessName}</div>
                        {lead.domain && (
                          <div className="font-mono text-[11px] text-secondary-foreground mt-0.5">{lead.domain}</div>
                        )}
                      </td>
                      <td className="hidden sm:table-cell">
                        <div className="text-[13px]">{lead.vertical}</div>
                        <div className="font-mono text-[11px] text-secondary-foreground mt-0.5">{lead.geo}</div>
                      </td>
                      <td><StatusPill status={lead.status} /></td>
                      <td className="hidden md:table-cell">
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
      </div>
    </DashboardLayout>
  );
};

export default LeadsPage;
