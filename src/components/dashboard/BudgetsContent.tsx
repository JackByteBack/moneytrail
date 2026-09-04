"use client";

import { useState } from "react";
import { Budget, Transaction, Category } from "@/types/database";
import { Plus, X, Trash2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

interface BudgetsContentProps {
  budgets: Budget[];
  transactions: Transaction[];
  categories: Category[];
  currentMonth: number;
  currentYear: number;
}

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function BudgetsContent({
  budgets,
  transactions,
  categories,
  currentMonth,
  currentYear,
}: BudgetsContentProps) {
  const [showAdd, setShowAdd] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [limit, setLimit] = useState("");
  const [loading, setLoading] = useState(false);
  const supabase = createClient();

  const categorySpending = transactions.reduce((acc, t) => {
    const catId = t.category_id;
    acc[catId] = (acc[catId] || 0) + Number(t.amount);
    return acc;
  }, {} as Record<string, number>);

  const handleAdd = async () => {
    if (!selectedCategory || !limit) return;

    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { error } = await supabase.from("budgets").insert({
      user_id: user.id,
      category_id: selectedCategory,
      monthly_limit: parseFloat(limit),
      month: currentMonth,
      year: currentYear,
    });

    if (!error) {
      setShowAdd(false);
      setSelectedCategory("");
      setLimit("");
      window.location.reload();
    }

    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    await supabase.from("budgets").delete().eq("id", id);
    window.location.reload();
  };

  const unusedCategories = categories.filter(
    (cat) => !budgets.some((b) => b.category_id === cat.id)
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-display-sm text-ink">Budgets</h1>
        <button
          onClick={() => setShowAdd(true)}
          className="flex items-center gap-1.5 px-4 py-2 bg-primary text-on-primary rounded-pill font-button-md hover:scale-[1.05] active:scale-[0.95] transition-transform"
        >
          <Plus className="w-4 h-4" />
          Add Budget
        </button>
      </div>

      {/* Add Budget Modal */}
      {showAdd && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-canvas rounded-xl w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-display text-display-xs text-ink">Add Budget</h2>
              <button
                onClick={() => setShowAdd(false)}
                className="p-2 rounded-full hover:bg-canvas-soft"
              >
                <X className="w-5 h-5 text-muted" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-body-sm-strong text-ink mb-1.5">
                  Category
                </label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-4 py-3 bg-canvas border border-ink rounded-xl text-body-md text-ink focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                >
                  <option value="">Select category</option>
                  {unusedCategories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.icon} {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-body-sm-strong text-ink mb-1.5">
                  Monthly Limit
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-body-lg text-muted">
                    ₹
                  </span>
                  <input
                    type="number"
                    value={limit}
                    onChange={(e) => setLimit(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-canvas border border-ink rounded-xl text-body-md text-ink placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                    placeholder="0"
                    min="0"
                  />
                </div>
              </div>

              <button
                onClick={handleAdd}
                disabled={!selectedCategory || !limit || loading}
                className="w-full py-3 px-6 bg-primary text-on-primary font-button-md rounded-xl hover:scale-[1.05] active:scale-[0.95] transition-transform disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Adding..." : "Add Budget"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Budget Cards */}
      <div className="space-y-3">
        {budgets.length > 0 ? (
          budgets.map((budget) => {
            const spent = categorySpending[budget.category_id] || 0;
            const limit = Number(budget.monthly_limit);
            const percent = Math.min((spent / limit) * 100, 100);
            const color =
              percent >= 90 ? "#d03238" : percent >= 70 ? "#ffd11a" : "#9fe870";

            return (
              <div
                key={budget.id}
                className="bg-canvas rounded-xl p-5 shadow-[0_0_0_1px_rgba(14,15,12,0.12)]"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{budget.category?.icon}</span>
                    <div>
                      <p className="text-body-sm-strong text-ink">
                        {budget.category?.name}
                      </p>
                      <p className="text-caption text-muted">
                        {formatCurrency(spent)} of {formatCurrency(limit)}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => handleDelete(budget.id)}
                    className="p-2 rounded-full hover:bg-negative-bg text-muted hover:text-negative transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="h-3 bg-canvas-soft rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{ width: `${percent}%`, backgroundColor: color }}
                  />
                </div>

                <div className="flex justify-between mt-2">
                  <span className="text-caption text-muted">
                    {percent.toFixed(0)}% used
                  </span>
                  {percent >= 90 && (
                    <span className="text-caption text-negative font-body-sm-strong">
                      ⚠️ Over budget!
                    </span>
                  )}
                </div>
              </div>
            );
          })
        ) : (
          <div className="bg-canvas rounded-xl p-8 text-center shadow-[0_0_0_1px_rgba(14,15,12,0.12)]">
            <p className="text-body-sm text-muted mb-4">
              No budgets set yet. Add one to start tracking!
            </p>
            <button
              onClick={() => setShowAdd(true)}
              className="px-4 py-2 bg-primary text-on-primary rounded-pill font-button-md hover:scale-[1.05] active:scale-[0.95] transition-transform"
            >
              Add your first budget
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
