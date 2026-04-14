"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

interface Integration {
  _id: string;
  productInstanceId: string;
  type: "shopify" | "crm";
  enabled: boolean;
  mockData: Record<string, any>;
}

async function fetchIntegrations(
  projectSlug: string,
  instanceId: string
): Promise<Integration[]> {
  const res = await fetch(
    `/api/projects/${projectSlug}/instances/${instanceId}/integrations`
  );
  if (!res.ok) throw new Error("Failed to fetch integrations");
  const data = await res.json();
  return data.integrations || [];
}

async function toggleIntegration(
  projectSlug: string,
  instanceId: string,
  type: string,
  enabled: boolean
): Promise<Integration> {
  const res = await fetch(
    `/api/projects/${projectSlug}/instances/${instanceId}/integrations/${type}`,
    {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ enabled }),
    }
  );
  if (!res.ok) throw new Error("Failed to toggle integration");
  const data = await res.json();
  return data.integration;
}

export function useIntegrations(projectSlug: string, instanceId: string) {
  return useQuery({
    queryKey: ["integrations", projectSlug, instanceId],
    queryFn: () => fetchIntegrations(projectSlug, instanceId),
    enabled: !!projectSlug && !!instanceId,
  });
}

export function useToggleIntegration(projectSlug: string, instanceId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ type, enabled }: { type: string; enabled: boolean }) =>
      toggleIntegration(projectSlug, instanceId, type, enabled),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["integrations", projectSlug, instanceId],
      });
    },
  });
}

export type { Integration };
