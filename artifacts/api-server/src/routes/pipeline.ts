import { Router } from "express";
import { db, leadsTable, pipelineRunsTable, activityTable } from "@workspace/db";
import { eq, count, sum, sql } from "drizzle-orm";

const router = Router();

router.get("/summary", async (req, res) => {
  const [leadsCount] = await db.select({ count: count() }).from(leadsTable);
  const [activeRuns] = await db.select({ count: count() }).from(pipelineRunsTable).where(eq(pipelineRunsTable.status, "running"));
  const wonLeads = await db.select().from(leadsTable).where(eq(leadsTable.status, "won"));
  const totalLeads = leadsCount.count;
  const wonDeals = wonLeads.length;
  const totalRevenue = wonLeads.reduce((sum, l) => sum + (l.priceOffered ?? 1997), 0);

  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const wonThisMonth = wonLeads.filter(l => new Date(l.createdAt) >= startOfMonth).length;

  const conversionRate = totalLeads > 0 ? Math.round((wonDeals / totalLeads) * 100) / 100 : 0;

  res.json({
    totalLeads,
    activeRuns: activeRuns.count,
    wonDeals,
    totalRevenue,
    wonThisMonth,
    conversionRate,
  });
});

router.get("/activity", async (req, res) => {
  const activity = await db
    .select()
    .from(activityTable)
    .orderBy(sql`${activityTable.createdAt} DESC`)
    .limit(20);
  res.json(activity);
});

router.get("/verticals", async (req, res) => {
  const results = await db
    .select({
      vertical: leadsTable.vertical,
      count: count(),
    })
    .from(leadsTable)
    .groupBy(leadsTable.vertical);
  res.json(results);
});

export default router;
