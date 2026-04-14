"use client";

import { useParams, useRouter } from "next/navigation";
import { useDashboardConfig } from "@/hooks/useDashboardConfig";
import { useSession } from "@/hooks/useAuth";
import { useEffect } from "react";
import DashboardRenderer from "@/components/admin/DashboardRenderer";

export default function AdminDashboardPage() {
    const params = useParams();
    const projectSlug = params.projectSlug as string;
    const router = useRouter();

    const { data: session, isLoading: sessionLoading } = useSession();
    const { data: config, isLoading, error } = useDashboardConfig(projectSlug);

    // Only admins can view this page
    useEffect(() => {
        if (!sessionLoading && session && session.role !== "admin") {
            router.replace(`/${projectSlug}/chat`);
        }
        if (!sessionLoading && !session) {
            router.replace("/login");
        }
    }, [session, sessionLoading, router, projectSlug]);

    if (sessionLoading || isLoading) {
        return (
            <div className="h-full flex items-center justify-center">
                <div className="text-center">
                    <div className="w-10 h-10 border-2 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                    <p className="text-surface-400 text-sm">Loading dashboard...</p>
                </div>
            </div>
        );
    }

    if (error) {
        const isForbidden = error.message === "FORBIDDEN";
        return (
            <div className="h-full flex items-center justify-center" data-testid="admin-error">
                <div className="text-center">
                    <div className="w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                    </div>
                    <p className="text-surface-200 font-semibold">{isForbidden ? "Access Denied" : "Failed to load dashboard"}</p>
                    <p className="text-surface-500 text-sm mt-1">
                        {isForbidden
                            ? "You need admin access to view this dashboard."
                            : "Could not load the dashboard configuration from MongoDB."}
                    </p>
                </div>
            </div>
        );
    }

    if (!config) return null;

    return (
        <div className="h-full overflow-y-auto" data-testid="admin-dashboard">
            {/* Header */}
            <div className="sticky top-0 z-10 glass border-b border-surface-800/60 px-6 py-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-lg font-bold text-surface-100">Admin Dashboard</h1>
                        <p className="text-xs text-surface-500">
                            Config-driven UI — edit the <code className="text-primary-400">dashboardconfigs</code> MongoDB document to change this view
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                        <span className="text-xs text-surface-400">Live from MongoDB</span>
                    </div>
                </div>

                {/* Welcome banner from config */}
                {config.theme.showWelcomeBanner && (
                    <div
                        className="mt-3 px-4 py-2.5 rounded-xl text-sm font-medium text-white"
                        style={{ background: `linear-gradient(135deg, ${config.theme.accentColor}30, ${config.theme.accentColor}15)`, border: `1px solid ${config.theme.accentColor}30` }}
                        data-testid="welcome-banner"
                    >
                        {config.theme.welcomeMessage}
                    </div>
                )}
            </div>

            {/* Config-driven content */}
            <div className="p-6">
                <DashboardRenderer sections={config.sections} />
            </div>
        </div>
    );
}
