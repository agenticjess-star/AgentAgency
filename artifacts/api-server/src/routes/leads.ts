import { Router } from "express";
import { db, leadsTable, activityTable } from "@workspace/db";
import { eq, and, or } from "drizzle-orm";
import {
  ListLeadsQueryParams,
  CreateLeadBody,
  UpdateLeadBody,
  GetLeadParams,
  UpdateLeadParams,
  DeleteLeadParams,
} from "@workspace/api-zod";

const router = Router();

router.get("/", async (req, res) => {
  const query = ListLeadsQueryParams.safeParse(req.query);
  let leads;
  if (query.success && query.data.status) {
    leads = await db.select().from(leadsTable).where(eq(leadsTable.status, query.data.status));
  } else if (query.success && query.data.vertical) {
    leads = await db.select().from(leadsTable).where(eq(leadsTable.vertical, query.data.vertical));
  } else {
    leads = await db.select().from(leadsTable);
  }
  res.json(leads);
});

router.post("/", async (req, res) => {
  const body = CreateLeadBody.safeParse(req.body);
  if (!body.success) {
    res.status(400).json({ error: "Invalid body" });
    return;
  }
  const [lead] = await db.insert(leadsTable).values(body.data).returning();
  await db.insert(activityTable).values({
    type: "lead_created",
    businessName: lead.businessName,
    description: `New lead added: ${lead.businessName} (${lead.opportunityTag})`,
    leadId: lead.id,
  });
  res.status(201).json(lead);
});

router.get("/:id", async (req, res) => {
  const params = GetLeadParams.safeParse({ id: Number(req.params.id) });
  if (!params.success) {
    res.status(400).json({ error: "Invalid id" });
    return;
  }
  const [lead] = await db.select().from(leadsTable).where(eq(leadsTable.id, params.data.id));
  if (!lead) {
    res.status(404).json({ error: "Not found" });
    return;
  }
  res.json(lead);
});

router.patch("/:id", async (req, res) => {
  const params = UpdateLeadParams.safeParse({ id: Number(req.params.id) });
  const body = UpdateLeadBody.safeParse(req.body);
  if (!params.success || !body.success) {
    res.status(400).json({ error: "Invalid input" });
    return;
  }
  const [lead] = await db
    .update(leadsTable)
    .set(body.data)
    .where(eq(leadsTable.id, params.data.id))
    .returning();
  if (!lead) {
    res.status(404).json({ error: "Not found" });
    return;
  }
  if (body.data.status) {
    await db.insert(activityTable).values({
      type: "status_changed",
      businessName: lead.businessName,
      description: `Lead status updated to ${body.data.status}`,
      leadId: lead.id,
    });
  }
  res.json(lead);
});

router.delete("/:id", async (req, res) => {
  const params = DeleteLeadParams.safeParse({ id: Number(req.params.id) });
  if (!params.success) {
    res.status(400).json({ error: "Invalid id" });
    return;
  }
  await db.delete(leadsTable).where(eq(leadsTable.id, params.data.id));
  res.status(204).send();
});

export default router;
