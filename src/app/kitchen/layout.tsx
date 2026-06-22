"use client";

import { useEffect, useState } from "react";
import ThemeToggle from "@/components/shared/ThemeToggle";

export default function KitchenLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [time, setTime] = useState("");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString("ar-SA", { hour: "2-digit", minute: "2-digit" }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-bg-primary text-text-primary flex flex-col">
      {/* Top Navbar specifically for Kitchen */}
      <header className="h-20 bg-bg-secondary border-b-2 border-bg-tertiary flex items-center justify-between px-8 sticky top-0 z-40">
        <div className="flex items-center gap-4">
          <img src="/images/logo-full.png" alt="البيت التركي للمشويات" className="w-12 h-12 rounded-lg object-contain" />
          <div>
            <h1 className="text-2xl font-black text-text-primary tracking-wide">مطبخ البيت التركي</h1>
            <p className="text-text-secondary text-sm font-bold">شاشة المطبخ KDS</p>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <ThemeToggle />
          <div className="flex items-center gap-3 bg-bg-primary border border-bg-tertiary px-5 py-2 rounded-lg">
            <div className="w-3 h-3 rounded-full bg-success animate-pulse" />
            <span className="font-bold text-lg">متصل</span>
          </div>
          <div className="text-3xl font-black text-accent font-mono" dir="ltr">
            {time}
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 p-6 md:p-8 overflow-x-hidden">
        {children}
      </main>
    </div>
  );
}
