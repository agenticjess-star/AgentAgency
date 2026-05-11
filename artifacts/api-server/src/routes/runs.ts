import { Router } from "express";
import { db, pipelineRunsTable, leadsTable, activityTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import {
  CreateRunBody,
  UpdateRunBody,
  GetRunParams,
  UpdateRunParams,
} from "@workspace/api-zod";

const router = Router();

router.get("/", async (req, res) => {
  const runs = await db
    .select({
      id: pipelineRunsTable.id,
      leadId: pipelineRunsTable.leadId,
      businessName: leadsTable.businessName,
      status: pipelineRunsTable.status,
      currentAgent: pipelineRunsTable.currentAgent,
      agentLogs: pipelineRunsTable.agentLogs,
      siteUrl: pipelineRunsTable.siteUrl,
      emailDraft: pipelineRunsTable.emailDraft,
      auditScore: pipelineRunsTable.auditScore,
      createdAt: pipelineRunsTable.createdAt,
      completedAt: pipelineRunsTable.completedAt,
    })
    .from(pipelineRunsTable)
    .leftJoin(leadsTable, eq(pipelineRunsTable.leadId, leadsTable.id));
  res.json(runs);
});

router.post("/", async (req, res) => {
  const body = CreateRunBody.safeParse(req.body);
  if (!body.success) {
    res.status(400).json({ error: "Invalid body" });
    return;
  }
  const [lead] = await db.select().from(leadsTable).where(eq(leadsTable.id, body.data.leadId));
  if (!lead) {
    res.status(404).json({ error: "Lead not found" });
    return;
  }
  const [run] = await db
    .insert(pipelineRunsTable)
    .values({ leadId: body.data.leadId, status: "running", currentAgent: "prospector" })
    .returning();
  await db.insert(activityTable).values({
    type: "run_started",
    businessName: lead.businessName,
    description: `Pipeline run started for ${lead.businessName}`,
    leadId: lead.id,
    runId: run.id,
  });
  res.status(201).json({ ...run, businessName: lead.businessName });
});

router.get("/:id", async (req, res) => {
  const params = GetRunParams.safeParse({ id: Number(req.params.id) });
  if (!params.success) {
    res.status(400).json({ error: "Invalid id" });
    return;
  }
  const [run] = await db
    .select({
      id: pipelineRunsTable.id,
      leadId: pipelineRunsTable.leadId,
      businessName: leadsTable.businessName,
      status: pipelineRunsTable.status,
      currentAgent: pipelineRunsTable.currentAgent,
      agentLogs: pipelineRunsTable.agentLogs,
      siteUrl: pipelineRunsTable.siteUrl,
      emailDraft: pipelineRunsTable.emailDraft,
      auditScore: pipelineRunsTable.auditScore,
      createdAt: pipelineRunsTable.createdAt,
      completedAt: pipelineRunsTable.completedAt,
    })
    .from(pipelineRunsTable)
    .leftJoin(leadsTable, eq(pipelineRunsTable.leadId, leadsTable.id))
    .where(eq(pipelineRunsTable.id, params.data.id));
  if (!run) {
    res.status(404).json({ error: "Not found" });
    return;
  }
  res.json(run);
});

router.patch("/:id", async (req, res) => {
  const params = UpdateRunParams.safeParse({ id: Number(req.params.id) });
  const body = UpdateRunBody.safeParse(req.body);
  if (!params.success || !body.success) {
    res.status(400).json({ error: "Invalid input" });
    return;
  }
  const updateData: Record<string, unknown> = { ...body.data };
  if (body.data.status === "completed" || body.data.status === "failed") {
    updateData.completedAt = new Date();
  }
  const [run] = await db
    .update(pipelineRunsTable)
    .set(updateData)
    .where(eq(pipelineRunsTable.id, params.data.id))
    .returning();
  if (!run) {
    res.status(404).json({ error: "Not found" });
    return;
  }
  const [lead] = await db.select().from(leadsTable).where(eq(leadsTable.id, run.leadId));
  if (body.data.currentAgent) {
    await db.insert(activityTable).values({
      type: "agent_handoff",
      businessName: lead?.businessName ?? "Unknown",
      description: `Run advanced to agent: ${body.data.currentAgent}`,
      leadId: run.leadId,
      runId: run.id,
    });
  }
  res.json({ ...run, businessName: lead?.businessName });
});

export default router;
