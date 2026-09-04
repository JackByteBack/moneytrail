import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { BudgetsContent } from "@/components/dashboard/BudgetsContent";

export default async function BudgetsPage() {
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

  const { data: budgets } = await supabase
    .from("budgets")
    .select("*, category:categories(*)")
    .eq("user_id", user.id)
    .eq("month", currentMonth)
    .eq("year", currentYear);

  const { data: transactions } = await supabase
    .from("transactions")
    .select("*, category:categories(*)")
    .eq("user_id", user.id)
    .eq("type", "expense")
    .gte("date", `${currentYear}-${String(currentMonth).padStart(2, "0")}-01`)
    .lte("date", now.toISOString().split("T")[0]);

  const { data: categories } = await supabase
    .from("categories")
    .select("*")
    .eq("user_id", user.id)
    .order("is_default", { ascending: false });

  return (
    <BudgetsContent
      budgets={budgets || []}
      transactions={transactions || []}
      categories={categories || []}
      currentMonth={currentMonth}
      currentYear={currentYear}
    />
  );
}
