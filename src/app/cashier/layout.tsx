"use client";

import Sidebar from "@/components/shared/Sidebar";
import { usePathname } from "next/navigation";

export default function CashierLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isLoginPage = pathname === "/cashier/login";

  if (isLoginPage) {
    return <div className="min-h-screen bg-bg-primary">{children}</div>;
  }

  return (
    <div className="flex min-h-screen bg-bg-primary text-text-primary">
      <div className="hidden md:block">
        <Sidebar />
      </div>

      <main className="flex-1 flex flex-col min-h-screen overflow-x-hidden">
        <div className="md:hidden h-16 bg-bg-secondary border-b border-bg-tertiary flex items-center justify-between px-4 sticky top-0 z-30">
          <h1 className="text-text-primary font-bold">البيت التركي - الكاشير</h1>
        </div>
        
        <div className="flex-1 p-6 md:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
