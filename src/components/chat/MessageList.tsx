"use client";

import { Message } from "@/hooks/useMessages";
import { useRef, useEffect } from "react";

function TypingIndicator() {
    return (
        <div className="flex items-end gap-2 animate-fade-in">
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-primary-500 to-purple-600 flex items-center justify-center flex-shrink-0">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17H3a2 2 0 01-2-2V5a2 2 0 012-2h14a2 2 0 012 2v10a2 2 0 01-2 2h-2" />
                </svg>
            </div>
            <div className="glass px-4 py-3 rounded-2xl rounded-bl-sm max-w-xs">
                <div className="flex items-center gap-1 h-4">
                    <div className="w-1.5 h-1.5 rounded-full bg-surface-400 typing-dot" />
                    <div className="w-1.5 h-1.5 rounded-full bg-surface-400 typing-dot" />
                    <div className="w-1.5 h-1.5 rounded-full bg-surface-400 typing-dot" />
                </div>
            </div>
        </div>
    );
}

function StepMessage({ content }: { content: string }) {
    return (
        <div className="flex items-center gap-2 animate-fade-in py-0.5">
            <div className="flex items-center gap-1.5 text-xs text-surface-500 ml-9">
                <div className="w-3.5 h-3.5 border border-surface-600 border-t-primary-500/60 rounded-full animate-spin" />
                <span className="italic">{content}</span>
            </div>
        </div>
    );
}

function UserMessage({ message }: { message: Message }) {
    return (
        <div className="flex flex-row-reverse items-end gap-2 animate-slide-up">
            <div className="w-7 h-7 rounded-full bg-surface-700 flex items-center justify-center flex-shrink-0">
                <svg className="w-4 h-4 text-surface-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
            </div>
            <div className="max-w-lg">
                <div className="bg-primary-600 text-white px-4 py-3 rounded-2xl rounded-br-sm text-sm leading-relaxed whitespace-pre-wrap">
                    {message.content}
                </div>
                <p className="text-xs text-surface-600 mt-1 text-right">
                    {new Date(message.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </p>
            </div>
        </div>
    );
}

function AssistantMessage({ message }: { message: Message }) {
    // Very simple markdown: bold and code
    const renderContent = (text: string) => {
        const lines = text.split("\n");
        return lines.map((line, i) => {
            const parts = line.split(/(\*\*[^*]+\*\*|`[^`]+`)/g);
            return (
                <span key={i}>
                    {parts.map((part, j) => {
                        if (part.startsWith("**") && part.endsWith("**")) {
                            return <strong key={j} className="font-semibold text-surface-100">{part.slice(2, -2)}</strong>;
                        }
                        if (part.startsWith("`") && part.endsWith("`")) {
                            return <code key={j} className="bg-surface-700 px-1 rounded text-primary-300 text-xs font-mono">{part.slice(1, -1)}</code>;
                        }
                        return <span key={j}>{part}</span>;
                    })}
                    {i < lines.length - 1 && <br />}
                </span>
            );
        });
    };

    return (
        <div className="flex items-end gap-2 animate-slide-up">
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-primary-500 to-purple-600 flex items-center justify-center flex-shrink-0">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17H3a2 2 0 01-2-2V5a2 2 0 012-2h14a2 2 0 012 2v10a2 2 0 01-2 2h-2" />
                </svg>
            </div>
            <div className="max-w-lg">
                <div className="glass px-4 py-3 rounded-2xl rounded-bl-sm text-sm text-surface-200 leading-relaxed">
                    {renderContent(message.content)}
                </div>
                <p className="text-xs text-surface-600 mt-1">
                    {new Date(message.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </p>
            </div>
        </div>
    );
}

interface Props {
    messages: Message[];
    isLoading?: boolean;
    isSending?: boolean;
}

export default function MessageList({ messages, isLoading, isSending }: Props) {
    const bottomRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, isSending]);

    if (isLoading) {
        return (
            <div className="flex-1 flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    if (messages.length === 0) {
        return (
            <div className="flex-1 flex items-center justify-center" data-testid="empty-state">
                <div className="text-center">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-500/20 to-purple-600/20 border border-primary-500/20 flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                    </div>
                    <p className="text-surface-300 font-medium">Start a conversation</p>
                    <p className="text-surface-500 text-sm mt-1">Type a message to chat with the AI assistant</p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex-1 overflow-y-auto px-4 py-6 space-y-3" data-testid="message-list">
            {messages.map((message) => {
                if (message.role === "user") return <UserMessage key={message._id} message={message} />;
                if (message.role === "step") return <StepMessage key={message._id} content={message.content} />;
                return <AssistantMessage key={message._id} message={message} />;
            })}
            {isSending && <TypingIndicator />}
            <div ref={bottomRef} />
        </div>
    );
}
