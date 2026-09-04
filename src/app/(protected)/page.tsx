import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { DashboardContent } from "@/components/dashboard/DashboardContent";

export default async function DashboardPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const now = new Date();
  const currentMonth = now.getMonth() + 1;
  const currentYear = now.getFullYear();

  const { data: transactions } = await supabase
    .from("transactions")
    .select("*, category:categories(*)")
    .eq("user_id", user.id)
    .gte("date", `${currentYear}-${String(currentMonth).padStart(2, "0")}-01`)
    .lte("date", now.toISOString().split("T")[0])
    .order("date", { ascending: false });

  const { data: allTransactions } = await supabase
    .from("transactions")
    .select("*, category:categories(*)")
    .eq("user_id", user.id)
    .order("date", { ascending: false })
    .limit(100);

  const { data: budgets } = await supabase
    .from("budgets")
    .select("*, category:categories(*)")
    .eq("user_id", user.id)
    .eq("month", currentMonth)
    .eq("year", currentYear);

  const totalSpend = transactions
    ?.filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + Number(t.amount), 0) || 0;

  const totalIncome = transactions
    ?.filter((t) => t.type === "income")
    .reduce((sum, t) => sum + Number(t.amount), 0) || 0;

  const categoryBreakdown = transactions
    ?.filter((t) => t.type === "expense" && t.category)
    .reduce((acc, t) => {
      const cat = t.category as { name: string; color: string; icon: string };
      const existing = acc.find((a: { name: string; value: number; color: string; icon: string }) => a.name === cat.name);
      if (existing) {
        existing.value += Number(t.amount);
      } else {
        acc.push({
          name: cat.name,
          value: Number(t.amount),
          color: cat.color,
          icon: cat.icon,
        });
      }
      return acc;
    }, [] as { name: string; value: number; color: string; icon: string }[]) || [];

  const monthlyTrend = Array.from({ length: 6 }, (_, i) => {
    const d = new Date();
    d.setMonth(d.getMonth() - (5 - i));
    return {
      month: d.toLocaleString("default", { month: "short" }),
      total:
        allTransactions
          ?.filter((t) => {
            const tDate = new Date(t.date);
            return (
              t.type === "expense" &&
              tDate.getMonth() === d.getMonth() &&
              tDate.getFullYear() === d.getFullYear()
            );
          })
          .reduce((sum, t) => sum + Number(t.amount), 0) || 0,
    };
  });

  return (
    <DashboardContent
      totalSpend={totalSpend}
      totalIncome={totalIncome}
      categoryBreakdown={categoryBreakdown}
      monthlyTrend={monthlyTrend}
      recentTransactions={transactions?.slice(0, 10) || []}
      budgets={budgets || []}
    />
  );
}
