"use client";

import { useParams } from "next/navigation";
import { useConversations, useCreateConversation } from "@/hooks/useConversations";
import { useProductInstances } from "@/hooks/useProductInstances";
import ConversationSidebar from "@/components/chat/ConversationSidebar";
import IntegrationPanel from "@/components/chat/IntegrationPanel";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function InstanceChatPage() {
    const params = useParams();
    const projectSlug = params.projectSlug as string;
    const instanceId = params.instanceId as string;
    const { data: instances } = useProductInstances(projectSlug);
    const { data: conversations, isLoading } = useConversations(projectSlug, instanceId);
    const createMutation = useCreateConversation(projectSlug, instanceId);
    const router = useRouter();

    const instance = instances?.find((i) => i._id === instanceId);

    // Auto-navigate to a conversation if one exists or create one
    useEffect(() => {
        if (!isLoading && conversations !== undefined) {
            if (conversations.length > 0) {
                router.replace(`/${projectSlug}/chat/${instanceId}/${conversations[0]._id}`);
            }
        }
    }, [conversations, isLoading, projectSlug, instanceId, router]);

    const handleCreateFirst = async () => {
        const conv = await createMutation.mutateAsync("New Chat");
        router.push(`/${projectSlug}/chat/${instanceId}/${conv._id}`);
    };

    return (
        <div className="flex h-full">
            <div className="flex flex-col border-r border-surface-800/60 w-60 flex-shrink-0">
                <IntegrationPanel projectSlug={projectSlug} instanceId={instanceId} />
                <ConversationSidebar
                    instanceId={instanceId}
                    projectSlug={projectSlug}
                />
            </div>
            <div className="flex-1 flex items-center justify-center">
                {isLoading ? (
                    <div className="w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
                ) : (
                    <div className="text-center">
                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-500/20 to-purple-600/20 border border-primary-500/20 flex items-center justify-center mx-auto mb-4">
                            <svg className="w-8 h-8 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                            </svg>
                        </div>
                        <p className="text-surface-300 font-semibold text-lg">{instance?.name}</p>
                        <p className="text-surface-500 text-sm mt-1 mb-6">Start your first conversation</p>
                        <button onClick={handleCreateFirst} disabled={createMutation.isPending} className="btn-primary">
                            {createMutation.isPending ? "Creating…" : "New Conversation"}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
