"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { User } from "@supabase/supabase-js";
import {
  LayoutDashboard,
  ArrowUpDown,
  PiggyBank,
  Lightbulb,
  LogOut,
} from "lucide-react";

const navItems = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/transactions", label: "Transactions", icon: ArrowUpDown },
  { href: "/budgets", label: "Budgets", icon: PiggyBank },
  { href: "/insights", label: "Insights", icon: Lightbulb },
] as const;

export function Navbar({ user }: { user: User }) { // eslint-disable-line @typescript-eslint/no-unused-vars
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  };

  return (
    <nav className="fixed top-0 left-0 right-0 bg-canvas z-50 border-b border-canvas-soft">
      <div className="max-w-2xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="font-display text-display-xs text-ink">
          MoneyTrail
        </Link>

        <div className="flex items-center gap-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-pill text-body-sm-strong transition-colors ${
                  isActive
                    ? "bg-primary-pale text-ink-deep"
                    : "text-muted hover:text-ink hover:bg-canvas-soft"
                }`}
              >
                <item.icon className="w-4 h-4" />
                <span className="hidden sm:inline">{item.label}</span>
              </Link>
            );
          })}

          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 px-3 py-2 rounded-pill text-body-sm-strong text-muted hover:text-negative hover:bg-negative-bg transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </div>
    </nav>
  );
}
