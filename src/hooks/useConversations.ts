"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

interface Conversation {
  _id: string;
  projectId: string;
  productInstanceId: string;
  userId: string;
  title: string;
  createdAt: string;
  updatedAt: string;
}

async function fetchConversations(
  projectSlug: string,
  instanceId: string
): Promise<Conversation[]> {
  const res = await fetch(
    `/api/projects/${projectSlug}/instances/${instanceId}/conversations`
  );
  if (!res.ok) throw new Error("Failed to fetch conversations");
  const data = await res.json();
  return data.conversations || [];
}

async function createConversation(
  projectSlug: string,
  instanceId: string,
  title?: string
): Promise<Conversation> {
  const res = await fetch(
    `/api/projects/${projectSlug}/instances/${instanceId}/conversations`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title }),
    }
  );
  if (!res.ok) throw new Error("Failed to create conversation");
  const data = await res.json();
  return data.conversation;
}

export function useConversations(projectSlug: string, instanceId: string) {
  return useQuery({
    queryKey: ["conversations", projectSlug, instanceId],
    queryFn: () => fetchConversations(projectSlug, instanceId),
    enabled: !!projectSlug && !!instanceId,
  });
}

export function useCreateConversation(projectSlug: string, instanceId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (title?: string) => createConversation(projectSlug, instanceId, title),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["conversations", projectSlug, instanceId],
      });
    },
  });
}

export type { Conversation };
