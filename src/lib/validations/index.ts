import { z } from "zod";

// --- Project ---
export const createProjectSchema = z.object({
  name: z.string().min(1).max(100),
  slug: z.string().min(1).max(50).regex(/^[a-z0-9-]+$/),
  description: z.string().max(500).optional(),
});

// --- User ---
export const loginSchema = z.object({
  userId: z.string().min(1),
});

// --- Product Instance ---
export const createProductInstanceSchema = z.object({
  name: z.string().min(1).max(100),
  productType: z.enum(["sales-assistant", "support-bot"]),
  description: z.string().max(500).optional(),
});

export const updateIntegrationsSchema = z.object({
  shopify: z.boolean().optional(),
  crm: z.boolean().optional(),
});

// --- Conversation ---
export const createConversationSchema = z.object({
  title: z.string().min(1).max(200).optional(),
});

// --- Message / Chat ---
export const sendMessageSchema = z.object({
  content: z.string().min(1).max(10000),
});

// --- Dashboard Config ---
export const widgetSchema = z.object({
  id: z.string().min(1),
  type: z.enum(["stats-card", "chart", "recent-activity", "list", "metric-bar"]),
  title: z.string().min(1),
  order: z.number().int().min(0),
  config: z.record(z.unknown()),
});

export const sectionSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  order: z.number().int().min(0),
  columns: z.number().int().min(1).max(4),
  widgets: z.array(widgetSchema),
});

export const updateDashboardConfigSchema = z.object({
  sections: z.array(sectionSchema).optional(),
  theme: z
    .object({
      accentColor: z.string().optional(),
      showWelcomeBanner: z.boolean().optional(),
      welcomeMessage: z.string().optional(),
    })
    .optional(),
});

// --- Integration ---
export const updateIntegrationSchema = z.object({
  enabled: z.boolean(),
});

// --- Query params ---
export const projectSlugSchema = z.object({
  projectSlug: z.string().min(1),
});

export const paginationSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});
