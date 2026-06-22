"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { 
  LayoutDashboard, 
  ClipboardList, 
  Grid2X2, 
  Settings, 
  LogOut,
  BookOpen
} from "lucide-react";
import ThemeToggle from "@/components/shared/ThemeToggle";

const sidebarLinks = [
  { name: "لوحة التحكم", href: "/cashier", icon: LayoutDashboard },
  { name: "سجل الطلبات", href: "/cashier/orders", icon: ClipboardList },
  { name: "خريطة الطاولات", href: "/cashier/tables", icon: Grid2X2 },
  { name: "إدارة المنيو", href: "/cashier/menu", icon: BookOpen },
  { name: "الإعدادات", href: "/cashier/settings", icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 h-screen bg-bg-secondary border-l border-bg-tertiary flex flex-col sticky top-0">
      {/* Brand */}
      <div className="h-20 flex items-center gap-3 px-6 border-b border-bg-tertiary">
        <img src="/images/logo-full.png" alt="البيت التركي للمشويات" className="w-10 h-10 rounded-sm object-contain" />
        <div>
          <h1 className="text-text-primary font-bold text-lg leading-tight">البيت التركي</h1>
          <p className="text-accent text-xs font-medium">لوحة الكاشير</p>
        </div>
      </div>

      {/* Links */}
      <nav className="flex-1 py-6 px-4 flex flex-col gap-2 overflow-y-auto">
        {sidebarLinks.map((link) => {
          const isActive = link.href === "/cashier" ? pathname === "/cashier" : pathname.includes(link.href);
          const Icon = link.icon;

          return (
            <Link
              key={link.href}
              href={link.href}
              className={`relative flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors duration-300 ${
                isActive 
                  ? "text-accent bg-bg-tertiary/50" 
                  : "text-text-secondary hover:text-text-primary hover:bg-bg-tertiary/30"
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="sidebar-active-indicator"
                  className="absolute right-0 top-0 bottom-0 w-1 bg-brand rounded-l-full"
                />
              )}
              <Icon size={20} className={isActive ? "text-accent" : "opacity-70"} />
              <span>{link.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* Bottom: Theme Toggle + Logout */}
      <div className="p-4 border-t border-bg-tertiary space-y-2">
        <div className="flex items-center justify-between px-4 py-2">
          <span className="text-text-secondary text-sm">المظهر</span>
          <ThemeToggle />
        </div>
        <button className="flex items-center gap-3 w-full px-4 py-3 text-text-secondary hover:text-danger hover:bg-danger/10 rounded-lg transition-colors duration-300">
          <LogOut size={20} />
          <span className="font-medium">تسجيل الخروج</span>
        </button>
      </div>
    </aside>
  );
}
