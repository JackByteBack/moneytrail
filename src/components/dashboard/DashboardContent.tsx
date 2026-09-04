"use client";

import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";
import { Transaction, Budget } from "@/types/database";
import { ArrowUpRight, ArrowDownRight, TrendingUp, PiggyBank } from "lucide-react";

interface DashboardContentProps {
  totalSpend: number;
  totalIncome: number;
  categoryBreakdown: { name: string; value: number; color: string; icon: string }[];
  monthlyTrend: { month: string; total: number }[];
  recentTransactions: Transaction[];
  budgets: Budget[];
}

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function DashboardContent({
  totalSpend,
  totalIncome,
  categoryBreakdown,
  monthlyTrend,
  recentTransactions,
  budgets,
}: DashboardContentProps) {
  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-canvas rounded-xl p-5 shadow-[0_0_0_1px_rgba(14,15,12,0.12)]">
          <div className="flex items-center gap-2 text-muted text-body-sm mb-2">
            <ArrowDownRight className="w-4 h-4" />
            Total Spent
          </div>
          <div className="font-display text-display-sm text-ink">
            {formatCurrency(totalSpend)}
          </div>
        </div>

        <div className="bg-canvas rounded-xl p-5 shadow-[0_0_0_1px_rgba(14,15,12,0.12)]">
          <div className="flex items-center gap-2 text-muted text-body-sm mb-2">
            <ArrowUpRight className="w-4 h-4" />
            Total Income
          </div>
          <div className="font-display text-display-sm text-positive">
            {formatCurrency(totalIncome)}
          </div>
        </div>
      </div>

      {/* Category Breakdown */}
      <div className="bg-canvas rounded-xl p-5 shadow-[0_0_0_1px_rgba(14,15,12,0.12)]">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="w-5 h-5 text-muted" />
          <h2 className="font-display text-display-xs text-ink">Spending by Category</h2>
        </div>

        {categoryBreakdown.length > 0 ? (
          <div className="flex items-center gap-6">
            <div className="w-40 h-40">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryBreakdown}
                    cx="50%"
                    cy="50%"
                    innerRadius={45}
                    outerRadius={70}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {categoryBreakdown.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value) => formatCurrency(Number(value))}
                    contentStyle={{
                      borderRadius: "12px",
                      border: "none",
                      boxShadow: "0 0 0 1px rgba(14,15,12,0.12)",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="flex-1 space-y-2">
              {categoryBreakdown.map((cat) => (
                <div key={cat.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: cat.color }}
                    />
                    <span className="text-body-sm text-ink">
                      {cat.icon} {cat.name}
                    </span>
                  </div>
                  <span className="text-body-sm-strong text-ink">
                    {formatCurrency(cat.value)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <p className="text-body-sm text-muted text-center py-8">
            No expenses this month yet
          </p>
        )}
      </div>

      {/* Monthly Trend */}
      <div className="bg-canvas rounded-xl p-5 shadow-[0_0_0_1px_rgba(14,15,12,0.12)]">
        <h2 className="font-display text-display-xs text-ink mb-4">6-Month Trend</h2>
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={monthlyTrend}>
              <XAxis
                dataKey="month"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#868685", fontSize: 12 }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#868685", fontSize: 12 }}
                tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`}
              />
              <Tooltip
                formatter={(value) => formatCurrency(Number(value))}
                contentStyle={{
                  borderRadius: "12px",
                  border: "none",
                  boxShadow: "0 0 0 1px rgba(14,15,12,0.12)",
                }}
              />
              <Line
                type="monotone"
                dataKey="total"
                stroke="#9fe870"
                strokeWidth={3}
                dot={{ fill: "#9fe870", strokeWidth: 0 }}
                activeDot={{ r: 6, fill: "#9fe870" }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Budget Progress */}
      {budgets.length > 0 && (
        <div className="bg-canvas rounded-xl p-5 shadow-[0_0_0_1px_rgba(14,15,12,0.12)]">
          <div className="flex items-center gap-2 mb-4">
            <PiggyBank className="w-5 h-5 text-muted" />
            <h2 className="font-display text-display-xs text-ink">Budget Progress</h2>
          </div>

          <div className="space-y-4">
            {budgets.map((budget) => {
              const spent =
                categoryBreakdown.find((c) => c.name === budget.category?.name)?.value || 0;
              const percent = Math.min((spent / Number(budget.monthly_limit)) * 100, 100);
              const color =
                percent >= 90 ? "#d03238" : percent >= 70 ? "#ffd11a" : "#9fe870";

              return (
                <div key={budget.id}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-body-sm text-ink">
                      {budget.category?.icon} {budget.category?.name}
                    </span>
                    <span className="text-caption text-muted">
                      {formatCurrency(spent)} / {formatCurrency(Number(budget.monthly_limit))}
                    </span>
                  </div>
                  <div className="h-2 bg-canvas-soft rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{ width: `${percent}%`, backgroundColor: color }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Recent Transactions */}
      <div className="bg-canvas rounded-xl p-5 shadow-[0_0_0_1px_rgba(14,15,12,0.12)]">
        <h2 className="font-display text-display-xs text-ink mb-4">Recent Transactions</h2>

        {recentTransactions.length > 0 ? (
          <div className="space-y-3">
            {recentTransactions.map((t) => (
              <div
                key={t.id}
                className="flex items-center justify-between py-2 border-b border-canvas-soft last:border-0"
              >
                <div className="flex items-center gap-3">
                  <span className="text-xl">{t.category?.icon || "📦"}</span>
                  <div>
                    <p className="text-body-sm-strong text-ink">
                      {t.category?.name || "Unknown"}
                    </p>
                    {t.note && <p className="text-caption text-muted">{t.note}</p>}
                  </div>
                </div>
                <div className="text-right">
                  <p
                    className={`text-body-sm-strong ${
                      t.type === "expense" ? "text-negative" : "text-positive"
                    }`}
                  >
                    {t.type === "expense" ? "-" : "+"}
                    {formatCurrency(Number(t.amount))}
                  </p>
                  <p className="text-caption text-muted">
                    {new Date(t.date).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                    })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-body-sm text-muted text-center py-8">
            No transactions yet. Tap + to add one!
          </p>
        )}
      </div>
    </div>
  );
}
