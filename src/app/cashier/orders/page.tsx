"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Search, Filter, Eye, ChevronLeft, Clock, CheckCircle, XCircle, Truck, MapPin } from "lucide-react";

type OrderStatus = "all" | "confirmed" | "preparing" | "ready" | "completed" | "rejected";
type OrderType = "all" | "dine-in" | "delivery";

interface HistoryOrder {
  id: string;
  tableNumber?: string;
  customerName?: string;
  type: "dine-in" | "delivery";
  items: { name: string; quantity: number }[];
  total: number;
  status: "confirmed" | "preparing" | "ready" | "completed" | "rejected";
  time: string;
  paymentMethod: "cash" | "wallet";
}

const MOCK_ORDERS: HistoryOrder[] = [
  { id: "8480", tableNumber: "12", type: "dine-in", items: [{ name: "مندي لحم", quantity: 2 }, { name: "بيبسي", quantity: 3 }], total: 185, status: "completed", time: "12:30 م", paymentMethod: "cash" },
  { id: "8479", type: "delivery", customerName: "أحمد محمد", items: [{ name: "حنيذ لحم", quantity: 1 }, { name: "شاي عدني", quantity: 2 }], total: 121, status: "ready", time: "12:15 م", paymentMethod: "wallet" },
  { id: "8478", tableNumber: "05", type: "dine-in", items: [{ name: "مظبي دجاج", quantity: 2 }], total: 103.5, status: "preparing", time: "12:00 م", paymentMethod: "cash" },
  { id: "8477", tableNumber: "08", type: "dine-in", items: [{ name: "فحسة", quantity: 1 }, { name: "عريكة", quantity: 1 }], total: 97.75, status: "completed", time: "11:45 ص", paymentMethod: "wallet" },
  { id: "8476", type: "delivery", customerName: "سارة علي", items: [{ name: "معصوب ملكي", quantity: 3 }], total: 135.75, status: "completed", time: "11:30 ص", paymentMethod: "cash" },
  { id: "8475", tableNumber: "03", type: "dine-in", items: [{ name: "عقدة دجاج", quantity: 1 }], total: 46, status: "rejected", time: "11:15 ص", paymentMethod: "cash" },
  { id: "8474", tableNumber: "10", type: "dine-in", items: [{ name: "مندي لحم", quantity: 1 }, { name: "سلطة حارة", quantity: 1 }], total: 109.25, status: "completed", time: "11:00 ص", paymentMethod: "wallet" },
  { id: "8473", type: "delivery", customerName: "خالد عمر", items: [{ name: "حنيذ لحم", quantity: 2 }, { name: "بيبسي", quantity: 2 }], total: 223, status: "completed", time: "10:45 ص", paymentMethod: "cash" },
];

const STATUS_MAP: Record<string, { label: string; color: string; icon: typeof CheckCircle }> = {
  confirmed: { label: "مؤكد", color: "text-[#3b82f6] bg-[#3b82f6]/10 border-[#3b82f6]/20", icon: CheckCircle },
  preparing: { label: "قيد التحضير", color: "text-gold bg-gold/10 border-gold/20", icon: Clock },
  ready: { label: "جاهز", color: "text-success bg-success/10 border-success/20", icon: CheckCircle },
  completed: { label: "مكتمل", color: "text-text-secondary bg-bg-tertiary border-bg-tertiary", icon: CheckCircle },
  rejected: { label: "مرفوض", color: "text-danger bg-danger/10 border-danger/20", icon: XCircle },
};

export default function OrdersHistoryPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<OrderStatus>("all");
  const [typeFilter, setTypeFilter] = useState<OrderType>("all");
  const [selectedOrder, setSelectedOrder] = useState<HistoryOrder | null>(null);

  const filteredOrders = MOCK_ORDERS.filter((order) => {
    const matchesSearch = order.id.includes(searchQuery) || order.tableNumber?.includes(searchQuery) || order.customerName?.includes(searchQuery) || false;
    const matchesStatus = statusFilter === "all" || order.status === statusFilter;
    const matchesType = typeFilter === "all" || order.type === typeFilter;
    if (searchQuery.trim() !== "") return matchesSearch && matchesStatus && matchesType;
    return matchesStatus && matchesType;
  });

  return (
    <div className="max-w-6xl mx-auto pb-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-text-primary mb-1">سجل الطلبات</h1>
          <p className="text-text-secondary text-sm">عرض وتتبع جميع الطلبات السابقة والحالية.</p>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="bg-bg-secondary border border-bg-tertiary rounded-xl p-4 mb-6 flex flex-col md:flex-row gap-4">
        {/* Search */}
        <div className="relative flex-1">
          <Search size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary" />
          <input
            type="text"
            placeholder="ابحث برقم الطلب أو الطاولة..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-bg-primary border border-bg-tertiary rounded-lg py-2.5 pr-10 pl-4 text-sm text-text-primary focus:outline-none focus:border-gold transition-colors"
          />
        </div>

        {/* Status Filter */}
        <div className="flex items-center gap-2 overflow-x-auto hide-scrollbar">
          <Filter size={16} className="text-text-secondary flex-shrink-0" />
          {(["all", "confirmed", "preparing", "ready", "completed", "rejected"] as OrderStatus[]).map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all border ${
                statusFilter === status
                  ? "bg-gold text-bg-primary border-gold"
                  : "bg-bg-primary text-text-secondary border-bg-tertiary hover:border-text-secondary"
              }`}
            >
              {status === "all" ? "الكل" : STATUS_MAP[status]?.label}
            </button>
          ))}
        </div>

        {/* Type Filter */}
        <div className="flex items-center gap-2">
          {(["all", "dine-in", "delivery"] as OrderType[]).map((type) => (
            <button
              key={type}
              onClick={() => setTypeFilter(type)}
              className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all border flex items-center gap-1 ${
                typeFilter === type
                  ? "bg-gold text-bg-primary border-gold"
                  : "bg-bg-primary text-text-secondary border-bg-tertiary hover:border-text-secondary"
              }`}
            >
              {type === "all" && "الكل"}
              {type === "dine-in" && <><MapPin size={12} /> محلي</>}
              {type === "delivery" && <><Truck size={12} /> توصيل</>}
            </button>
          ))}
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-bg-secondary border border-bg-tertiary rounded-xl overflow-hidden">
        {/* Table Header */}
        <div className="hidden md:grid md:grid-cols-7 gap-4 px-6 py-3 bg-bg-tertiary/50 text-text-secondary text-xs font-bold border-b border-bg-tertiary">
          <span>رقم الطلب</span>
          <span>النوع</span>
          <span>الطاولة / العميل</span>
          <span>العناصر</span>
          <span>الإجمالي</span>
          <span>الحالة</span>
          <span>الوقت</span>
        </div>

        {/* Table Body */}
        {filteredOrders.length > 0 ? (
          filteredOrders.map((order, index) => {
            const statusInfo = STATUS_MAP[order.status];
            const StatusIcon = statusInfo.icon;
            return (
              <motion.div
                key={order.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: index * 0.03 }}
                onClick={() => setSelectedOrder(selectedOrder?.id === order.id ? null : order)}
                className="grid grid-cols-2 md:grid-cols-7 gap-3 md:gap-4 px-4 md:px-6 py-4 border-b border-bg-tertiary last:border-0 cursor-pointer hover:bg-bg-tertiary/30 transition-colors"
              >
                <span className="text-text-primary font-bold text-sm">#{order.id}</span>
                <span className="text-text-secondary text-sm flex items-center gap-1">
                  {order.type === "dine-in" ? <><MapPin size={12} className="text-gold" /> محلي</> : <><Truck size={12} className="text-gold" /> توصيل</>}
                </span>
                <span className="text-text-primary text-sm">
                  {order.type === "dine-in" ? `طاولة ${order.tableNumber}` : order.customerName}
                </span>
                <span className="text-text-secondary text-sm hidden md:block">
                  {order.items.map(i => `${i.name} x${i.quantity}`).join(", ").slice(0, 30)}...
                </span>
                <span className="text-gold font-bold text-sm">{order.total} ر.ي</span>
                <span className={`text-xs font-bold px-2 py-1 rounded-full border w-fit flex items-center gap-1 ${statusInfo.color}`}>
                  <StatusIcon size={12} />
                  {statusInfo.label}
                </span>
                <span className="text-text-secondary text-sm hidden md:block">{order.time}</span>
              </motion.div>
            );
          })
        ) : (
          <div className="py-16 text-center">
            <Search size={32} className="mx-auto text-text-secondary mb-4" />
            <h3 className="text-text-primary font-bold mb-1">لا توجد طلبات</h3>
            <p className="text-text-secondary text-sm">جرب تغيير الفلتر أو البحث بكلمات مختلفة.</p>
          </div>
        )}
      </div>

      {/* Order Detail Panel */}
      {selectedOrder && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 bg-bg-secondary border border-gold/30 rounded-xl p-6 gold-glow"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-text-primary">تفاصيل الطلب #{selectedOrder.id}</h3>
            <button onClick={() => setSelectedOrder(null)} className="text-text-secondary hover:text-gold">
              <XCircle size={20} />
            </button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            <div>
              <p className="text-text-secondary text-xs mb-1">النوع</p>
              <p className="text-text-primary text-sm font-bold">{selectedOrder.type === "dine-in" ? "محلي" : "توصيل"}</p>
            </div>
            <div>
              <p className="text-text-secondary text-xs mb-1">{selectedOrder.type === "dine-in" ? "الطاولة" : "العميل"}</p>
              <p className="text-text-primary text-sm font-bold">{selectedOrder.type === "dine-in" ? selectedOrder.tableNumber : selectedOrder.customerName}</p>
            </div>
            <div>
              <p className="text-text-secondary text-xs mb-1">طريقة الدفع</p>
              <p className="text-text-primary text-sm font-bold">{selectedOrder.paymentMethod === "cash" ? "كاش" : "محفظة إلكترونية"}</p>
            </div>
            <div>
              <p className="text-text-secondary text-xs mb-1">الإجمالي</p>
              <p className="text-gold text-sm font-black">{selectedOrder.total} ر.ي</p>
            </div>
          </div>
          <div className="border-t border-bg-tertiary pt-4">
            <p className="text-text-secondary text-xs mb-2 font-bold">عناصر الطلب:</p>
            <div className="flex flex-wrap gap-2">
              {selectedOrder.items.map((item, i) => (
                <span key={i} className="bg-bg-tertiary text-text-primary text-xs px-3 py-1.5 rounded-full font-medium">
                  {item.name} x{item.quantity}
                </span>
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
