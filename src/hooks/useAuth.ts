"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

interface User {
  _id: string;
  name: string;
  email: string;
  role: "admin" | "member";
  avatar?: string;
  projectIds: string[];
}

async function fetchSession(): Promise<User | null> {
  const res = await fetch("/api/auth/session");
  const data = await res.json();
  return data.user || null;
}

async function fetchAllUsers(): Promise<User[]> {
  const res = await fetch("/api/users");
  const data = await res.json();
  return data.users || [];
}

async function loginAs(userId: string): Promise<User> {
  const res = await fetch("/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId }),
  });
  if (!res.ok) throw new Error("Login failed");
  const data = await res.json();
  return data.user;
}

async function logout(): Promise<void> {
  await fetch("/api/auth/logout", { method: "POST" });
}

export function useSession() {
  return useQuery({
    queryKey: ["session"],
    queryFn: fetchSession,
  });
}

export function useAllUsers() {
  return useQuery({
    queryKey: ["users"],
    queryFn: fetchAllUsers,
  });
}

export function useLogin() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: loginAs,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["session"] });
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
  });
}

export function useLogout() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: logout,
    onSuccess: () => {
      queryClient.clear();
    },
  });
}

export type { User };
