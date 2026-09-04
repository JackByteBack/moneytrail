"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Category } from "@/types/database";
import { X, Check } from "lucide-react";

const CATEGORIES = [
  { name: "Food", icon: "🍔", color: "#FF6B6B" },
  { name: "Transport", icon: "🚗", color: "#4ECDC4" },
  { name: "Shopping", icon: "🛍️", color: "#FFE66D" },
  { name: "Bills", icon: "📄", color: "#95E1D3" },
  { name: "Entertainment", icon: "🎬", color: "#F38181" },
  { name: "Health", icon: "💊", color: "#AA96DA" },
  { name: "Rent", icon: "🏠", color: "#FCBAD3" },
  { name: "Subscriptions", icon: "📱", color: "#A8D8EA" },
  { name: "Other", icon: "📦", color: "#C4C4C4" },
];

const AUTO_CATEGORIZE: Record<string, string> = {
  zomato: "Food",
  swiggy: "Food",
  dominos: "Food",
  mcdonalds: "Food",
  uber: "Transport",
  ola: "Transport",
  rapido: "Transport",
  metro: "Transport",
  amazon: "Shopping",
  flipkart: "Shopping",
  meesho: "Shopping",
  electricity: "Bills",
  water: "Bills",
  gas: "Bills",
  internet: "Bills",
  jio: "Bills",
  airtel: "Bills",
  vi: "Bills",
  netflix: "Subscriptions",
  spotify: "Subscriptions",
  prime: "Subscriptions",
  hotstar: "Subscriptions",
  rent: "Rent",
  house: "Rent",
};

export function QuickAddModal({ onClose }: { onClose: () => void }) {
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [type, setType] = useState<"expense" | "income">("expense");
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const supabase = createClient();

  useEffect(() => {
    const fetchCategories = async () => {
      const { data } = await supabase
        .from("categories")
        .select("*")
        .order("is_default", { ascending: false });

      if (data) {
        setCategories(data);
      }
    };

    fetchCategories();
  }, [supabase]);

  const handleNoteChange = (value: string) => {
    setNote(value);

    if (!selectedCategory && value.length >= 3) {
      const lower = value.toLowerCase();
      for (const [keyword, categoryName] of Object.entries(AUTO_CATEGORIZE)) {
        if (lower.includes(keyword)) {
          const match = categories.find((c) => c.name === categoryName);
          if (match) {
            setSelectedCategory(match.id);
          }
          break;
        }
      }
    }
  };

  const handleSubmit = async () => {
    if (!amount || !selectedCategory) return;

    setLoading(true);

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { error } = await supabase.from("transactions").insert({
      user_id: user.id,
      category_id: selectedCategory,
      amount: parseFloat(amount),
      type,
      note: note || null,
      date,
    });

    if (!error) {
      onClose();
      window.location.reload();
    }

    setLoading(false);
  };

  const displayCategories = categories.length > 0
    ? categories
    : CATEGORIES.map((c, i) => ({ ...c, id: `default-${i}`, user_id: null, is_default: true, created_at: "" }));

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center p-4">
      <div className="bg-canvas rounded-t-xl sm:rounded-xl w-full max-w-md p-6 animate-in slide-in-from-bottom duration-300">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-display text-display-sm text-ink">Add Transaction</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-canvas-soft transition-colors"
          >
            <X className="w-5 h-5 text-muted" />
          </button>
        </div>

        {/* Type Toggle */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setType("expense")}
            className={`flex-1 py-2 rounded-pill font-button-md transition-colors ${
              type === "expense"
                ? "bg-negative text-on-primary"
                : "bg-canvas-soft text-muted"
            }`}
          >
            Expense
          </button>
          <button
            onClick={() => setType("income")}
            className={`flex-1 py-2 rounded-pill font-button-md transition-colors ${
              type === "income"
                ? "bg-positive text-on-primary"
                : "bg-canvas-soft text-muted"
            }`}
          >
            Income
          </button>
        </div>

        {/* Amount Input */}
        <div className="mb-6">
          <label className="block text-body-sm-strong text-ink mb-1.5">Amount</label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-body-lg text-muted">₹</span>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full pl-10 pr-4 py-4 bg-canvas border border-ink rounded-xl text-display-xs text-ink placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
              placeholder="0"
              min="0"
              step="0.01"
            />
          </div>
        </div>

        {/* Category Grid */}
        <div className="mb-6">
          <label className="block text-body-sm-strong text-ink mb-1.5">Category</label>
          <div className="grid grid-cols-3 gap-2">
            {displayCategories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`flex flex-col items-center gap-1 p-3 rounded-xl transition-all ${
                  selectedCategory === cat.id
                    ? "bg-primary-pale ring-2 ring-primary"
                    : "bg-canvas-soft hover:bg-canvas-soft/80"
                }`}
              >
                <span className="text-2xl">{cat.icon}</span>
                <span className="text-caption text-ink">{cat.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Note */}
        <div className="mb-4">
          <label className="block text-body-sm-strong text-ink mb-1.5">Note (optional)</label>
          <input
            type="text"
            value={note}
            onChange={(e) => handleNoteChange(e.target.value)}
            className="w-full px-4 py-3 bg-canvas border border-ink rounded-md text-body-md text-ink placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
            placeholder="e.g., Lunch at Zomato"
          />
        </div>

        {/* Date */}
        <div className="mb-6">
          <label className="block text-body-sm-strong text-ink mb-1.5">Date</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full px-4 py-3 bg-canvas border border-ink rounded-md text-body-md text-ink focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
          />
        </div>

        {/* Submit */}
        <button
          onClick={handleSubmit}
          disabled={!amount || !selectedCategory || loading}
          className="w-full py-3 px-6 bg-primary text-on-primary font-button-md rounded-xl hover:scale-[1.05] active:scale-[0.95] transition-transform disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {loading ? (
            "Saving..."
          ) : (
            <>
              <Check className="w-5 h-5" />
              Add Transaction
            </>
          )}
        </button>
      </div>
    </div>
  );
}
