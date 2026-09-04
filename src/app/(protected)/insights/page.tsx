import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { InsightsContent } from "@/components/dashboard/InsightsContent";

export default async function InsightsPage() {
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

  const { data: currentMonthTransactions } = await supabase
    .from("transactions")
    .select("*, category:categories(*)")
    .eq("user_id", user.id)
    .eq("type", "expense")
    .gte("date", `${currentYear}-${String(currentMonth).padStart(2, "0")}-01`)
    .lte("date", now.toISOString().split("T")[0]);

  const prevMonth = currentMonth === 1 ? 12 : currentMonth - 1;
  const prevYear = currentMonth === 1 ? currentYear - 1 : currentYear;

  const { data: prevMonthTransactions } = await supabase
    .from("transactions")
    .select("*, category:categories(*)")
    .eq("user_id", user.id)
    .eq("type", "expense")
    .gte("date", `${prevYear}-${String(prevMonth).padStart(2, "0")}-01`)
    .lte(
      "date",
      `${prevYear}-${String(prevMonth).padStart(2, "0")}-${new Date(prevYear, prevMonth, 0).getDate()}`
    );

  const { data: recurring } = await supabase
    .from("recurring_transactions")
    .select("*")
    .eq("user_id", user.id);

  const currentTotal =
    currentMonthTransactions?.reduce((sum, t) => sum + Number(t.amount), 0) || 0;
  const prevTotal =
    prevMonthTransactions?.reduce((sum, t) => sum + Number(t.amount), 0) || 0;

  const currentByCategory = currentMonthTransactions?.reduce((acc, t) => {
    const cat = t.category as { name?: string } | null;
    const name = cat?.name || "Unknown";
    acc[name] = (acc[name] || 0) + Number(t.amount);
    return acc;
  }, {} as Record<string, number>) || {};

  const prevByCategory = prevMonthTransactions?.reduce((acc, t) => {
    const cat = t.category as { name?: string } | null;
    const name = cat?.name || "Unknown";
    acc[name] = (acc[name] || 0) + Number(t.amount);
    return acc;
  }, {} as Record<string, number>) || {};

  const topCategory = (Object.entries(currentByCategory) as [string, number][]).sort(
    (a, b) => b[1] - a[1]
  )[0];

  return (
    <InsightsContent
      currentTotal={currentTotal}
      prevTotal={prevTotal}
      currentByCategory={currentByCategory}
      prevByCategory={prevByCategory}
      topCategory={topCategory}
      recurringCount={recurring?.length || 0}
      recurringTotal={
        recurring?.reduce((sum, r) => sum + Number(r.amount), 0) || 0
      }
    />
  );
}
