"use client";

import { useQuery } from "@tanstack/react-query";

interface Widget {
  id: string;
  type: "stats-card" | "chart" | "recent-activity" | "list" | "metric-bar";
  title: string;
  order: number;
  config: Record<string, any>;
}

interface Section {
  id: string;
  title: string;
  order: number;
  columns: number;
  widgets: Widget[];
}

interface DashboardConfig {
  _id: string;
  projectId: string;
  sections: Section[];
  theme: {
    accentColor: string;
    showWelcomeBanner: boolean;
    welcomeMessage: string;
  };
}

async function fetchDashboardConfig(projectSlug: string): Promise<DashboardConfig> {
  const res = await fetch(`/api/projects/${projectSlug}/admin/dashboard-config`);
  if (!res.ok) {
    if (res.status === 403) throw new Error("FORBIDDEN");
    throw new Error("Failed to fetch dashboard config");
  }
  const data = await res.json();
  return data.config;
}

export function useDashboardConfig(projectSlug: string) {
  return useQuery({
    queryKey: ["dashboard-config", projectSlug],
    queryFn: () => fetchDashboardConfig(projectSlug),
    enabled: !!projectSlug,
    retry: false,
  });
}

export type { DashboardConfig, Section, Widget };
