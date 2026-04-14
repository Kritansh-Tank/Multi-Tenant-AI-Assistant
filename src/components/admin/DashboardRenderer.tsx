"use client";

import { Section, Widget } from "@/hooks/useDashboardConfig";
import { StatsCard, ChartWidget, RecentActivityWidget, ListWidget, MetricBarWidget } from "./Widgets";

function renderWidget(widget: Widget) {
    switch (widget.type) {
        case "stats-card": return <StatsCard widget={widget} />;
        case "chart": return <ChartWidget widget={widget} />;
        case "recent-activity": return <RecentActivityWidget widget={widget} />;
        case "list": return <ListWidget widget={widget} />;
        case "metric-bar": return <MetricBarWidget widget={widget} />;
        default: return null;
    }
}

function colsClass(n: number) {
    const map: Record<number, string> = { 1: "grid-cols-1", 2: "grid-cols-2", 3: "grid-cols-3", 4: "grid-cols-4" };
    return map[n] || "grid-cols-2";
}

interface Props {
    sections: Section[];
}

export default function DashboardRenderer({ sections }: Props) {
    const sorted = [...sections].sort((a, b) => a.order - b.order);

    return (
        <div className="space-y-8" data-testid="dashboard-renderer">
            {sorted.map((section) => (
                <section key={section.id} data-testid={`section-${section.id}`}>
                    <h2 className="text-base font-semibold text-surface-300 mb-4 uppercase tracking-wider text-xs">
                        {section.title}
                    </h2>
                    <div className={`grid ${colsClass(section.columns)} gap-4`}>
                        {[...section.widgets]
                            .sort((a, b) => a.order - b.order)
                            .map((widget) => (
                                <div key={widget.id}>
                                    {renderWidget(widget)}
                                </div>
                            ))}
                    </div>
                </section>
            ))}
        </div>
    );
}
