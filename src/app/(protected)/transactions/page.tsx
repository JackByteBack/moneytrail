import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { TransactionsContent } from "@/components/transactions/TransactionsContent";

export default async function TransactionsPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: transactions } = await supabase
    .from("transactions")
    .select("*, category:categories(*)")
    .eq("user_id", user.id)
    .order("date", { ascending: false });

  const { data: categories } = await supabase
    .from("categories")
    .select("*")
    .eq("user_id", user.id)
    .order("is_default", { ascending: false });

  return (
    <TransactionsContent
      transactions={transactions || []}
      categories={categories || []}
    />
  );
}
