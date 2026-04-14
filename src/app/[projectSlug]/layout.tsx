"use client";

import { useSession, useLogout } from "@/hooks/useAuth";
import { useProductInstances } from "@/hooks/useProductInstances";
import { useRouter, usePathname, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function ProjectLayout({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const pathname = usePathname();
    const params = useParams();
    const projectSlug = params.projectSlug as string;

    const { data: session, isLoading } = useSession();
    const { data: instances, isLoading: instancesLoading } = useProductInstances(projectSlug);
    const logoutMutation = useLogout();
    const [sidebarOpen, setSidebarOpen] = useState(true);

    useEffect(() => {
        if (!isLoading && !session) router.push("/login");
    }, [session, isLoading, router]);

    if (isLoading || !session) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    const isAdmin = session.role === "admin";
    const isAdminRoute = pathname?.includes("/admin");

    return (
        <div className="flex h-screen overflow-hidden" data-testid="project-layout">
            {/* Sidebar */}
            <aside
                className={`${sidebarOpen ? "w-64" : "w-16"} flex-shrink-0 flex flex-col border-r border-surface-800/60 bg-surface-900/80 backdrop-blur-md transition-all duration-300 z-20`}
                data-testid="sidebar"
            >
                {/* Logo + toggle */}
                <div className="flex items-center justify-between p-4 border-b border-surface-800/60">
                    {sidebarOpen && (
                        <Link href="/" className="flex items-center gap-2 group">
                            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-primary-500 to-purple-600 flex items-center justify-center flex-shrink-0">
                                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17H3a2 2 0 01-2-2V5a2 2 0 012-2h14a2 2 0 012 2v10a2 2 0 01-2 2h-2" />
                                </svg>
                            </div>
                            <span className="font-bold text-sm gradient-text truncate">Debales AI</span>
                        </Link>
                    )}
                    <button
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                        className="p-1.5 rounded-lg text-surface-400 hover:text-surface-100 hover:bg-surface-800 transition-all"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={sidebarOpen ? "M11 19l-7-7 7-7m8 14l-7-7 7-7" : "M13 5l7 7-7 7M5 5l7 7-7 7"} />
                        </svg>
                    </button>
                </div>

                {/* Project slug badge */}
                {sidebarOpen && (
                    <div className="px-4 py-3 border-b border-surface-800/60">
                        <p className="text-xs text-surface-500 uppercase tracking-wider mb-1">Project</p>
                        <p className="text-sm font-semibold text-surface-200 truncate">{projectSlug}</p>
                    </div>
                )}

                {/* Nav */}
                <nav className="flex-1 overflow-y-auto p-3 space-y-1">
                    {sidebarOpen && (
                        <p className="text-xs text-surface-600 uppercase tracking-wider px-2 mb-2">Assistants</p>
                    )}
                    {instancesLoading ? (
                        Array.from({ length: 2 }).map((_, i) => (
                            <div key={i} className="h-10 skeleton rounded-lg" />
                        ))
                    ) : (
                        instances?.map((instance) => {
                            const isActive = pathname?.includes(instance._id);
                            return (
                                <Link
                                    key={instance._id}
                                    href={`/${projectSlug}/chat/${instance._id}`}
                                    className={`sidebar-item ${isActive ? "active" : ""}`}
                                    title={instance.name}
                                    data-testid={`nav-instance-${instance._id}`}
                                >
                                    <div className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 ${instance.productType === "sales-assistant"
                                            ? "bg-green-500/20 text-green-400"
                                            : "bg-blue-500/20 text-blue-400"
                                        }`}>
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            {instance.productType === "sales-assistant" ? (
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                            ) : (
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                                            )}
                                        </svg>
                                    </div>
                                    {sidebarOpen && (
                                        <span className="truncate text-sm">{instance.name}</span>
                                    )}
                                </Link>
                            );
                        })
                    )}

                    {/* Admin link */}
                    {isAdmin && sidebarOpen && (
                        <>
                            <div className="my-3 border-t border-surface-800/60" />
                            <p className="text-xs text-surface-600 uppercase tracking-wider px-2 mb-2">Admin</p>
                            <Link
                                href={`/${projectSlug}/admin`}
                                className={`sidebar-item ${isAdminRoute ? "active" : ""}`}
                                data-testid="nav-admin"
                            >
                                <div className="w-7 h-7 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center flex-shrink-0">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                    </svg>
                                </div>
                                <span className="truncate text-sm">Dashboard</span>
                            </Link>
                        </>
                    )}
                </nav>

                {/* User info + logout */}
                <div className="p-3 border-t border-surface-800/60">
                    {sidebarOpen ? (
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-purple-600 flex items-center justify-center text-white text-xs font-semibold flex-shrink-0">
                                {session.avatar || session.name.charAt(0)}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-xs font-medium text-surface-200 truncate">{session.name}</p>
                                <p className="text-xs text-surface-500 capitalize">{session.role}</p>
                            </div>
                            <button
                                onClick={async () => {
                                    await logoutMutation.mutateAsync();
                                    router.push("/login");
                                }}
                                className="p-1.5 rounded-lg text-surface-500 hover:text-red-400 hover:bg-red-500/10 transition-all"
                                title="Sign out"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                </svg>
                            </button>
                        </div>
                    ) : (
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-purple-600 flex items-center justify-center text-white text-xs font-semibold mx-auto">
                            {session.avatar || session.name.charAt(0)}
                        </div>
                    )}
                </div>
            </aside>

            {/* Main content */}
            <main className="flex-1 overflow-hidden bg-surface-950">{children}</main>
        </div>
    );
}
