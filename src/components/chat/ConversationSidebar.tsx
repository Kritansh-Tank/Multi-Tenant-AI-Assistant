"use client";

import { useParams, useRouter } from "next/navigation";
import { useConversations, useCreateConversation } from "@/hooks/useConversations";
import { useState } from "react";
import Link from "next/link";

interface Props {
    instanceId: string;
    projectSlug: string;
    activeConversationId?: string;
}

export default function ConversationSidebar({ instanceId, projectSlug, activeConversationId }: Props) {
    const { data: conversations, isLoading } = useConversations(projectSlug, instanceId);
    const createMutation = useCreateConversation(projectSlug, instanceId);
    const router = useRouter();

    const handleNew = async () => {
        const conv = await createMutation.mutateAsync(`New Chat ${Date.now()}`);
        router.push(`/${projectSlug}/chat/${instanceId}/${conv._id}`);
    };

    return (
        <div className="w-60 flex-shrink-0 border-r border-surface-800/60 flex flex-col" data-testid="conversation-sidebar">
            <div className="p-3 border-b border-surface-800/60">
                <button
                    onClick={handleNew}
                    disabled={createMutation.isPending}
                    className="btn-primary w-full text-sm flex items-center justify-center gap-2"
                    data-testid="new-conversation-btn"
                >
                    {createMutation.isPending ? (
                        <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                    ) : (
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                    )}
                    New Chat
                </button>
            </div>

            <div className="flex-1 overflow-y-auto p-2 space-y-1">
                {isLoading ? (
                    Array.from({ length: 4 }).map((_, i) => (
                        <div key={i} className="h-12 skeleton rounded-lg" />
                    ))
                ) : conversations?.length === 0 ? (
                    <div className="text-center py-8 px-3">
                        <p className="text-surface-500 text-sm">No conversations yet</p>
                        <p className="text-surface-600 text-xs mt-1">Start a new chat above</p>
                    </div>
                ) : (
                    conversations?.map((conv) => {
                        const isActive = conv._id === activeConversationId;
                        return (
                            <Link
                                key={conv._id}
                                href={`/${projectSlug}/chat/${instanceId}/${conv._id}`}
                                className={`block p-3 rounded-lg text-sm transition-all ${isActive
                                        ? "bg-primary-900/40 border border-primary-700/30 text-primary-300"
                                        : "text-surface-400 hover:text-surface-200 hover:bg-surface-800/50"
                                    }`}
                                data-testid={`conversation-item-${conv._id}`}
                            >
                                <div className="flex items-start gap-2">
                                    <svg className="w-4 h-4 mt-0.5 flex-shrink-0 opacity-60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                    </svg>
                                    <span className="truncate leading-tight">{conv.title}</span>
                                </div>
                                <p className="text-xs text-surface-600 mt-1 ml-6">
                                    {new Date(conv.updatedAt).toLocaleDateString()}
                                </p>
                            </Link>
                        );
                    })
                )}
            </div>
        </div>
    );
}
