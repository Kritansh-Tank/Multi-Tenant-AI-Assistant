"use client";

import { useRouter } from "next/navigation";
import { useSession, useLogin, useAllUsers, User } from "@/hooks/useAuth";
import { useEffect } from "react";

function UserCard({ user, onSelect, loading }: { user: User; onSelect: () => void; loading: boolean }) {
    return (
        <button
            onClick={onSelect}
            disabled={loading}
            data-testid={`user-card-${user._id}`}
            className="w-full p-4 glass-card text-left hover:border-primary-500/50 transition-all duration-200 group disabled:opacity-50"
        >
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-purple-600 flex items-center justify-center text-white font-semibold text-sm flex-shrink-0">
                    {user.avatar || user.name.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                        <p className="font-semibold text-surface-100 truncate">{user.name}</p>
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${user.role === "admin"
                                ? "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                                : "bg-primary-500/20 text-primary-400 border border-primary-500/30"
                            }`}>
                            {user.role}
                        </span>
                    </div>
                    <p className="text-sm text-surface-400 truncate">{user.email}</p>
                </div>
                <svg className="w-5 h-5 text-surface-600 group-hover:text-primary-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
            </div>
        </button>
    );
}

export default function LoginPage() {
    const router = useRouter();
    const { data: session, isLoading: sessionLoading } = useSession();
    const { data: users, isLoading: usersLoading } = useAllUsers();
    const loginMutation = useLogin();

    useEffect(() => {
        if (session) router.push("/");
    }, [session, router]);

    const handleLogin = async (userId: string) => {
        try {
            await loginMutation.mutateAsync(userId);
            router.push("/");
        } catch (e) {
            console.error(e);
        }
    };

    if (sessionLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center p-4" data-testid="login-page">
            {/* Background effect */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-600/10 rounded-full blur-3xl" />
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl" />
            </div>

            <div className="w-full max-w-md relative">
                {/* Logo */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center gap-2 mb-4">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-purple-600 flex items-center justify-center">
                            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17H3a2 2 0 01-2-2V5a2 2 0 012-2h14a2 2 0 012 2v10a2 2 0 01-2 2h-2" />
                            </svg>
                        </div>
                        <span className="text-2xl font-bold gradient-text">Debales AI</span>
                    </div>
                    <h1 className="text-xl font-semibold text-surface-100">Select your account</h1>
                    <p className="text-surface-400 text-sm mt-1">Choose a user to continue to the platform</p>
                </div>

                {/* User list */}
                <div className="glass rounded-2xl p-2 space-y-2" data-testid="user-list">
                    {usersLoading ? (
                        Array.from({ length: 3 }).map((_, i) => (
                            <div key={i} className="h-16 skeleton rounded-xl" />
                        ))
                    ) : users?.length === 0 ? (
                        <div className="p-6 text-center text-surface-400">
                            <p>No users found. Please run the seed script.</p>
                            <code className="text-xs text-primary-400 mt-2 block">npm run seed</code>
                        </div>
                    ) : (
                        users?.map((user) => (
                            <UserCard
                                key={user._id}
                                user={user}
                                onSelect={() => handleLogin(user._id)}
                                loading={loginMutation.isPending}
                            />
                        ))
                    )}
                </div>

                {loginMutation.isPending && (
                    <div className="mt-4 flex items-center justify-center gap-2 text-surface-400 text-sm">
                        <div className="w-4 h-4 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
                        Signing in...
                    </div>
                )}

                <p className="text-center text-xs text-surface-600 mt-6">
                    Demo application — select any user to log in
                </p>
            </div>
        </div>
    );
}
