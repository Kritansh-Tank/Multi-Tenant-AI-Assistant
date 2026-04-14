"use client";

import { Widget } from "@/hooks/useDashboardConfig";

// --- StatsCard ---
export function StatsCard({ widget }: { widget: Widget }) {
    const { value, change, trend, icon } = widget.config as any;
    const isUp = trend === "up";

    const icons: Record<string, JSX.Element> = {
        chat: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />,
        users: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />,
        bot: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17H3a2 2 0 01-2-2V5a2 2 0 012-2h14a2 2 0 012 2v10a2 2 0 01-2 2h-2" />,
        star: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />,
        chart: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />,
    };

    return (
        <div className="glass-card p-5" data-testid={`widget-${widget.id}`}>
            <div className="flex items-start justify-between mb-3">
                <div className="w-10 h-10 rounded-xl bg-primary-500/10 border border-primary-500/20 flex items-center justify-center">
                    <svg className="w-5 h-5 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        {icons[icon] || icons.chat}
                    </svg>
                </div>
                <span className={`text-xs font-medium flex items-center gap-1 ${isUp ? "text-emerald-400" : "text-red-400"}`}>
                    <svg className={`w-3 h-3 ${isUp ? "" : "rotate-180"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                    </svg>
                    {change}
                </span>
            </div>
            <p className="text-2xl font-bold text-surface-100">{value}</p>
            <p className="text-sm text-surface-400 mt-1">{widget.title}</p>
        </div>
    );
}

// --- ChartWidget (pure CSS bar/line simulation) ---
export function ChartWidget({ widget }: { widget: Widget }) {
    const { data, chartType, color } = widget.config as any;
    const maxVal = Math.max(...(data || []).map((d: any) => d.value), 1);

    return (
        <div className="glass-card p-5 h-full" data-testid={`widget-${widget.id}`}>
            <h3 className="text-sm font-semibold text-surface-200 mb-4">{widget.title}</h3>
            {chartType === "bar" ? (
                <div className="flex items-end justify-between gap-2 h-32">
                    {(data || []).map((d: any, i: number) => (
                        <div key={i} className="flex-1 flex flex-col items-center gap-1">
                            <div
                                className="w-full rounded-t-md transition-all duration-500"
                                style={{
                                    height: `${(d.value / maxVal) * 100}%`,
                                    background: color || "#3b82f6",
                                    opacity: 0.8,
                                    minHeight: "4px",
                                }}
                            />
                            <span className="text-xs text-surface-500 rotate-[-30deg] origin-center leading-none">{d.label}</span>
                        </div>
                    ))}
                </div>
            ) : (
                /* Line chart simulation using SVG */
                <div className="relative h-32">
                    <svg viewBox="0 0 300 100" className="w-full h-full" preserveAspectRatio="none">
                        <defs>
                            <linearGradient id={`grad-${widget.id}`} x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor={color || "#3b82f6"} stopOpacity="0.3" />
                                <stop offset="100%" stopColor={color || "#3b82f6"} stopOpacity="0" />
                            </linearGradient>
                        </defs>
                        {data && data.length > 1 && (() => {
                            const pts = data.map((d: any, i: number) => ({
                                x: (i / (data.length - 1)) * 280 + 10,
                                y: 90 - (d.value / maxVal) * 80,
                            }));
                            const linePath = pts.map((p: any, i: number) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ");
                            const areaPath = `${linePath} L ${pts[pts.length - 1].x} 95 L ${pts[0].x} 95 Z`;
                            return (
                                <>
                                    <path d={areaPath} fill={`url(#grad-${widget.id})`} />
                                    <path d={linePath} fill="none" stroke={color || "#3b82f6"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    {pts.map((p: any, i: number) => (
                                        <circle key={i} cx={p.x} cy={p.y} r="3" fill={color || "#3b82f6"} />
                                    ))}
                                </>
                            );
                        })()}
                    </svg>
                    <div className="flex justify-between mt-1">
                        {(data || []).map((d: any, i: number) => (
                            <span key={i} className="text-xs text-surface-500" style={{ flex: 1, textAlign: "center" }}>{d.label}</span>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

// --- RecentActivity ---
export function RecentActivityWidget({ widget }: { widget: Widget }) {
    const { activities } = widget.config as any;
    return (
        <div className="glass-card p-5 h-full" data-testid={`widget-${widget.id}`}>
            <h3 className="text-sm font-semibold text-surface-200 mb-4">{widget.title}</h3>
            <div className="space-y-3">
                {(activities || []).map((a: any, i: number) => (
                    <div key={i} className="flex items-start gap-3">
                        <div className="w-7 h-7 rounded-full bg-primary-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                            <span className="text-xs text-primary-400 font-semibold">{a.user.charAt(0)}</span>
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm text-surface-300 leading-snug">
                                <span className="font-medium text-surface-100">{a.user}</span>{" "}
                                {a.action}{" "}
                                <span className="text-primary-400">{a.target}</span>
                            </p>
                            <p className="text-xs text-surface-600 mt-0.5">{a.time}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

// --- ListWidget ---
const badgeColors: Record<string, string> = {
    trending: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
    up: "bg-blue-500/20 text-blue-400 border-blue-500/30",
    down: "bg-red-500/20 text-red-400 border-red-500/30",
    stable: "bg-surface-700/60 text-surface-400 border-surface-600/30",
};

export function ListWidget({ widget }: { widget: Widget }) {
    const { items } = widget.config as any;
    return (
        <div className="glass-card p-5 h-full" data-testid={`widget-${widget.id}`}>
            <h3 className="text-sm font-semibold text-surface-200 mb-4">{widget.title}</h3>
            <div className="space-y-2.5">
                {(items || []).map((item: any, i: number) => (
                    <div key={i} className="flex items-center justify-between py-1 border-b border-surface-800/60 last:border-0">
                        <div className="flex items-center gap-2">
                            <span className="text-xs text-surface-500 w-4 text-right">{i + 1}</span>
                            <span className="text-sm text-surface-300">{item.label}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-sm font-semibold text-surface-100">{item.value}</span>
                            <span className={`text-xs px-1.5 py-0.5 rounded-full border ${badgeColors[item.badge] || badgeColors.stable}`}>
                                {item.badge}
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

// --- MetricBar ---
export function MetricBarWidget({ widget }: { widget: Widget }) {
    const { metrics } = widget.config as any;
    return (
        <div className="glass-card p-5 h-full" data-testid={`widget-${widget.id}`}>
            <h3 className="text-sm font-semibold text-surface-200 mb-4">{widget.title}</h3>
            <div className="space-y-4">
                {(metrics || []).map((m: any, i: number) => (
                    <div key={i}>
                        <div className="flex justify-between mb-1.5">
                            <span className="text-sm text-surface-400">{m.label}</span>
                            <span className="text-sm font-semibold text-surface-100">{m.value}{m.unit}</span>
                        </div>
                        <div className="w-full bg-surface-800 rounded-full h-2">
                            <div
                                className="h-2 rounded-full transition-all duration-700"
                                style={{
                                    width: `${(m.value / m.max) * 100}%`,
                                    background: m.color || "#3b82f6",
                                }}
                            />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
