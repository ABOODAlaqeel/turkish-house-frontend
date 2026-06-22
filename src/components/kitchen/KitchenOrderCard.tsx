"use client";

import { motion } from "framer-motion";
import { CheckCircle2, Clock } from "lucide-react";

export interface KitchenOrderItem {
  name: string;
  quantity: number;
  notes?: string;
}

export interface KitchenOrder {
  id: string;
  tableNumber: string;
  time: string; // Will replace with active timer later
  items: KitchenOrderItem[];
  status: "preparing" | "ready";
}

interface KitchenOrderCardProps {
  order: KitchenOrder;
  onMarkReady: (id: string) => void;
}

export default function KitchenOrderCard({ order, onMarkReady }: KitchenOrderCardProps) {
  return (
    <motion.div 
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="bg-bg-secondary border-2 border-bg-tertiary rounded-xl overflow-hidden flex flex-col h-full shadow-lg"
    >
      {/* Header - Large and Clear */}
      <div className="bg-bg-tertiary p-5 flex items-center justify-between border-b-2 border-bg-tertiary">
        <div className="flex flex-col">
          <span className="text-4xl font-black text-gold">#{order.tableNumber}</span>
          <span className="text-text-secondary font-bold text-sm">طلب: {order.id}</span>
        </div>
        
        <div className="flex flex-col items-end">
          <div className="flex items-center gap-2 text-danger font-black text-xl bg-danger/10 px-3 py-1 rounded border border-danger/20">
            <Clock size={24} />
            <span>05:30</span> {/* Timer Placeholder */}
          </div>
          <span className="text-text-secondary font-bold text-xs mt-1">وقت الانتظار</span>
        </div>
      </div>

      {/* Items List - Large Text for easy reading from distance */}
      <div className="p-5 flex-1 overflow-y-auto">
        <ul className="space-y-4">
          {order.items.map((item, idx) => (
            <li key={idx} className="flex gap-4 border-b border-bg-tertiary pb-4 last:border-0 last:pb-0">
              <span className="text-2xl font-black text-gold bg-gold/10 w-12 h-12 flex items-center justify-center rounded-lg flex-shrink-0">
                {item.quantity}
              </span>
              <div className="pt-1">
                <p className="text-xl font-bold text-text-primary leading-tight">{item.name}</p>
                {item.notes && (
                  <p className="text-danger font-bold text-base mt-2 bg-danger/10 inline-block px-2 py-1 rounded">
                    تنبيه: {item.notes}
                  </p>
                )}
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Action Button */}
      <div className="p-4 bg-bg-primary/50 border-t-2 border-bg-tertiary">
        <button 
          onClick={() => onMarkReady(order.id)}
          className="w-full py-4 rounded-xl bg-success text-white font-black text-xl flex items-center justify-center gap-3 hover:bg-success/80 transition-colors active:scale-95"
        >
          <CheckCircle2 size={28} />
          <span>الطلب جاهز للتسليم</span>
        </button>
      </div>
    </motion.div>
  );
}
