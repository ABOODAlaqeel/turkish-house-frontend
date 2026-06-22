"use client";

import { useState, useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import { BellRing, CheckCircle, Clock, TrendingUp } from "lucide-react";
import OrderCard from "@/components/cashier/OrderCard";
import { useOrderStore } from "@/stores/order.store";

export default function CashierDashboard() {
  const orders = useOrderStore((state) => state.orders);
  const updateOrderStatus = useOrderStore((state) => state.updateOrderStatus);

  // Cross-tab auto-sync polling
  useEffect(() => {
    const interval = setInterval(() => {
      useOrderStore.persist.rehydrate();
    }, 2000); // Check for new orders every 2s
    return () => clearInterval(interval);
  }, []);

  const pendingOrders = orders.filter(o => o.status === "pending");
  const completedToday = orders.filter(o => o.status === "completed" || o.status === "ready" || o.status === "preparing").length;
  const salesToday = orders.filter(o => o.status !== "rejected" && o.status !== "pending").reduce((sum, o) => sum + o.total, 0);

  const handleConfirm = (id: string) => {
    updateOrderStatus(id, "preparing");
  };

  const handleReject = (id: string) => {
    updateOrderStatus(id, "rejected");
  };

  return (
    <div className="max-w-6xl mx-auto pb-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-text-primary mb-1">الطلبات الواردة</h1>
          <p className="text-text-secondary text-sm">لديك <span className="text-gold font-bold">{pendingOrders.length}</span> طلبات بانتظار التأكيد.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-bg-secondary px-4 py-2 rounded-lg border border-bg-tertiary">
            <span className="w-2.5 h-2.5 rounded-full bg-success animate-pulse" />
            <span className="text-sm font-medium">النظام متصل</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        <div className="bg-bg-secondary border border-bg-tertiary rounded-xl p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-gold/10 flex items-center justify-center text-gold flex-shrink-0">
            <BellRing size={24} />
          </div>
          <div>
            <p className="text-text-secondary text-xs mb-1">الطلبات الجديدة</p>
            <p className="text-text-primary font-bold text-xl">{pendingOrders.length}</p>
          </div>
        </div>
        
        <div className="bg-bg-secondary border border-bg-tertiary rounded-xl p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-success/10 flex items-center justify-center text-success flex-shrink-0">
            <CheckCircle size={24} />
          </div>
          <div>
            <p className="text-text-secondary text-xs mb-1">الطلبات المؤكدة اليوم</p>
            <p className="text-text-primary font-bold text-xl">{completedToday}</p>
          </div>
        </div>
        
        <div className="bg-bg-secondary border border-bg-tertiary rounded-xl p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-[#3b82f6]/10 flex items-center justify-center text-[#3b82f6] flex-shrink-0">
            <Clock size={24} />
          </div>
          <div>
            <p className="text-text-secondary text-xs mb-1">متوسط وقت التأكيد</p>
            <p className="text-text-primary font-bold text-xl">1.5 دقيقة</p>
          </div>
        </div>

        <div className="bg-bg-secondary border border-bg-tertiary rounded-xl p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-gold/10 flex items-center justify-center text-gold flex-shrink-0">
            <TrendingUp size={24} />
          </div>
          <div>
            <p className="text-text-secondary text-xs mb-1">مبيعات اليوم</p>
            <p className="text-text-primary font-bold text-xl">{salesToday} <span className="text-sm font-normal text-text-secondary">ر.ي</span></p>
          </div>
        </div>
      </div>

      {pendingOrders.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <AnimatePresence mode="popLayout">
            {pendingOrders.map((order) => (
              <OrderCard 
                key={order.id} 
                order={order as any} // Using existing OrderCard props for now
                onConfirm={handleConfirm} 
                onReject={handleReject} 
              />
            ))}
          </AnimatePresence>
        </div>
      ) : (
        <div className="bg-bg-secondary border border-bg-tertiary rounded-xl p-16 flex flex-col items-center justify-center text-center">
          <div className="w-20 h-20 rounded-full bg-bg-tertiary flex items-center justify-center text-text-secondary mb-4">
            <CheckCircle size={32} />
          </div>
          <h2 className="text-xl font-bold text-text-primary mb-2">لا توجد طلبات معلقة</h2>
          <p className="text-text-secondary">جميع الطلبات تم تأكيدها وتحويلها للمطبخ بنجاح.</p>
        </div>
      )}
    </div>
  );
}
