"use client";

import { useState, useMemo } from "react";
import { Transaction, Category } from "@/types/database"; // eslint-disable-line @typescript-eslint/no-unused-vars
import { Search, Filter, Trash2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

interface TransactionsContentProps {
  transactions: Transaction[];
  categories: Category[];
}

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function TransactionsContent({
  transactions,
  categories,
}: TransactionsContentProps) {
  const [search, setSearch] = useState("");
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [filterType, setFilterType] = useState<string>("all");
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const supabase = createClient();

  const filtered = useMemo(() => {
    return transactions.filter((t) => {
      const matchesSearch =
        !search ||
        t.note?.toLowerCase().includes(search.toLowerCase()) ||
        t.category?.name?.toLowerCase().includes(search.toLowerCase());

      const matchesCategory =
        filterCategory === "all" || t.category_id === filterCategory;

      const matchesType = filterType === "all" || t.type === filterType;

      return matchesSearch && matchesCategory && matchesType;
    });
  }, [transactions, search, filterCategory, filterType]);

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    await supabase.from("transactions").delete().eq("id", id);
    window.location.reload();
  };

  return (
    <div className="space-y-4">
      <h1 className="font-display text-display-sm text-ink">Transactions</h1>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-3 bg-canvas border border-ink rounded-xl text-body-md text-ink placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
          placeholder="Search transactions..."
        />
      </div>

      {/* Filters */}
      <div className="flex gap-2 flex-wrap">
        <div className="flex items-center gap-1.5 px-3 py-2 bg-canvas border border-ink rounded-pill">
          <Filter className="w-4 h-4 text-muted" />
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="bg-transparent text-body-sm text-ink focus:outline-none"
          >
            <option value="all">All Categories</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.icon} {cat.name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex gap-1 bg-canvas border border-ink rounded-pill p-1">
          {["all", "expense", "income"].map((type) => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              className={`px-3 py-1 rounded-pill text-body-sm-strong transition-colors ${
                filterType === type
                  ? "bg-primary text-on-primary"
                  : "text-muted hover:text-ink"
              }`}
            >
              {type === "all" ? "All" : type === "expense" ? "Expense" : "Income"}
            </button>
          ))}
        </div>
      </div>

      {/* Transaction List */}
      <div className="bg-canvas rounded-xl shadow-[0_0_0_1px_rgba(14,15,12,0.12)] overflow-hidden">
        {filtered.length > 0 ? (
          filtered.map((t) => (
            <div
              key={t.id}
              className="flex items-center justify-between p-4 border-b border-canvas-soft last:border-0"
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">{t.category?.icon || "📦"}</span>
                <div>
                  <p className="text-body-sm-strong text-ink">
                    {t.category?.name || "Unknown"}
                  </p>
                  {t.note && <p className="text-caption text-muted">{t.note}</p>}
                  <p className="text-caption text-muted">
                    {new Date(t.date).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="text-right">
                  <p
                    className={`text-body-sm-strong ${
                      t.type === "expense" ? "text-negative" : "text-positive"
                    }`}
                  >
                    {t.type === "expense" ? "-" : "+"}
                    {formatCurrency(Number(t.amount))}
                  </p>
                </div>

                <button
                  onClick={() => handleDelete(t.id)}
                  disabled={deletingId === t.id}
                  className="p-2 rounded-full hover:bg-negative-bg text-muted hover:text-negative transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="p-8 text-center text-body-sm text-muted">
            No transactions found
          </div>
        )}
      </div>
    </div>
  );
}
