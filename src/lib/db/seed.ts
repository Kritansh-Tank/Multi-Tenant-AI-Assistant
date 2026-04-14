import mongoose from "mongoose";
import { connectDB } from "./connection";
import { Project } from "./models/project";
import { User } from "./models/user";
import { ProductInstance } from "./models/product-instance";
import { Conversation } from "./models/conversation";
import { Message } from "./models/message";
import { DashboardConfig } from "./models/dashboard-config";
import { Integration } from "./models/integration";

async function seed() {
  console.log("🌱 Seeding database...");
  await connectDB();

  // Clear existing data
  await Promise.all([
    Project.deleteMany({}),
    User.deleteMany({}),
    ProductInstance.deleteMany({}),
    Conversation.deleteMany({}),
    Message.deleteMany({}),
    DashboardConfig.deleteMany({}),
    Integration.deleteMany({}),
  ]);

  // --- Projects ---
  const acme = await Project.create({
    name: "Acme Corporation",
    slug: "acme-corp",
    description: "Enterprise e-commerce platform with AI-powered sales and support.",
  });

  const beta = await Project.create({
    name: "Beta Startup",
    slug: "beta-startup",
    description: "SaaS analytics platform with intelligent customer engagement.",
  });

  // --- Users ---
  const alice = await User.create({
    name: "Alice Johnson",
    email: "alice@acme.com",
    role: "admin",
    avatar: "AJ",
    projectIds: [acme._id],
  });

  const bob = await User.create({
    name: "Bob Smith",
    email: "bob@acme.com",
    role: "member",
    avatar: "BS",
    projectIds: [acme._id],
  });

  const charlie = await User.create({
    name: "Charlie Davis",
    email: "charlie@beta.com",
    role: "admin",
    avatar: "CD",
    projectIds: [beta._id],
  });

  // --- Product Instances ---
  const acmeSales = await ProductInstance.create({
    projectId: acme._id,
    name: "AI Sales Assistant",
    productType: "sales-assistant",
    description: "Helps customers find and purchase products with personalized recommendations.",
    integrations: { shopify: true, crm: true },
  });

  const acmeSupport = await ProductInstance.create({
    projectId: acme._id,
    name: "Support Bot",
    productType: "support-bot",
    description: "Handles customer support tickets and FAQs automatically.",
    integrations: { shopify: true, crm: false },
  });

  const betaSales = await ProductInstance.create({
    projectId: beta._id,
    name: "Lead Qualifier",
    productType: "sales-assistant",
    description: "Qualifies inbound leads and schedules demo calls.",
    integrations: { shopify: false, crm: true },
  });

  // --- Integrations with mock data ---
  await Integration.create([
    {
      productInstanceId: acmeSales._id,
      type: "shopify",
      enabled: true,
      mockData: {
        storeName: "Acme Store",
        products: [
          { id: "prod-1", name: "Premium Widget", price: 49.99, stock: 150, category: "Widgets" },
          { id: "prod-2", name: "Deluxe Gadget", price: 99.99, stock: 75, category: "Gadgets" },
          { id: "prod-3", name: "Ultra Component", price: 29.99, stock: 300, category: "Components" },
          { id: "prod-4", name: "Pro Toolkit", price: 149.99, stock: 50, category: "Toolkits" },
        ],
        recentOrders: [
          { orderId: "ORD-1001", customer: "John D.", total: 149.98, status: "shipped" },
          { orderId: "ORD-1002", customer: "Sara M.", total: 99.99, status: "processing" },
          { orderId: "ORD-1003", customer: "Mike R.", total: 329.95, status: "delivered" },
        ],
      },
    },
    {
      productInstanceId: acmeSales._id,
      type: "crm",
      enabled: true,
      mockData: {
        crmName: "Acme CRM",
        contacts: [
          { id: "c-1", name: "John Doe", email: "john@example.com", status: "lead", score: 85 },
          { id: "c-2", name: "Sara Miller", email: "sara@example.com", status: "customer", score: 92 },
          { id: "c-3", name: "Mike Ross", email: "mike@example.com", status: "prospect", score: 67 },
        ],
        deals: [
          { id: "d-1", title: "Enterprise License", value: 50000, stage: "negotiation" },
          { id: "d-2", title: "Team Plan Upgrade", value: 12000, stage: "proposal" },
        ],
      },
    },
    {
      productInstanceId: acmeSupport._id,
      type: "shopify",
      enabled: true,
      mockData: {
        storeName: "Acme Store",
        products: [
          { id: "prod-1", name: "Premium Widget", price: 49.99, stock: 150, category: "Widgets" },
          { id: "prod-2", name: "Deluxe Gadget", price: 99.99, stock: 75, category: "Gadgets" },
        ],
        recentOrders: [
          { orderId: "ORD-1001", customer: "John D.", total: 149.98, status: "shipped" },
        ],
      },
    },
    {
      productInstanceId: betaSales._id,
      type: "crm",
      enabled: true,
      mockData: {
        crmName: "Beta CRM",
        contacts: [
          { id: "c-10", name: "Alex Turner", email: "alex@startup.io", status: "lead", score: 78 },
          { id: "c-11", name: "Pat Chen", email: "pat@enterprise.co", status: "prospect", score: 55 },
        ],
        deals: [
          { id: "d-10", title: "Pilot Program", value: 8000, stage: "discovery" },
        ],
      },
    },
  ]);

  // --- Conversations + Messages ---
  const conv1 = await Conversation.create({
    projectId: acme._id,
    productInstanceId: acmeSales._id,
    userId: alice._id,
    title: "Product Recommendations",
  });

  await Message.create([
    { conversationId: conv1._id, role: "user", content: "What products do you recommend for a new business setup?" },
    { conversationId: conv1._id, role: "step", content: "Analyzing available products from Shopify catalog..." },
    { conversationId: conv1._id, role: "step", content: "Checking CRM for customer segment preferences..." },
    {
      conversationId: conv1._id,
      role: "assistant",
      content:
        "Based on your business profile, I recommend starting with our **Pro Toolkit** ($149.99) which includes everything you need for initial setup. You might also want to add the **Premium Widget** ($49.99) for enhanced functionality. Both are in stock and ready to ship!",
    },
    { conversationId: conv1._id, role: "user", content: "Can you tell me more about the Pro Toolkit?" },
    { conversationId: conv1._id, role: "step", content: "Fetching detailed product information..." },
    {
      conversationId: conv1._id,
      role: "assistant",
      content:
        "The **Pro Toolkit** is our most comprehensive package:\n\n• **Price:** $149.99\n• **Stock:** 50 units available\n• **Category:** Toolkits\n\nIt includes all essential components for professional setup, with a 1-year warranty and free technical support. Would you like to place an order?",
    },
  ]);

  const conv2 = await Conversation.create({
    projectId: acme._id,
    productInstanceId: acmeSupport._id,
    userId: bob._id,
    title: "Order Status Inquiry",
  });

  await Message.create([
    { conversationId: conv2._id, role: "user", content: "Where is my order ORD-1001?" },
    { conversationId: conv2._id, role: "step", content: "Looking up order ORD-1001 in Shopify..." },
    {
      conversationId: conv2._id,
      role: "assistant",
      content:
        "I found your order! Here are the details:\n\n• **Order ID:** ORD-1001\n• **Customer:** John D.\n• **Total:** $149.98\n• **Status:** Shipped ✅\n\nYour order has been shipped and is on its way. You should receive a tracking email shortly!",
    },
  ]);

  // --- Dashboard Config for Acme (admin-only, config-driven) ---
  await DashboardConfig.create({
    projectId: acme._id,
    sections: [
      {
        id: "overview",
        title: "Overview",
        order: 1,
        columns: 4,
        widgets: [
          {
            id: "total-conversations",
            type: "stats-card",
            title: "Total Conversations",
            order: 1,
            config: { value: "1,247", change: "+12.5%", trend: "up", icon: "chat" },
          },
          {
            id: "active-users",
            type: "stats-card",
            title: "Active Users",
            order: 2,
            config: { value: "342", change: "+5.2%", trend: "up", icon: "users" },
          },
          {
            id: "ai-responses",
            type: "stats-card",
            title: "AI Responses",
            order: 3,
            config: { value: "8,901", change: "+18.3%", trend: "up", icon: "bot" },
          },
          {
            id: "satisfaction",
            type: "stats-card",
            title: "Satisfaction Rate",
            order: 4,
            config: { value: "94.2%", change: "+2.1%", trend: "up", icon: "star" },
          },
        ],
      },
      {
        id: "analytics",
        title: "Analytics",
        order: 2,
        columns: 2,
        widgets: [
          {
            id: "conversation-chart",
            type: "chart",
            title: "Conversations Over Time",
            order: 1,
            config: {
              chartType: "line",
              data: [
                { label: "Mon", value: 45 },
                { label: "Tue", value: 62 },
                { label: "Wed", value: 58 },
                { label: "Thu", value: 71 },
                { label: "Fri", value: 89 },
                { label: "Sat", value: 34 },
                { label: "Sun", value: 28 },
              ],
              color: "#3b82f6",
            },
          },
          {
            id: "response-time",
            type: "metric-bar",
            title: "Response Performance",
            order: 2,
            config: {
              metrics: [
                { label: "Avg Response Time", value: 1.2, unit: "s", max: 5, color: "#22c55e" },
                { label: "AI Accuracy", value: 92, unit: "%", max: 100, color: "#3b82f6" },
                { label: "Resolution Rate", value: 78, unit: "%", max: 100, color: "#f59e0b" },
              ],
            },
          },
        ],
      },
      {
        id: "activity",
        title: "Recent Activity",
        order: 3,
        columns: 2,
        widgets: [
          {
            id: "recent-conversations",
            type: "recent-activity",
            title: "Recent Conversations",
            order: 1,
            config: {
              activities: [
                { user: "Alice J.", action: "started a conversation", target: "Product Recommendations", time: "5 min ago" },
                { user: "Bob S.", action: "asked about", target: "Order Status", time: "12 min ago" },
                { user: "Sara M.", action: "completed purchase via", target: "AI Sales Assistant", time: "1 hour ago" },
                { user: "John D.", action: "left feedback on", target: "Support Bot", time: "2 hours ago" },
              ],
            },
          },
          {
            id: "top-topics",
            type: "list",
            title: "Top Conversation Topics",
            order: 2,
            config: {
              items: [
                { label: "Product Inquiries", value: "34%", badge: "trending" },
                { label: "Order Status", value: "28%", badge: "stable" },
                { label: "Technical Support", value: "19%", badge: "stable" },
                { label: "Returns & Refunds", value: "11%", badge: "down" },
                { label: "Account Issues", value: "8%", badge: "stable" },
              ],
            },
          },
        ],
      },
    ],
    theme: {
      accentColor: "#3b82f6",
      showWelcomeBanner: true,
      welcomeMessage: "Welcome back, Admin! Here's your project overview.",
    },
  });

  // --- Dashboard Config for Beta ---
  await DashboardConfig.create({
    projectId: beta._id,
    sections: [
      {
        id: "overview",
        title: "Overview",
        order: 1,
        columns: 3,
        widgets: [
          {
            id: "total-leads",
            type: "stats-card",
            title: "Total Leads",
            order: 1,
            config: { value: "89", change: "+8.1%", trend: "up", icon: "users" },
          },
          {
            id: "qualified-leads",
            type: "stats-card",
            title: "Qualified Leads",
            order: 2,
            config: { value: "34", change: "+15.0%", trend: "up", icon: "star" },
          },
          {
            id: "conversion-rate",
            type: "stats-card",
            title: "Conversion Rate",
            order: 3,
            config: { value: "38.2%", change: "+4.5%", trend: "up", icon: "chart" },
          },
        ],
      },
      {
        id: "pipeline",
        title: "Pipeline",
        order: 2,
        columns: 2,
        widgets: [
          {
            id: "lead-chart",
            type: "chart",
            title: "Lead Generation Trend",
            order: 1,
            config: {
              chartType: "bar",
              data: [
                { label: "Week 1", value: 12 },
                { label: "Week 2", value: 18 },
                { label: "Week 3", value: 24 },
                { label: "Week 4", value: 35 },
              ],
              color: "#8b5cf6",
            },
          },
          {
            id: "deal-stages",
            type: "list",
            title: "Deal Stages",
            order: 2,
            config: {
              items: [
                { label: "Discovery", value: "5 deals", badge: "stable" },
                { label: "Proposal", value: "3 deals", badge: "trending" },
                { label: "Negotiation", value: "2 deals", badge: "up" },
                { label: "Closed Won", value: "8 deals", badge: "trending" },
              ],
            },
          },
        ],
      },
    ],
    theme: {
      accentColor: "#8b5cf6",
      showWelcomeBanner: true,
      welcomeMessage: "Welcome to Beta Analytics Dashboard!",
    },
  });

  console.log("✅ Seed complete!");
  console.log(`   Projects: ${await Project.countDocuments()}`);
  console.log(`   Users: ${await User.countDocuments()}`);
  console.log(`   Product Instances: ${await ProductInstance.countDocuments()}`);
  console.log(`   Conversations: ${await Conversation.countDocuments()}`);
  console.log(`   Messages: ${await Message.countDocuments()}`);
  console.log(`   Dashboard Configs: ${await DashboardConfig.countDocuments()}`);
  console.log(`   Integrations: ${await Integration.countDocuments()}`);

  await mongoose.disconnect();
  process.exit(0);
}

seed().catch((err) => {
  console.error("❌ Seed failed:", err);
  process.exit(1);
});
