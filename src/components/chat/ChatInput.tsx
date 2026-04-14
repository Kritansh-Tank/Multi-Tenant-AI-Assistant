"use client";

import { useState, useRef } from "react";

interface Props {
    onSend: (content: string) => void;
    disabled?: boolean;
}

export default function ChatInput({ onSend, disabled }: Props) {
    const [value, setValue] = useState("");
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const handleSubmit = (e?: React.FormEvent) => {
        e?.preventDefault();
        const trimmed = value.trim();
        if (!trimmed || disabled) return;
        onSend(trimmed);
        setValue("");
        if (textareaRef.current) {
            textareaRef.current.style.height = "auto";
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSubmit();
        }
    };

    const handleInput = () => {
        if (textareaRef.current) {
            textareaRef.current.style.height = "auto";
            textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 160)}px`;
        }
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="p-4 border-t border-surface-800/60"
            data-testid="chat-input-form"
        >
            <div className="flex items-end gap-3 glass rounded-xl px-4 py-3">
                <textarea
                    ref={textareaRef}
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                    onInput={handleInput}
                    placeholder="Type a message… (Enter to send, Shift+Enter for newline)"
                    disabled={disabled}
                    rows={1}
                    className="flex-1 bg-transparent text-surface-100 placeholder:text-surface-500 resize-none outline-none text-sm leading-relaxed min-h-[24px] max-h-40 scrollbar-thin"
                    data-testid="chat-input"
                />
                <button
                    type="submit"
                    disabled={!value.trim() || disabled}
                    className="w-9 h-9 rounded-lg bg-primary-600 flex items-center justify-center flex-shrink-0 transition-all hover:bg-primary-500 disabled:opacity-40 disabled:cursor-not-allowed active:scale-95"
                    data-testid="chat-send-btn"
                >
                    {disabled ? (
                        <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                    ) : (
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                        </svg>
                    )}
                </button>
            </div>
            <p className="text-xs text-surface-600 text-center mt-2">
                AI responses are generated. Integration data may be mocked.
            </p>
        </form>
    );
}
