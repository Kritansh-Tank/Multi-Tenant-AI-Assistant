import * as msgAccess from "../access/messages";
import * as intAccess from "../access/integrations";
import * as instanceAccess from "../access/product-instances";
import * as convService from "./conversations";
import { IMessage } from "../db/models";

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY || "";
const AI_MODEL = "google/gemini-2.0-flash-exp:free";

interface ChatContext {
  conversationId: string;
  projectSlug: string;
  instanceId: string;
  userMessage: string;
}

function buildSystemPrompt(
  instanceName: string,
  productType: string,
  integrationData: Record<string, unknown>
): string {
  let prompt = `You are "${instanceName}", an AI ${productType === "sales-assistant" ? "Sales Assistant" : "Support Bot"}. `;
  prompt += `You help users with ${productType === "sales-assistant" ? "product recommendations, pricing, and purchasing decisions" : "technical support, order tracking, and issue resolution"}. `;
  prompt += `Be helpful, professional, and concise. Use markdown formatting for better readability.\n\n`;

  if (Object.keys(integrationData).length > 0) {
    prompt += `You have access to the following integration data:\n`;
    prompt += JSON.stringify(integrationData, null, 2);
    prompt += `\n\nUse this data to provide accurate and relevant responses. Reference specific products, orders, contacts, or deals when applicable.`;
  }

  return prompt;
}

async function callAI(
  systemPrompt: string,
  messages: { role: string; content: string }[]
): Promise<string> {
  // If no API key, use intelligent mock responses
  if (!OPENROUTER_API_KEY || OPENROUTER_API_KEY === "your-openrouter-api-key-here") {
    return generateMockResponse(messages[messages.length - 1]?.content || "");
  }

  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
        "HTTP-Referer": process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
      },
      body: JSON.stringify({
        model: AI_MODEL,
        messages: [
          { role: "system", content: systemPrompt },
          ...messages.map((m) => ({
            role: m.role === "step" ? "assistant" : m.role,
            content: m.content,
          })),
        ],
        max_tokens: 1000,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI API error:", response.status, errorText);
      // Fallback to mock on rate limit or error
      if (response.status === 429) {
        return "I'm currently experiencing high demand. " + generateMockResponse(messages[messages.length - 1]?.content || "");
      }
      return generateMockResponse(messages[messages.length - 1]?.content || "");
    }

    const data = await response.json();
    return data.choices?.[0]?.message?.content || "I apologize, but I couldn't generate a response. Please try again.";
  } catch (error) {
    console.error("AI call failed:", error);
    return generateMockResponse(messages[messages.length - 1]?.content || "");
  }
}

function generateMockResponse(userMessage: string): string {
  const lower = userMessage.toLowerCase();

  if (lower.includes("product") || lower.includes("recommend")) {
    return "Based on your needs, I'd recommend our **Premium Widget** ($49.99) for excellent value, or the **Pro Toolkit** ($149.99) for a comprehensive solution. Both come with our satisfaction guarantee!\n\nWould you like more details on either option?";
  }
  if (lower.includes("order") || lower.includes("track") || lower.includes("ship")) {
    return "I can help you track your order! Your most recent order **ORD-1001** is currently **shipped** and on its way. You should receive it within 2-3 business days.\n\n📦 **Tracking Status:** In Transit\n📅 **Estimated Delivery:** Tomorrow";
  }
  if (lower.includes("price") || lower.includes("cost") || lower.includes("discount")) {
    return "Here are our current pricing options:\n\n| Product | Price | Stock |\n|---------|-------|-------|\n| Premium Widget | $49.99 | ✅ In Stock |\n| Deluxe Gadget | $99.99 | ✅ In Stock |\n| Pro Toolkit | $149.99 | ✅ In Stock |\n\nWe also offer **10% off** for orders over $200! 🎉";
  }
  if (lower.includes("help") || lower.includes("support") || lower.includes("issue")) {
    return "I'm here to help! Here are some things I can assist you with:\n\n1. 🛒 **Product information** and recommendations\n2. 📦 **Order tracking** and status updates\n3. 🔧 **Technical support** and troubleshooting\n4. 💳 **Billing** and payment questions\n\nWhat would you like help with?";
  }
  if (lower.includes("lead") || lower.includes("contact") || lower.includes("deal")) {
    return "I found some relevant information from your CRM:\n\n**Active Deals:**\n- Enterprise License — $50,000 (Negotiation stage)\n- Team Plan Upgrade — $12,000 (Proposal stage)\n\n**Top Leads:**\n- John Doe (Score: 85) — Ready for outreach\n- Sara Miller (Score: 92) — Existing customer, upsell opportunity\n\nWould you like me to prepare a follow-up for any of these?";
  }

  return "Thank you for your message! I'm your AI assistant, and I can help you with:\n\n- **Product inquiries** and recommendations\n- **Order management** and tracking\n- **Customer support** and FAQs\n- **Sales insights** and lead information\n\nHow can I assist you today? 😊";
}

export async function processChat(context: ChatContext): Promise<IMessage[]> {
  const { conversationId, projectSlug, instanceId, userMessage } = context;

  // Verify access
  await convService.getConversationById(conversationId, projectSlug);

  // Save user message
  const userMsg = await msgAccess.createMessage({
    conversationId,
    role: "user",
    content: userMessage,
  });

  // Get instance info
  const instance = await instanceAccess.findProductInstanceById(instanceId);
  if (!instance) throw new Error("NOT_FOUND");

  // Add step messages
  const steps: IMessage[] = [];
  const step1 = await msgAccess.createMessage({
    conversationId,
    role: "step",
    content: `Analyzing your message...`,
  });
  steps.push(step1);

  // Gather integration data
  const integrationData: Record<string, unknown> = {};
  const integrations = await intAccess.findIntegrationsByInstanceId(instanceId);

  for (const integration of integrations) {
    if (integration.enabled) {
      const step = await msgAccess.createMessage({
        conversationId,
        role: "step",
        content: `Checking ${integration.type === "shopify" ? "Shopify" : "CRM"} integration data...`,
      });
      steps.push(step);
      integrationData[integration.type] = integration.mockData;
    }
  }

  // Build conversation history
  const allMessages = await msgAccess.findMessagesByConversationId(conversationId);
  const chatHistory = allMessages
    .filter((m) => m.role === "user" || m.role === "assistant")
    .slice(-10)
    .map((m) => ({ role: m.role, content: m.content }));

  // Build system prompt with integration context
  const systemPrompt = buildSystemPrompt(
    instance.name,
    instance.productType,
    integrationData
  );

  // Call AI
  const aiResponse = await callAI(systemPrompt, chatHistory);

  // Save assistant message
  const assistantMsg = await msgAccess.createMessage({
    conversationId,
    role: "assistant",
    content: aiResponse,
  });

  return [userMsg, ...steps, assistantMsg];
}
