"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

interface Message {
  _id: string;
  conversationId: string;
  role: "user" | "assistant" | "step";
  content: string;
  metadata?: Record<string, unknown>;
  createdAt: string;
}

async function fetchMessages(
  projectSlug: string,
  instanceId: string,
  conversationId: string
): Promise<Message[]> {
  const res = await fetch(
    `/api/projects/${projectSlug}/instances/${instanceId}/conversations/${conversationId}/messages`
  );
  if (!res.ok) throw new Error("Failed to fetch messages");
  const data = await res.json();
  return data.messages || [];
}

async function sendChat(
  projectSlug: string,
  instanceId: string,
  conversationId: string,
  content: string
): Promise<Message[]> {
  const res = await fetch(
    `/api/projects/${projectSlug}/instances/${instanceId}/conversations/${conversationId}/chat`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content }),
    }
  );
  if (!res.ok) throw new Error("Failed to send message");
  const data = await res.json();
  return data.messages || [];
}

export function useMessages(
  projectSlug: string,
  instanceId: string,
  conversationId: string
) {
  return useQuery({
    queryKey: ["messages", conversationId],
    queryFn: () => fetchMessages(projectSlug, instanceId, conversationId),
    enabled: !!projectSlug && !!instanceId && !!conversationId,
  });
}

export function useSendMessage(
  projectSlug: string,
  instanceId: string,
  conversationId: string
) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (content: string) =>
      sendChat(projectSlug, instanceId, conversationId, content),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["messages", conversationId] });
    },
  });
}

export type { Message };
