import { pgTable, text, serial, timestamp, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { leadsTable } from "./leads";

export const pipelineRunsTable = pgTable("pipeline_runs", {
  id: serial("id").primaryKey(),
  leadId: integer("lead_id").notNull().references(() => leadsTable.id, { onDelete: "cascade" }),
  status: text("status").notNull().default("running"),
  currentAgent: text("current_agent").notNull().default("prospector"),
  agentLogs: text("agent_logs"),
  siteUrl: text("site_url"),
  emailDraft: text("email_draft"),
  auditScore: integer("audit_score"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  completedAt: timestamp("completed_at", { withTimezone: true }),
});

export const insertPipelineRunSchema = createInsertSchema(pipelineRunsTable).omit({ id: true, createdAt: true, completedAt: true });
export type InsertPipelineRun = z.infer<typeof insertPipelineRunSchema>;
export type PipelineRun = typeof pipelineRunsTable.$inferSelect;
