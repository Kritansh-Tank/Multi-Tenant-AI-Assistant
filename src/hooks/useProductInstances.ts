"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

interface ProductInstance {
  _id: string;
  projectId: string;
  name: string;
  productType: "sales-assistant" | "support-bot";
  description: string;
  integrations: { shopify: boolean; crm: boolean };
  createdAt: string;
}

async function fetchInstances(projectSlug: string): Promise<ProductInstance[]> {
  const res = await fetch(`/api/projects/${projectSlug}/instances`);
  if (!res.ok) throw new Error("Failed to fetch instances");
  const data = await res.json();
  return data.instances || [];
}

export function useProductInstances(projectSlug: string) {
  return useQuery({
    queryKey: ["instances", projectSlug],
    queryFn: () => fetchInstances(projectSlug),
    enabled: !!projectSlug,
  });
}

export type { ProductInstance };
