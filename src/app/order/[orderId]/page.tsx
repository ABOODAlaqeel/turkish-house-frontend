"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, Receipt, UtensilsCrossed, Info, Truck } from "lucide-react";
import OrderTracker from "@/components/customer/OrderTracker";
import { useOrderStore } from "@/stores/order.store";

const MOCK_ORDER = {
  id: "8472",
  items: [
    { name: "مندي لحم بلدي", quantity: 2, price: 85 },
    { name: "مظبي دجاج", quantity: 1, price: 45 },
    { name: "بيبسي", quantity: 3, price: 5 },
  ],
  subtotal: 230,
  tax: 34.5,
  deliveryFee: 15,
  total: 279.5,
};

export default function DeliveryOrderTrackingPage({ params }: { params: { orderId: string } }) {
  const [isMounted, setIsMounted] = useState(false);
  const orders = useOrderStore((state) => state.orders);
  
  // Cross-tab auto-sync polling
  useEffect(() => {
    const interval = setInterval(() => {
      useOrderStore.persist.rehydrate();
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => setIsMounted(true), []);

  if (!isMounted) return null;

  const realOrder = orders.find(o => o.id === params.orderId);
  const order = realOrder || MOCK_ORDER;
  const status = realOrder ? realOrder.status : "pending";

  if (!isMounted) return null;

  return (
    <div className="min-h-screen bg-bg-primary pb-20">
      <header className="bg-bg-secondary border-b border-bg-tertiary px-4 py-4 sticky top-0 z-40">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              href="/menu"
              className="w-10 h-10 rounded-full bg-bg-tertiary flex items-center justify-center text-text-secondary hover:text-gold transition-colors"
            >
              <ChevronRight size={20} />
            </Link>
            <div>
              <h1 className="text-text-primary font-bold text-lg leading-none mb-1">تتبع طلب التوصيل</h1>
              <p className="text-text-secondary text-xs">رقم الطلب: #{params.orderId}</p>
            </div>
          </div>
          <div className="text-gold font-bold text-sm bg-gold/10 px-3 py-1 rounded-full border border-gold/20 flex items-center gap-1">
            <Truck size={14} />
            <span>توصيل</span>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-6">
        {/* Status Tracker */}
        <div className="bg-bg-secondary border border-bg-tertiary rounded-lg p-6 mb-6 overflow-hidden relative">
          <AnimatePresence>
            {status === "ready" && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute inset-0 bg-success/5 pointer-events-none" />
            )}
          </AnimatePresence>

          <div className="text-center mb-2">
            <h2 className="text-2xl font-black text-gold mb-1">
              {status === "pending" && "طلبك قيد المراجعة"}
              {status === "confirmed" && "تم تأكيد طلبك!"}
              {status === "preparing" && "طعامك يُحضّر الآن"}
              {status === "ready" && "طلبك في الطريق إليك!"}
            </h2>
            <p className="text-text-secondary text-sm">
              {status === "pending" && "الكاشير يقوم بمراجعة طلبك حالياً."}
              {status === "confirmed" && "تم استلام الطلب وسيتم تحويله للمطبخ."}
              {status === "preparing" && "أمهر الطهاة يقومون بإعداد أطباقك."}
              {status === "ready" && "المندوب في الطريق إليك. بالهناء والشفاء!"}
            </p>
          </div>

          <OrderTracker status={status} />

          {status === "ready" && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              className="mt-6 bg-success/10 border border-success/30 rounded-md p-4 flex gap-3 text-success"
            >
              <Info size={20} className="flex-shrink-0 mt-0.5" />
              <div className="text-sm">
                <p className="font-bold mb-1">سيصلك طلبك خلال دقائق.</p>
                <p className="opacity-80">سيتواصل معك السائق على رقم الجوال المسجل.</p>
              </div>
            </motion.div>
          )}
        </div>

        {/* Order Details */}
        <div className="bg-bg-secondary border border-bg-tertiary rounded-lg p-5">
          <div className="flex items-center gap-2 mb-6 border-b border-bg-tertiary pb-4">
            <Receipt size={20} className="text-gold" />
            <h3 className="font-bold text-text-primary text-lg">تفاصيل الطلب</h3>
          </div>
          <div className="space-y-4 mb-6">
             {MOCK_ORDER.items.map((item, index) => (
              <div key={index} className="flex justify-between items-center text-sm">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded bg-bg-tertiary flex items-center justify-center text-text-primary font-bold text-xs">{item.quantity}x</span>
                  <span className="text-text-primary">{item.name}</span>
                </div>
                <span className="text-text-secondary font-medium">{item.price * item.quantity} ر.ي</span>
              </div>
            ))}
          </div>
          <div className="border-t border-bg-tertiary pt-4 space-y-3 text-sm">
            <div className="flex justify-between text-text-secondary">
              <span>المجموع الفرعي</span><span>{MOCK_ORDER.subtotal.toFixed(2)} ر.ي</span>
            </div>
            <div className="flex justify-between text-text-secondary">
              <span>الضريبة (15%)</span><span>{MOCK_ORDER.tax.toFixed(2)} ر.ي</span>
            </div>
            <div className="flex justify-between text-text-secondary">
              <span>رسوم التوصيل</span><span>{MOCK_ORDER.deliveryFee.toFixed(2)} ر.ي</span>
            </div>
            <div className="flex justify-between font-bold text-lg text-text-primary pt-2">
              <span>الإجمالي</span>
              <span className="text-gold">{MOCK_ORDER.total.toFixed(2)} <span className="text-xs font-normal">ر.ي</span></span>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center">
          <Link href="/menu" className="inline-flex items-center gap-2 text-gold hover:text-gold-light transition-colors font-medium">
            <UtensilsCrossed size={18} />
            <span>طلب جديد؟</span>
          </Link>
        </div>
      </main>
    </div>
  );
}
