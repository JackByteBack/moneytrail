"use client";

import { TrendingUp, TrendingDown, Repeat, Target, AlertTriangle, type LucideIcon } from "lucide-react";

interface InsightsContentProps {
  currentTotal: number;
  prevTotal: number;
  currentByCategory: Record<string, number>;
  prevByCategory: Record<string, number>;
  topCategory: [string, number] | undefined;
  recurringCount: number;
  recurringTotal: number;
}

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function InsightsContent({
  currentTotal,
  prevTotal,
  currentByCategory,
  prevByCategory,
  topCategory,
  recurringCount,
  recurringTotal,
}: InsightsContentProps) {
  const percentChange = prevTotal
    ? ((currentTotal - prevTotal) / prevTotal) * 100
    : 0;

  const insights: { icon: LucideIcon; title: string; description: string; type: "positive" | "negative" | "neutral" }[] = [];

  if (prevTotal > 0) {
    if (percentChange > 0) {
      insights.push({
        icon: TrendingUp,
        title: `You spent ${Math.abs(percentChange).toFixed(0)}% more than last month`,
        description: `This month: ${formatCurrency(currentTotal)} vs last month: ${formatCurrency(prevTotal)}`,
        type: "negative",
      });
    } else if (percentChange < 0) {
      insights.push({
        icon: TrendingDown,
        title: `You saved ${Math.abs(percentChange).toFixed(0)}% compared to last month`,
        description: `This month: ${formatCurrency(currentTotal)} vs last month: ${formatCurrency(prevTotal)}`,
        type: "positive",
      });
    }
  }

  if (topCategory) {
    insights.push({
      icon: Target,
      title: `Your top spending category is ${topCategory[0]}`,
      description: `You spent ${formatCurrency(topCategory[1])} on ${topCategory[0]} this month`,
      type: "neutral",
    });
  }

  const categoriesWithChange = Object.keys(currentByCategory).map((cat) => {
    const current = currentByCategory[cat] || 0;
    const prev = prevByCategory[cat] || 0;
    if (prev > 0) {
      const change = ((current - prev) / prev) * 100;
      return { cat, change, current, prev };
    }
    return null;
  }).filter(Boolean);

  const biggestIncrease = categoriesWithChange.sort(
    (a, b) => (b?.change || 0) - (a?.change || 0)
  )[0];

  if (biggestIncrease && biggestIncrease.change > 10) {
    insights.push({
      icon: AlertTriangle,
      title: `${biggestIncrease.cat} spending increased by ${biggestIncrease.change.toFixed(0)}%`,
      description: `From ${formatCurrency(biggestIncrease.prev)} to ${formatCurrency(biggestIncrease.current)}`,
      type: "negative",
    });
  }

  if (recurringCount > 0) {
    insights.push({
      icon: Repeat,
      title: `You have ${recurringCount} recurring subscription${recurringCount > 1 ? "s" : ""}`,
      description: `Total monthly cost: ${formatCurrency(recurringTotal)}`,
      type: "neutral",
    });
  }

  return (
    <div className="space-y-4">
      <h1 className="font-display text-display-sm text-ink">Insights</h1>

      {/* Monthly Summary */}
      <div className="bg-canvas rounded-xl p-5 shadow-[0_0_0_1px_rgba(14,15,12,0.12)]">
        <h2 className="font-display text-display-xs text-ink mb-4">This Month</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-body-sm text-muted">Total Spent</p>
            <p className="font-display text-display-sm text-ink">
              {formatCurrency(currentTotal)}
            </p>
          </div>
          <div>
            <p className="text-body-sm text-muted">vs Last Month</p>
            <p
              className={`font-display text-display-sm ${
                percentChange > 0 ? "text-negative" : "text-positive"
              }`}
            >
              {percentChange > 0 ? "+" : ""}
              {percentChange.toFixed(1)}%
            </p>
          </div>
        </div>
      </div>

      {/* Insights Cards */}
      <div className="space-y-3">
        {insights.length > 0 ? (
          insights.map((insight, i) => (
            <div
              key={i}
              className={`bg-canvas rounded-xl p-5 shadow-[0_0_0_1px_rgba(14,15,12,0.12)] ${
                insight.type === "positive"
                  ? "border-l-4 border-positive"
                  : insight.type === "negative"
                  ? "border-l-4 border-negative"
                  : ""
              }`}
            >
              <div className="flex items-start gap-3">
                <div
                  className={`p-2 rounded-lg ${
                    insight.type === "positive"
                      ? "bg-positive/10 text-positive"
                      : insight.type === "negative"
                      ? "bg-negative/10 text-negative"
                      : "bg-primary-pale text-ink-deep"
                  }`}
                >
                  <insight.icon className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-body-sm-strong text-ink">{insight.title}</p>
                  <p className="text-caption text-muted mt-0.5">{insight.description}</p>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="bg-canvas rounded-xl p-8 text-center shadow-[0_0_0_1px_rgba(14,15,12,0.12)]">
            <p className="text-body-sm text-muted">
              Add more transactions to see insights
            </p>
          </div>
        )}
      </div>

      {/* Category Breakdown */}
      {Object.keys(currentByCategory).length > 0 && (
        <div className="bg-canvas rounded-xl p-5 shadow-[0_0_0_1px_rgba(14,15,12,0.12)]">
          <h2 className="font-display text-display-xs text-ink mb-4">
            Category Breakdown
          </h2>
          <div className="space-y-3">
            {Object.entries(currentByCategory)
              .sort(([, a], [, b]) => b - a)
              .map(([cat, amount]) => {
                const prevAmount = prevByCategory[cat] || 0;
                const change = prevAmount
                  ? ((amount - prevAmount) / prevAmount) * 100
                  : null;

                return (
                  <div key={cat} className="flex items-center justify-between">
                    <span className="text-body-sm text-ink">{cat}</span>
                    <div className="flex items-center gap-3">
                      <span className="text-body-sm-strong text-ink">
                        {formatCurrency(amount)}
                      </span>
                      {change !== null && (
                        <span
                          className={`text-caption ${
                            change > 0 ? "text-negative" : "text-positive"
                          }`}
                        >
                          {change > 0 ? "+" : ""}
                          {change.toFixed(0)}%
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      )}
    </div>
  );
}
