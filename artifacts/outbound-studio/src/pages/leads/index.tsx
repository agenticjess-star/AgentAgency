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
  opportunityTag: z.enum(["no_website", "weak_website", "outdated", "not_ai_citable"])
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
      opportunityTag: "weak_website" as const
    }
  });

  const onSubmit = (values: any) => {
    createLead.mutate({ data: values }, {
      onSuccess: () => {
        qc.invalidateQueries({ queryKey: getListLeadsQueryKey() });
        setOpen(false);
        form.reset();
      }
    });
  };

  const filteredLeads = leads?.filter(l => 
    l.businessName.toLowerCase().includes(search.toLowerCase()) || 
    l.vertical.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="heading-lg">Leads</h1>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="bg-primary text-primary-foreground font-mono uppercase text-xs tracking-wider rounded-none">
                <Plus className="w-4 h-4 mr-2" /> Inject Lead
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-card rounded-none border-border">
              <DialogHeader>
                <DialogTitle className="font-mono uppercase tracking-wider">New Lead Entry</DialogTitle>
              </DialogHeader>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField control={form.control} name="businessName" render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-mono text-xs uppercase">Business Name</FormLabel>
                      <FormControl><Input {...field} className="rounded-none bg-background border-border" /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <div className="grid grid-cols-2 gap-4">
                    <FormField control={form.control} name="vertical" render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-mono text-xs uppercase">Vertical</FormLabel>
                        <FormControl><Input {...field} className="rounded-none bg-background border-border" /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormField control={form.control} name="geo" render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-mono text-xs uppercase">Location (Geo)</FormLabel>
                        <FormControl><Input {...field} className="rounded-none bg-background border-border" /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                  </div>
                  <FormField control={form.control} name="domain" render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-mono text-xs uppercase">Domain (Optional)</FormLabel>
                      <FormControl><Input {...field} className="rounded-none bg-background border-border" /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="opportunityTag" render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-mono text-xs uppercase">Opportunity Tag</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="rounded-none bg-background border-border">
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="rounded-none border-border">
                          <SelectItem value="no_website">No Website</SelectItem>
                          <SelectItem value="weak_website">Weak Website</SelectItem>
                          <SelectItem value="outdated">Outdated</SelectItem>
                          <SelectItem value="not_ai_citable">Not AI Citable</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <Button type="submit" disabled={createLead.isPending} className="w-full bg-accent hover:bg-accent/90 text-white rounded-none font-mono uppercase">
                    Submit Entry
                  </Button>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="border border-border bg-card">
          <div className="p-4 border-b border-border flex items-center gap-4 bg-muted/20">
            <div className="relative flex-1 max-w-sm">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-secondary-foreground" />
              <Input 
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search index..." 
                className="pl-9 rounded-none border-border bg-background font-mono text-sm"
              />
            </div>
          </div>

          <div className="w-full overflow-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-border font-mono text-xs uppercase text-secondary-foreground">
                  <th className="p-4 font-normal">Business</th>
                  <th className="p-4 font-normal">Vertical/Geo</th>
                  <th className="p-4 font-normal">Status</th>
                  <th className="p-4 font-normal text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  Array(5).fill(0).map((_, i) => (
                    <tr key={i} className="border-b border-border">
                      <td className="p-4"><Skeleton className="h-5 w-40" /></td>
                      <td className="p-4"><Skeleton className="h-5 w-32" /></td>
                      <td className="p-4"><Skeleton className="h-5 w-24" /></td>
                      <td className="p-4"></td>
                    </tr>
                  ))
                ) : filteredLeads?.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="p-8 text-center text-secondary-foreground font-mono text-sm">
                      No leads found in index.
                    </td>
                  </tr>
                ) : (
                  filteredLeads?.map(lead => (
                    <tr key={lead.id} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                      <td className="p-4">
                        <div className="font-medium text-sm">{lead.businessName}</div>
                        {lead.domain && <div className="text-xs text-secondary-foreground mt-1 font-mono">{lead.domain}</div>}
                      </td>
                      <td className="p-4">
                        <div className="text-sm">{lead.vertical}</div>
                        <div className="text-xs text-secondary-foreground mt-1 font-mono">{lead.geo}</div>
                      </td>
                      <td className="p-4">
                        <StatusPill status={lead.status} />
                      </td>
                      <td className="p-4 text-right">
                        <Link href={`/leads/${lead.id}`}>
                          <Button variant="ghost" size="sm" className="font-mono text-xs uppercase text-secondary-foreground hover:text-foreground">
                            View <ChevronRight className="w-3 h-3 ml-1" />
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
