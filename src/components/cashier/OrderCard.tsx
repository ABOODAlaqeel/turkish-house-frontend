"use client";

import { motion } from "framer-motion";
import { Check, X, Clock, Receipt } from "lucide-react";

interface OrderItem {
  name: string;
  quantity: number;
  notes?: string;
}

export interface CashierOrder {
  id: string;
  tableNumber: string;
  time: string;
  items: OrderItem[];
  total: number;
  status: "pending" | "confirmed" | "preparing" | "ready" | "completed";
}

interface OrderCardProps {
  order: CashierOrder;
  onConfirm: (id: string) => void;
  onReject: (id: string) => void;
}

export default function OrderCard({ order, onConfirm, onReject }: OrderCardProps) {
  return (
    <motion.div 
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="bg-bg-secondary border border-bg-tertiary rounded-xl overflow-hidden flex flex-col hover:border-gold/30 transition-colors shadow-sm"
    >
      {/* Header */}
      <div className="bg-bg-tertiary/50 p-4 border-b border-bg-tertiary flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="bg-gold text-bg-primary text-xs font-bold px-2 py-0.5 rounded">
              طاولة {order.tableNumber}
            </span>
            <span className="text-text-secondary text-sm">
              #{order.id}
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-text-secondary text-xs">
            <Clock size={12} />
            <span>{order.time}</span>
          </div>
        </div>
        <div className="text-left">
          <span className="block text-gold font-bold text-lg leading-none">
            {order.total} <span className="text-xs font-normal">ر.ي</span>
          </span>
        </div>
      </div>

      {/* Items */}
      <div className="p-4 flex-1">
        <ul className="space-y-3">
          {order.items.map((item, idx) => (
            <li key={idx} className="flex gap-3 text-sm">
              <span className="font-bold text-text-secondary">{item.quantity}x</span>
              <div>
                <p className="text-text-primary">{item.name}</p>
                {item.notes && (
                  <p className="text-gold/80 text-xs mt-0.5">ملاحظة: {item.notes}</p>
                )}
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Actions */}
      <div className="p-4 border-t border-bg-tertiary grid grid-cols-2 gap-3 bg-bg-primary/30">
        <button 
          onClick={() => onReject(order.id)}
          className="flex items-center justify-center gap-2 py-2 rounded-md border border-danger/30 text-danger hover:bg-danger/10 transition-colors"
        >
          <X size={16} />
          <span className="text-sm font-medium">رفض</span>
        </button>
        <button 
          onClick={() => onConfirm(order.id)}
          className="flex items-center justify-center gap-2 py-2 rounded-md bg-success/10 text-success hover:bg-success hover:text-white transition-colors"
        >
          <Check size={16} />
          <span className="text-sm font-medium">تأكيد للمطبخ</span>
        </button>
      </div>
    </motion.div>
  );
}
