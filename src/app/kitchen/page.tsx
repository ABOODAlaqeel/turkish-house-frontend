"use client";

import { useState, useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import { CheckCircle, Clock } from "lucide-react";
import KitchenOrderCard from "@/components/kitchen/KitchenOrderCard";
import { useOrderStore } from "@/stores/order.store";

export default function KitchenDashboard() {
  const orders = useOrderStore((state) => state.orders);
  const updateOrderStatus = useOrderStore((state) => state.updateOrderStatus);

  // Cross-tab auto-sync polling
  useEffect(() => {
    const interval = setInterval(() => {
      useOrderStore.persist.rehydrate();
    }, 2000); // Check for new orders every 2s
    return () => clearInterval(interval);
  }, []);

  const preparingOrders = orders.filter(o => o.status === "preparing");

  const handleReady = (id: string) => {
    updateOrderStatus(id, "ready");
  };

  return (
    <div className="max-w-[1600px] mx-auto pb-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-black text-text-primary mb-1">الطلبات قيد التحضير</h1>
          <p className="text-text-secondary text-lg">
            يوجد <span className="text-gold font-bold">{preparingOrders.length}</span> طلبات بانتظار التجهيز.
          </p>
        </div>
      </div>

      {preparingOrders.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
          <AnimatePresence mode="popLayout">
            {preparingOrders.map((order) => (
              <KitchenOrderCard 
                key={order.id} 
                order={order as any} // Map to KitchenOrder props
                onMarkReady={handleReady} 
              />
            ))}
          </AnimatePresence>
        </div>
      ) : (
        <div className="bg-bg-secondary border border-bg-tertiary rounded-xl p-16 flex flex-col items-center justify-center text-center mt-10">
          <div className="w-24 h-24 rounded-full bg-bg-tertiary flex items-center justify-center text-text-secondary mb-6">
            <CheckCircle size={48} />
          </div>
          <h2 className="text-3xl font-black text-text-primary mb-3">لا توجد طلبات للتحضير</h2>
          <p className="text-text-secondary text-xl">المطبخ هادئ الآن. بانتظار طلبات جديدة من الكاشير.</p>
        </div>
      )}
    </div>
  );
}
