import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Navbar } from "@/components/ui/Navbar";
import { FloatingActionButton } from "@/components/transactions/FloatingActionButton";

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-canvas-soft">
      <Navbar user={user} />
      <main className="pt-16 pb-24 px-4 max-w-2xl mx-auto">{children}</main>
      <FloatingActionButton />
    </div>
  );
}
