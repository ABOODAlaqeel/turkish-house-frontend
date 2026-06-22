"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Users, Clock, CheckCircle, XCircle, QrCode, Eye } from "lucide-react";

type TableStatus = "available" | "occupied" | "reserved";

interface TableData {
  id: string;
  number: string;
  seats: number;
  status: TableStatus;
  currentOrder?: string;
  guestCount?: number;
  occupiedSince?: string;
}

const MOCK_TABLES: TableData[] = [
  { id: "t1", number: "01", seats: 2, status: "available" },
  { id: "t2", number: "02", seats: 4, status: "occupied", currentOrder: "#8480", guestCount: 3, occupiedSince: "12:30 م" },
  { id: "t3", number: "03", seats: 2, status: "available" },
  { id: "t4", number: "04", seats: 6, status: "reserved" },
  { id: "t5", number: "05", seats: 4, status: "occupied", currentOrder: "#8478", guestCount: 2, occupiedSince: "12:00 م" },
  { id: "t6", number: "06", seats: 2, status: "available" },
  { id: "t7", number: "07", seats: 8, status: "available" },
  { id: "t8", number: "08", seats: 4, status: "occupied", currentOrder: "#8477", guestCount: 4, occupiedSince: "11:45 ص" },
  { id: "t9", number: "09", seats: 2, status: "available" },
  { id: "t10", number: "10", seats: 6, status: "occupied", currentOrder: "#8474", guestCount: 5, occupiedSince: "11:00 ص" },
  { id: "t11", number: "11", seats: 4, status: "reserved" },
  { id: "t12", number: "12", seats: 4, status: "occupied", currentOrder: "#8480", guestCount: 2, occupiedSince: "12:30 م" },
  { id: "t13", number: "13", seats: 2, status: "available" },
  { id: "t14", number: "14", seats: 6, status: "available" },
  { id: "t15", number: "15", seats: 8, status: "reserved" },
  { id: "t16", number: "16", seats: 4, status: "available" },
];

const STATUS_CONFIG: Record<TableStatus, { label: string; color: string; bgColor: string; borderColor: string }> = {
  available: { label: "متاحة", color: "text-success", bgColor: "bg-success/10", borderColor: "border-success/30" },
  occupied: { label: "مشغولة", color: "text-danger", bgColor: "bg-danger/10", borderColor: "border-danger/30" },
  reserved: { label: "محجوزة", color: "text-gold", bgColor: "bg-gold/10", borderColor: "border-gold/30" },
};

export default function TablesMapPage() {
  const [filter, setFilter] = useState<"all" | TableStatus>("all");
  const [selectedTable, setSelectedTable] = useState<TableData | null>(null);

  const filteredTables = filter === "all" ? MOCK_TABLES : MOCK_TABLES.filter(t => t.status === filter);

  const stats = {
    total: MOCK_TABLES.length,
    available: MOCK_TABLES.filter(t => t.status === "available").length,
    occupied: MOCK_TABLES.filter(t => t.status === "occupied").length,
    reserved: MOCK_TABLES.filter(t => t.status === "reserved").length,
  };

  return (
    <div className="max-w-6xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-text-primary mb-1">خريطة الطاولات</h1>
          <p className="text-text-secondary text-sm">إدارة ومتابعة حالة جميع الطاولات في المطعم.</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-bg-secondary border border-bg-tertiary rounded-xl p-4 text-center">
          <p className="text-3xl font-black text-text-primary">{stats.total}</p>
          <p className="text-text-secondary text-xs mt-1">إجمالي الطاولات</p>
        </div>
        <div className="bg-bg-secondary border border-success/20 rounded-xl p-4 text-center">
          <p className="text-3xl font-black text-success">{stats.available}</p>
          <p className="text-text-secondary text-xs mt-1">متاحة</p>
        </div>
        <div className="bg-bg-secondary border border-danger/20 rounded-xl p-4 text-center">
          <p className="text-3xl font-black text-danger">{stats.occupied}</p>
          <p className="text-text-secondary text-xs mt-1">مشغولة</p>
        </div>
        <div className="bg-bg-secondary border border-gold/20 rounded-xl p-4 text-center">
          <p className="text-3xl font-black text-gold">{stats.reserved}</p>
          <p className="text-text-secondary text-xs mt-1">محجوزة</p>
        </div>
      </div>

      {/* Filter */}
      <div className="flex gap-2 mb-6">
        {(["all", "available", "occupied", "reserved"] as const).map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-4 py-2 rounded-full text-sm font-bold transition-all border ${
              filter === status
                ? "bg-gold text-bg-primary border-gold"
                : "bg-bg-secondary text-text-secondary border-bg-tertiary hover:border-text-secondary"
            }`}
          >
            {status === "all" ? `الكل (${stats.total})` : `${STATUS_CONFIG[status].label} (${stats[status]})`}
          </button>
        ))}
      </div>

      {/* Tables Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        {filteredTables.map((table, index) => {
          const config = STATUS_CONFIG[table.status];
          const isSelected = selectedTable?.id === table.id;
          return (
            <motion.div
              key={table.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.03 }}
              onClick={() => setSelectedTable(isSelected ? null : table)}
              className={`relative bg-bg-secondary border-2 rounded-xl p-5 cursor-pointer transition-all duration-300 flex flex-col items-center text-center group hover:-translate-y-1 ${
                isSelected ? "border-gold gold-glow" : config.borderColor
              }`}
            >
              {/* Table Number */}
              <div className={`w-16 h-16 rounded-full flex items-center justify-center text-2xl font-black mb-3 border-2 transition-colors ${config.bgColor} ${config.borderColor} ${config.color}`}>
                {table.number}
              </div>

              {/* Seats */}
              <div className="flex items-center gap-1 text-text-secondary text-xs mb-2">
                <Users size={12} />
                <span>{table.seats} مقاعد</span>
              </div>

              {/* Status Badge */}
              <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${config.bgColor} ${config.color}`}>
                {config.label}
              </span>

              {/* Occupied Info */}
              {table.status === "occupied" && (
                <div className="mt-2 text-xs text-text-secondary flex items-center gap-1">
                  <Clock size={10} />
                  <span>منذ {table.occupiedSince}</span>
                </div>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Selected Table Detail */}
      {selectedTable && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-8 bg-bg-secondary border border-gold/30 rounded-xl p-6 gold-glow"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-text-primary">تفاصيل الطاولة {selectedTable.number}</h3>
            <button onClick={() => setSelectedTable(null)} className="text-text-secondary hover:text-gold"><XCircle size={20} /></button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            <div><p className="text-text-secondary text-xs mb-1">عدد المقاعد</p><p className="text-text-primary font-bold">{selectedTable.seats}</p></div>
            <div><p className="text-text-secondary text-xs mb-1">الحالة</p><p className={`font-bold ${STATUS_CONFIG[selectedTable.status].color}`}>{STATUS_CONFIG[selectedTable.status].label}</p></div>
            {selectedTable.guestCount && <div><p className="text-text-secondary text-xs mb-1">عدد الضيوف</p><p className="text-text-primary font-bold">{selectedTable.guestCount}</p></div>}
            {selectedTable.currentOrder && <div><p className="text-text-secondary text-xs mb-1">الطلب الحالي</p><p className="text-gold font-bold">{selectedTable.currentOrder}</p></div>}
          </div>
          <div className="flex items-center gap-3 border-t border-bg-tertiary pt-4">
            <button className="btn-ghost text-sm py-2 flex items-center gap-2">
              <QrCode size={16} />
              <span>عرض QR Code</span>
            </button>
            {selectedTable.currentOrder && (
              <button className="btn-gold text-sm py-2 flex items-center gap-2">
                <Eye size={16} />
                <span>عرض الطلب</span>
              </button>
            )}
          </div>
        </motion.div>
      )}
    </div>
  );
}
