"use client";

import { useParams } from "next/navigation";
import { useMessages, useSendMessage } from "@/hooks/useMessages";
import { useProductInstances } from "@/hooks/useProductInstances";
import ConversationSidebar from "@/components/chat/ConversationSidebar";
import MessageList from "@/components/chat/MessageList";
import ChatInput from "@/components/chat/ChatInput";
import IntegrationPanel from "@/components/chat/IntegrationPanel";

export default function ConversationPage() {
    const params = useParams();
    const projectSlug = params.projectSlug as string;
    const instanceId = params.instanceId as string;
    const conversationId = params.conversationId as string;

    const { data: instances } = useProductInstances(projectSlug);
    const { data: messages, isLoading } = useMessages(projectSlug, instanceId, conversationId);
    const sendMutation = useSendMessage(projectSlug, instanceId, conversationId);

    const instance = instances?.find((i) => i._id === instanceId);

    const handleSend = (content: string) => {
        sendMutation.mutate(content);
    };

    return (
        <div className="flex h-full" data-testid="conversation-page">
            {/* Left: Integrations + conversations */}
            <div className="flex flex-col border-r border-surface-800/60 w-60 flex-shrink-0">
                <IntegrationPanel projectSlug={projectSlug} instanceId={instanceId} />
                <ConversationSidebar
                    instanceId={instanceId}
                    projectSlug={projectSlug}
                    activeConversationId={conversationId}
                />
            </div>

            {/* Right: Chat area */}
            <div className="flex-1 flex flex-col min-w-0">
                {/* Header */}
                <div className="px-5 py-3.5 border-b border-surface-800/60 flex items-center gap-3" data-testid="chat-header">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${instance?.productType === "sales-assistant"
                            ? "bg-green-500/20 text-green-400"
                            : "bg-blue-500/20 text-blue-400"
                        }`}>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            {instance?.productType === "sales-assistant" ? (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                            ) : (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                            )}
                        </svg>
                    </div>
                    <div>
                        <h2 className="text-sm font-semibold text-surface-100">{instance?.name || "AI Assistant"}</h2>
                        <p className="text-xs text-surface-500 capitalize">{instance?.productType?.replace("-", " ")}</p>
                    </div>
                    {sendMutation.isPending && (
                        <div className="ml-auto flex items-center gap-2 text-xs text-surface-500">
                            <div className="w-3.5 h-3.5 border border-primary-500 border-t-transparent rounded-full animate-spin" />
                            Thinking…
                        </div>
                    )}
                    {sendMutation.isError && (
                        <div className="ml-auto text-xs text-red-400">Failed to send. Try again.</div>
                    )}
                </div>

                {/* Messages */}
                <MessageList
                    messages={messages || []}
                    isLoading={isLoading}
                    isSending={sendMutation.isPending}
                />

                {/* Input */}
                <ChatInput onSend={handleSend} disabled={sendMutation.isPending} />
            </div>
        </div>
    );
}
