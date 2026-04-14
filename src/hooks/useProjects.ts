"use client";

import { useQuery } from "@tanstack/react-query";

interface Project {
  _id: string;
  name: string;
  slug: string;
  description: string;
  createdAt: string;
}

async function fetchProjects(): Promise<Project[]> {
  const res = await fetch("/api/projects");
  if (!res.ok) throw new Error("Failed to fetch projects");
  const data = await res.json();
  return data.projects || [];
}

async function fetchProject(slug: string): Promise<Project> {
  const res = await fetch(`/api/projects/${slug}`);
  if (!res.ok) throw new Error("Failed to fetch project");
  const data = await res.json();
  return data.project;
}

export function useProjects() {
  return useQuery({
    queryKey: ["projects"],
    queryFn: fetchProjects,
  });
}

export function useProject(slug: string) {
  return useQuery({
    queryKey: ["projects", slug],
    queryFn: () => fetchProject(slug),
    enabled: !!slug,
  });
}

export type { Project };
