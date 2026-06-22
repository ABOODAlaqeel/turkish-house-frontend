"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronRight, ShoppingBag, ArrowLeft, Receipt, CheckCircle2, MapPin, Phone, Wallet, Banknote, CreditCard } from "lucide-react";
import { useCartStore } from "@/stores/cart.store";
import { useOrderStore, GlobalOrder } from "@/stores/order.store";
import CartItem from "@/components/customer/CartItem";
import { AnimatePresence, motion } from "framer-motion";

type PaymentMethod = "cash" | "wallet" | null;

interface SmartCartProps {
  mode: "dine-in" | "delivery";
  tableId?: string;
}

const listVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08
    }
  }
};

export default function SmartCart({ mode, tableId }: SmartCartProps) {
  const router = useRouter();
  const items = useCartStore((state) => state.items);
  const getTotalPrice = useCartStore((state) => state.getTotalPrice);
  const clearCart = useCartStore((state) => state.clearCart);
  const placeOrder = useOrderStore((state) => state.placeOrder);

  const [isMounted, setIsMounted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(null);
  const [showSuccessOverlay, setShowSuccessOverlay] = useState(false);

  // Delivery specific fields
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");

  useEffect(() => setIsMounted(true), []);
  if (!isMounted) return null;

  const subtotal = getTotalPrice();
  const tax = subtotal * 0.15;
  const deliveryFee = mode === "delivery" ? 15 : 0;
  const total = subtotal + tax + deliveryFee;

  const menuLink = mode === "dine-in" ? `/table/${tableId}/menu` : "/menu";

  const handleSubmitOrder = async () => {
    // Validation
    if (!paymentMethod) {
      setError("الرجاء اختيار طريقة الدفع.");
      return;
    }
    if (mode === "delivery" && (!address.trim() || !phone.trim())) {
      setError("الرجاء إدخال رقم الجوال وعنوان التوصيل.");
      return;
    }
    setError("");
    setIsSubmitting(true);

    // Create the global order
    const orderId = Math.floor(Math.random() * 90000 + 10000).toString(); // 5 digit ID
    const newOrder: GlobalOrder = {
      id: orderId,
      type: mode,
      tableNumber: tableId,
      customerPhone: phone,
      customerAddress: address,
      items: items.map(i => ({ id: i.id, name: i.name, price: i.price, quantity: i.quantity, notes: i.notes })),
      subtotal,
      tax,
      deliveryFee,
      total,
      status: "pending",
      paymentMethod,
      createdAt: new Date().toLocaleTimeString("ar-SA", { hour: "2-digit", minute: "2-digit" })
    };

    // Save to Simulator Database
    placeOrder(newOrder);

    // Mock API call delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    setIsSubmitting(false);
    setShowSuccessOverlay(true);
    clearCart();

    // Delay redirection to let success animation finish
    setTimeout(() => {
      if (mode === "dine-in") {
        router.push(`/table/${tableId}/order/${orderId}`);
      } else {
        router.push(`/order/${orderId}`);
      }
    }, 2200);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, x: -30 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 30 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className="min-h-screen bg-bg-primary pb-32"
    >
      {/* Header */}
      <header className="bg-bg-secondary/90 backdrop-blur-md border-b border-bg-tertiary px-4 py-4 sticky top-0 z-40">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              href={menuLink}
              className="w-10 h-10 rounded-full bg-bg-tertiary flex items-center justify-center text-text-secondary hover:text-accent hover:scale-105 transition-all duration-300"
            >
              <ChevronRight size={20} />
            </Link>
            <h1 className="text-text-primary font-bold text-lg">
              {mode === "dine-in" ? "سلة الطلبات" : "سلة التوصيل"}
            </h1>
          </div>
          {mode === "dine-in" && (
            <div className="text-accent font-bold text-sm bg-accent/10 px-3 py-1 rounded-full border border-accent/20 animate-badge-pulse">
              طاولة {tableId}
            </div>
          )}
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-6">
        {items.length === 0 ? (
          /* Empty Cart */
          <motion.div 
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="flex flex-col items-center justify-center py-20 text-center"
          >
            <motion.div 
              animate={{ y: [0, -8, 0] }}
              transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
              className="w-20 h-20 bg-bg-secondary border border-bg-tertiary rounded-full flex items-center justify-center text-accent mb-6"
            >
              <ShoppingBag size={32} />
            </motion.div>
            <h2 className="text-xl font-bold text-text-primary mb-2">سلتك فارغة</h2>
            <p className="text-text-secondary mb-8 max-w-xs mx-auto leading-relaxed">
              لم تقم بإضافة أي أطباق بعد. تصفح المنيو واختر ما يعجبك.
            </p>
            <Link href={menuLink} className="btn-gold justify-center px-8 btn-shimmer rounded">
              <ArrowLeft size={18} />
              <span>العودة للمنيو</span>
            </Link>
          </motion.div>
        ) : (
          <div className="flex flex-col gap-6">

            {/* Delivery Info (Only for delivery mode) */}
            {mode === "delivery" && (
              <motion.div 
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-bg-secondary border border-bg-tertiary rounded-lg p-5"
              >
                <h2 className="text-sm font-bold text-text-primary mb-4 flex items-center gap-2">
                  <MapPin size={16} className="text-accent" />
                  معلومات التوصيل
                </h2>
                <div className="space-y-4">
                  <div>
                    <label htmlFor="phone" className="block text-xs font-medium text-text-secondary mb-1">رقم الجوال</label>
                    <div className="relative">
                      <Phone size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary" />
                      <input
                        type="tel"
                        id="phone"
                        dir="ltr"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="05X XXX XXXX"
                        className="w-full bg-bg-primary border border-bg-tertiary rounded py-2.5 pr-10 pl-4 text-sm text-text-primary focus:outline-none transition-all duration-300 text-right input-glow"
                      />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="address" className="block text-xs font-medium text-text-secondary mb-1">عنوان التوصيل</label>
                    <textarea
                      id="address"
                      rows={2}
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="الحي، الشارع، رقم المبنى..."
                      className="w-full bg-bg-primary border border-bg-tertiary rounded px-3 py-2 text-sm text-text-primary focus:outline-none resize-none transition-all duration-300 input-glow"
                    />
                  </div>
                </div>
              </motion.div>
            )}

            {/* Items List Staggered */}
            <div className="flex flex-col gap-4">
              <h2 className="text-sm font-bold text-text-secondary">عناصر الطلب ({items.length})</h2>
              <motion.div 
                variants={listVariants}
                initial="hidden"
                animate="show"
                className="flex flex-col gap-4"
              >
                <AnimatePresence mode="popLayout">
                  {items.map(item => (
                    <CartItem key={item.id} item={item} />
                  ))}
                </AnimatePresence>
              </motion.div>
            </div>

            {/* Payment Method selection with spring scales */}
            <div className="bg-bg-secondary border border-bg-tertiary rounded-lg p-5">
              <h2 className="text-sm font-bold text-text-primary mb-4 flex items-center gap-2">
                <CreditCard size={16} className="text-accent" />
                طريقة الدفع
              </h2>
              <div className="grid grid-cols-2 gap-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  animate={{ scale: paymentMethod === "cash" ? 1.03 : 1 }}
                  onClick={() => { setPaymentMethod("cash"); setError(""); }}
                  className={`flex flex-col items-center gap-2 p-4 rounded-lg border-2 transition-all duration-300 ${
                    paymentMethod === "cash"
                      ? "border-accent bg-accent/5 text-accent"
                      : "border-bg-tertiary bg-bg-primary text-text-secondary hover:border-text-secondary"
                  }`}
                >
                  <Banknote size={28} className={paymentMethod === "cash" ? "scale-110 transition-transform" : ""} />
                  <span className="font-bold text-sm">كاش</span>
                  <span className="text-xs opacity-75">
                    {mode === "dine-in" ? "الدفع عند الكاشير" : "الدفع عند الاستلام"}
                  </span>
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  animate={{ scale: paymentMethod === "wallet" ? 1.03 : 1 }}
                  onClick={() => { setPaymentMethod("wallet"); setError(""); }}
                  className={`flex flex-col items-center gap-2 p-4 rounded-lg border-2 transition-all duration-300 ${
                    paymentMethod === "wallet"
                      ? "border-accent bg-accent/5 text-accent"
                      : "border-bg-tertiary bg-bg-primary text-text-secondary hover:border-text-secondary"
                  }`}
                >
                  <Wallet size={28} className={paymentMethod === "wallet" ? "scale-110 transition-transform" : ""} />
                  <span className="font-bold text-sm">محفظة إلكترونية</span>
                  <span className="text-xs opacity-75">Apple Pay / STC Pay</span>
                </motion.button>
              </div>
            </div>

            {/* Error Message */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="bg-danger/10 border border-danger/30 text-danger text-sm p-3 rounded-md font-medium animate-shake"
                >
                  {error}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Order Summary */}
            <div className="bg-bg-secondary border border-bg-tertiary rounded-lg p-5">
              <div className="flex items-center gap-2 mb-4 text-text-primary">
                <Receipt size={18} className="text-accent" />
                <h3 className="font-bold">ملخص الفاتورة</h3>
              </div>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between text-text-secondary">
                  <span>المجموع الفرعي</span>
                  <span>{subtotal.toFixed(2)} ر.ي</span>
                </div>
                <div className="flex justify-between text-text-secondary">
                  <span>الضريبة (15%)</span>
                  <span>{tax.toFixed(2)} ر.ي</span>
                </div>
                {mode === "delivery" && (
                  <div className="flex justify-between text-text-secondary">
                    <span>رسوم التوصيل</span>
                    <span>{deliveryFee.toFixed(2)} ر.ي</span>
                  </div>
                )}
                <div className="border-t border-bg-tertiary pt-3 mt-3 flex justify-between font-bold text-lg text-text-primary">
                  <span>الإجمالي</span>
                  <span className="text-accent flex items-baseline gap-1 font-black text-xl">
                    <AnimatePresence mode="wait">
                      <motion.span
                        key={total}
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 5 }}
                        transition={{ duration: 0.15 }}
                      >
                        {total.toFixed(2)}
                      </motion.span>
                    </AnimatePresence>
                    <span className="text-xs font-normal text-text-secondary">ر.ي</span>
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Checkout Bar */}
      {items.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-bg-primary/90 backdrop-blur-md border-t border-bg-tertiary z-40">
          <div className="max-w-3xl mx-auto">
            <button
              onClick={handleSubmitOrder}
              disabled={isSubmitting}
              className={`w-full relative inline-flex items-center justify-center gap-2 px-6 py-4 rounded-lg font-bold text-white transition-all duration-300 overflow-hidden btn-shimmer ${
                isSubmitting ? "bg-success" : "bg-brand hover:bg-brand-light"
              }`}
            >
              {isSubmitting ? (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-2"
                >
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>جاري تأكيد الطلب...</span>
                </motion.div>
              ) : (
                <div className="flex items-center justify-between w-full">
                  <div className="flex flex-col items-start text-right">
                    <span className="text-sm opacity-90 font-medium">
                      {mode === "dine-in" ? "إرسال الطلب" : "إرسال طلب التوصيل"}
                    </span>
                    <span className="text-[10px] opacity-75 font-normal">
                      {paymentMethod === "cash"
                        ? mode === "dine-in" ? "الدفع عند الكاشير" : "الدفع عند الاستلام"
                        : paymentMethod === "wallet"
                          ? "الدفع عبر المحفظة الإلكترونية"
                          : "اختر طريقة الدفع أعلاه"
                      }
                    </span>
                  </div>
                  <span className="text-lg font-black">{total.toFixed(2)} ر.ي</span>
                </div>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Full-Screen Success Overlay */}
      <AnimatePresence>
        {showSuccessOverlay && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-bg-primary/95 backdrop-blur-md z-50 flex flex-col items-center justify-center p-6 text-center"
          >
            {/* Success icon with pop scaling */}
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: [0.5, 1.15, 1], opacity: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 15 }}
              className="w-24 h-24 rounded-full bg-success/15 border border-success/30 flex items-center justify-center text-success mb-6 relative animate-glow-pulse"
            >
              <CheckCircle2 size={48} />
              <div className="absolute inset-0 rounded-full border border-success animate-ping opacity-20" />
            </motion.div>

            <motion.h2
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
              className="text-2xl font-black text-text-primary mb-3"
            >
              تم إرسال طلبك بنجاح!
            </motion.h2>

            <motion.p
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-text-secondary text-sm max-w-xs leading-relaxed mb-8"
            >
              يجري الآن تجهيز طعامك اللذيذ في مطبخنا. سننقلك إلى صفحة تتبع الطلب...
            </motion.p>
            
            <div className="w-6 h-6 border-2 border-accent border-t-transparent rounded-full animate-spin" />
            
            {/* Confetti falling particles */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
              {Array.from({ length: 30 }).map((_, i) => {
                const delay = Math.random() * 2;
                const left = Math.random() * 100;
                const duration = Math.random() * 2 + 2;
                const size = Math.random() * 8 + 6;
                const colors = ["bg-accent", "bg-brand", "bg-success", "bg-accent-light", "bg-white"];
                const randomColor = colors[Math.floor(Math.random() * colors.length)];
                return (
                  <div
                    key={i}
                    className={`absolute hero-particle rounded-sm ${randomColor}`}
                    style={{
                      width: `${size}px`,
                      height: `${size}px`,
                      left: `${left}%`,
                      top: `-10px`,
                      animation: `particleRise ${duration}s linear infinite`,
                      animationDelay: `${delay}s`,
                      opacity: 0.7
                    }}
                  />
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
