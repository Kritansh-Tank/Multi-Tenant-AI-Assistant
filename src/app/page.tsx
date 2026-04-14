"use client";

import { useSession, useLogout } from "@/hooks/useAuth";
import { useProjects } from "@/hooks/useProjects";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";

export default function HomePage() {
    const router = useRouter();
    const { data: session, isLoading } = useSession();
    const { data: projects, isLoading: projectsLoading } = useProjects();
    const logoutMutation = useLogout();

    useEffect(() => {
        if (!isLoading && !session) router.push("/login");
    }, [session, isLoading, router]);

    const handleLogout = async () => {
        await logoutMutation.mutateAsync();
        router.push("/login");
    };

    if (isLoading || !session) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="min-h-screen" data-testid="home-page">
            {/* Fixed background */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 left-1/3 w-96 h-96 bg-primary-600/8 rounded-full blur-3xl" />
                <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-purple-600/8 rounded-full blur-3xl" />
            </div>

            {/* Header */}
            <header className="relative z-10 border-b border-surface-800/60 glass">
                <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-purple-600 flex items-center justify-center">
                            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17H3a2 2 0 01-2-2V5a2 2 0 012-2h14a2 2 0 012 2v10a2 2 0 01-2 2h-2" />
                            </svg>
                        </div>
                        <span className="text-xl font-bold gradient-text">Debales AI</span>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-purple-600 flex items-center justify-center text-white text-xs font-semibold">
                                {session.avatar || session.name.charAt(0)}
                            </div>
                            <div className="hidden sm:block">
                                <p className="text-sm font-medium text-surface-100">{session.name}</p>
                                <p className="text-xs text-surface-400 capitalize">{session.role}</p>
                            </div>
                        </div>
                        <button onClick={handleLogout} className="btn-secondary text-sm py-1.5 px-3">
                            Sign out
                        </button>
                    </div>
                </div>
            </header>

            <main className="relative z-10 max-w-7xl mx-auto px-6 py-12">
                <div className="mb-10">
                    <h1 className="text-3xl font-bold text-surface-100 mb-2">Your Projects</h1>
                    <p className="text-surface-400">Select a project to access its AI assistants</p>
                </div>

                {projectsLoading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {Array.from({ length: 3 }).map((_, i) => (
                            <div key={i} className="h-48 skeleton rounded-2xl" />
                        ))}
                    </div>
                ) : projects?.length === 0 ? (
                    <div className="text-center py-20">
                        <div className="w-16 h-16 rounded-2xl bg-surface-800 flex items-center justify-center mx-auto mb-4">
                            <svg className="w-8 h-8 text-surface-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                            </svg>
                        </div>
                        <p className="text-surface-400 text-lg">No projects found</p>
                        <p className="text-surface-600 text-sm mt-1">Run <code className="text-primary-400">npm run seed</code> to create sample data</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {projects?.map((project) => (
                            <Link key={project._id} href={`/${project.slug}/chat`} data-testid={`project-card-${project.slug}`}>
                                <div className="glass-card p-6 h-full cursor-pointer group animate-fade-in">
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500/20 to-purple-600/20 border border-primary-500/20 flex items-center justify-center group-hover:from-primary-500/30 group-hover:to-purple-600/30 transition-all">
                                            <svg className="w-6 h-6 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                            </svg>
                                        </div>
                                        {session.role === "admin" && (
                                            <Link
                                                href={`/${project.slug}/admin`}
                                                onClick={(e) => e.stopPropagation()}
                                                className="text-xs text-surface-400 hover:text-amber-400 flex items-center gap-1 transition-colors"
                                            >
                                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                </svg>
                                                Admin
                                            </Link>
                                        )}
                                    </div>
                                    <h2 className="text-lg font-bold text-surface-100 mb-2 group-hover:text-primary-300 transition-colors">
                                        {project.name}
                                    </h2>
                                    <p className="text-surface-400 text-sm mb-4 line-clamp-2">{project.description}</p>
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs text-surface-500">/{project.slug}</span>
                                        <span className="text-xs text-primary-400 group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
                                            Open →
                                        </span>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
}
