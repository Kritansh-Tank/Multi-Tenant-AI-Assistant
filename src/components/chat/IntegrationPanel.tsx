"use client";

import { useIntegrations, useToggleIntegration } from "@/hooks/useIntegrations";

interface Props {
    projectSlug: string;
    instanceId: string;
}

export default function IntegrationPanel({ projectSlug, instanceId }: Props) {
    const { data: integrations, isLoading } = useIntegrations(projectSlug, instanceId);
    const toggleMutation = useToggleIntegration(projectSlug, instanceId);

    if (isLoading) {
        return (
            <div className="p-3 border-b border-surface-800/60 space-y-2">
                <div className="h-4 skeleton rounded w-24" />
                <div className="h-8 skeleton rounded" />
                <div className="h-8 skeleton rounded" />
            </div>
        );
    }

    if (!integrations || integrations.length === 0) return null;

    return (
        <div className="p-3 border-b border-surface-800/60" data-testid="integration-panel">
            <p className="text-xs text-surface-500 uppercase tracking-wider mb-2">Integrations</p>
            <div className="space-y-2">
                {integrations.map((integration) => {
                    const isShopify = integration.type === "shopify";
                    return (
                        <div
                            key={integration._id}
                            className={`flex items-center justify-between px-3 py-2 rounded-lg border transition-all ${integration.enabled
                                    ? "bg-surface-800/60 border-surface-700/60"
                                    : "bg-surface-900/40 border-surface-800/40"
                                }`}
                            data-testid={`integration-${integration.type}`}
                        >
                            <div className="flex items-center gap-2">
                                <div className={`w-6 h-6 rounded flex items-center justify-center text-xs ${isShopify ? "bg-green-500/20 text-green-400" : "bg-blue-500/20 text-blue-400"
                                    }`}>
                                    {isShopify ? "🛒" : "👥"}
                                </div>
                                <span className="text-xs font-medium text-surface-300 capitalize">
                                    {integration.type}
                                </span>
                            </div>
                            <button
                                onClick={() => toggleMutation.mutate({ type: integration.type, enabled: !integration.enabled })}
                                disabled={toggleMutation.isPending}
                                className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors focus:outline-none ${integration.enabled ? "bg-primary-600" : "bg-surface-700"
                                    }`}
                                data-testid={`toggle-${integration.type}`}
                            >
                                <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${integration.enabled ? "translate-x-4" : "translate-x-1"
                                    }`} />
                            </button>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
