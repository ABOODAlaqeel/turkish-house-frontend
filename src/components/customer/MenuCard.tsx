"use client";

import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus, Star, Flame, ShoppingCart, X } from "lucide-react";
import { useCartStore } from "@/stores/cart.store";

interface MenuCardProps {
  item: {
    id: string;
    name: string;
    description: string;
    price: number;
    image?: string;
  };
  index: number;
  onPreview: (item: any) => void;
}

export default function MenuCard({ item, index, onPreview }: MenuCardProps) {
  const cartItems = useCartStore((state) => state.items);
  const addItem = useCartStore((state) => state.addItem);
  const removeItem = useCartStore((state) => state.removeItem);

  const cartItem = cartItems.find((ci) => ci.id === item.id);
  const quantityInCart = cartItem ? cartItem.quantity : 0;

  // Local state for quantity to add before putting in cart
  const [localQty, setLocalQty] = useState(1);

  const [imgLoaded, setImgLoaded] = useState(false);
  const [particles, setParticles] = useState<
    { id: number; x: number; y: number; color: string; size: number; rotation: number; startX: number; startY: number }[]
  >([]);
  const cardRef = useRef<HTMLDivElement>(null);

  // --- Gesture References ---
  const [lastClickTime, setLastClickTime] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const isLongPressedRef = useRef(false);
  const lastSparkTimeRef = useRef(0);

  // --- 3D Tilt & Mouse Spark Trail Handler ---
  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -5;
    const rotateY = ((x - centerX) / centerX) * 5;
    cardRef.current.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;

    // Spawn trailing sparks on mouse move (throttled to every 70ms)
    const now = Date.now();
    if (now - lastSparkTimeRef.current > 70) {
      lastSparkTimeRef.current = now;
      const newSpark = {
        id: Math.random() + now,
        x: (Math.random() - 0.5) * 35,
        y: (Math.random() - 0.7) * 45,
        startX: x,
        startY: y,
        color: [
          "bg-amber-400",
          "bg-orange-500",
          "bg-yellow-300",
          "bg-amber-300",
          "bg-orange-400",
        ][Math.floor(Math.random() * 5)],
        size: Math.random() * 3 + 1.5,
        rotation: Math.random() * 360,
      };
      setParticles((prev) => [...prev.slice(-12), newSpark]); // limit active particles
    }
  }, []);

  // --- Touch Move Spark Trail Handler ---
  const handleTouchMove = useCallback((e: React.TouchEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const touch = e.touches[0];
    const rect = cardRef.current.getBoundingClientRect();
    const x = touch.clientX - rect.left;
    const y = touch.clientY - rect.top;

    const now = Date.now();
    if (now - lastSparkTimeRef.current > 75) {
      lastSparkTimeRef.current = now;
      const newSpark = {
        id: Math.random() + now,
        x: (Math.random() - 0.5) * 35,
        y: (Math.random() - 0.7) * 45,
        startX: x,
        startY: y,
        color: [
          "bg-amber-400",
          "bg-orange-500",
          "bg-yellow-300",
          "bg-amber-300",
          "bg-orange-400",
        ][Math.floor(Math.random() * 5)],
        size: Math.random() * 3 + 1.5,
        rotation: Math.random() * 360,
      };
      setParticles((prev) => [...prev.slice(-12), newSpark]);
    }
  }, []);

  const handleMouseLeave = useCallback(() => {
    if (!cardRef.current) return;
    cardRef.current.style.transform =
      "perspective(800px) rotateX(0deg) rotateY(0deg) scale(1)";
    cancelLongPress();
  }, []);

  // --- Long Press Handlers ---
  const startLongPress = (e: React.MouseEvent | React.TouchEvent) => {
    isLongPressedRef.current = false;
    timerRef.current = setTimeout(() => {
      isLongPressedRef.current = true;
      onPreview(item);
    }, 500);
  };

  const cancelLongPress = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  };

  const handleCardClick = (e: React.MouseEvent) => {
    if (isLongPressedRef.current) {
      isLongPressedRef.current = false;
      return;
    }

    const currentTime = Date.now();
    const delay = currentTime - lastClickTime;

    if (delay < 300) {
      onPreview(item);
    }

    setLastClickTime(currentTime);
  };

  // --- Add to Cart Logic ---
  const triggerParticles = (e?: React.MouseEvent) => {
    let startX = 0.7 * (cardRef.current?.offsetWidth || 180);
    let startY = 0.8 * (cardRef.current?.offsetHeight || 280);

    if (e && cardRef.current) {
      const rect = cardRef.current.getBoundingClientRect();
      startX = e.clientX - rect.left;
      startY = e.clientY - rect.top;
    }

    const newParticles = Array.from({ length: 16 }).map((_, i) => ({
      id: Math.random() + i,
      x: (Math.random() - 0.5) * 150,
      y: (Math.random() - 0.8) * 110,
      startX,
      startY,
      color: [
        "bg-amber-400",
        "bg-orange-500",
        "bg-yellow-300",
        "bg-red-800",
        "bg-amber-300",
        "bg-orange-400",
        "bg-yellow-400",
        "bg-red-700",
      ][Math.floor(Math.random() * 8)],
      size: Math.random() * 5 + 2.5,
      rotation: Math.random() * 720,
    }));

    setParticles((prev) => [...prev, ...newParticles]);
    setTimeout(() => {
      setParticles((prev) => prev.filter((p) => !newParticles.includes(p)));
    }, 1200);
  };

  const handleAddClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    for (let i = 0; i < localQty; i++) {
      addItem(item);
    }
    triggerParticles(e);
  };

  const handleLocalIncrease = (e: React.MouseEvent) => {
    e.stopPropagation();
    setLocalQty(localQty + 1);
  };

  const handleLocalDecrease = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (localQty > 1) {
      setLocalQty(localQty - 1);
    }
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    removeItem(item.id);
    setLocalQty(1); // Reset local selection to 1 when removed
  };

  // Placeholder images based on item name
  let imageUrl =
    item.image ||
    "https://images.unsplash.com/photo-1547928576-a4a33237cbc3?auto=format&fit=crop&q=80&w=400";
  if (item.name.includes("مندي") || item.name.includes("مظبي")) {
    imageUrl =
      "https://images.unsplash.com/photo-1628292858544-7f15dbbc4c80?auto=format&fit=crop&q=80&w=400";
  } else if (item.name.includes("عقدة") || item.name.includes("فحسة")) {
    imageUrl =
      "https://images.unsplash.com/photo-1547928576-965be7f5f6a6?auto=format&fit=crop&q=80&w=400";
  } else if (item.name.includes("شاي") || item.name.includes("بيبسي")) {
    imageUrl =
      "https://images.unsplash.com/photo-1576092762791-dd9e2220cad1?auto=format&fit=crop&q=80&w=400";
  }

  // Deterministic rating (4.5 - 4.9) and isPopular
  const rating = (4.5 + (parseInt(item.id.replace(/\D/g, "") || "5") % 5) * 0.1).toFixed(1);
  const isPopular = item.name.includes("سبيشل") || item.name.includes("مشكل") || item.price > 2200;

  return (
    <div className="relative overflow-visible select-none">
      {/* Main Grid Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          type: "spring",
          stiffness: 140,
          damping: 18,
          delay: Math.min(index * 0.03, 0.4),
        }}
        className="w-full relative"
      >
        <div
          ref={cardRef}
          onMouseMove={handleMouseMove}
          onTouchMove={handleTouchMove}
          onMouseLeave={handleMouseLeave}
          onMouseDown={startLongPress}
          onMouseUp={cancelLongPress}
          onTouchStart={startLongPress}
          onTouchEnd={cancelLongPress}
          onClick={handleCardClick}
          className="relative h-[270px] sm:h-[300px] w-full rounded-2xl overflow-hidden group border border-white/5 bg-bg-secondary cursor-pointer shadow-lg transition-colors duration-300 hover:border-white/10"
          style={{
            transformStyle: "preserve-3d",
            transition: "transform 0.15s ease-out, border-color 0.3s ease",
          }}
        >
          {/* Full-bleed Product Image */}
          <div className="absolute inset-0 w-full h-full z-0 bg-bg-tertiary">
            {!imgLoaded && (
              <div className="absolute inset-0 animate-skeleton" />
            )}
            <img
              src={imageUrl}
              alt={item.name}
              loading="lazy"
              onLoad={() => setImgLoaded(true)}
              className={`absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-[800ms] ease-out ${
                imgLoaded ? "opacity-100" : "opacity-0"
              }`}
              style={{
                filter: imgLoaded ? "none" : "blur(10px)",
                transition: "opacity 0.6s ease, filter 0.6s ease, transform 0.8s ease-out",
              }}
            />
            {/* Cinematic dark gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-bg-primary via-bg-primary/60 to-transparent z-10" />
          </div>

          {/* Floating Badges */}
          <div className="absolute top-2.5 right-2.5 z-20 flex flex-col gap-1 items-end pointer-events-none">
            {isPopular && (
              <span className="px-2 py-0.5 rounded-md text-[9px] font-black bg-accent text-bg-primary flex items-center gap-0.5 shadow-md animate-badge-pulse">
                <Flame size={10} className="fill-current" />
                <span>الأكثر طلباً</span>
              </span>
            )}
            <span className="px-1.5 py-0.5 rounded-md text-[9px] font-bold bg-bg-primary/80 backdrop-blur-md border border-white/5 text-accent-light flex items-center gap-0.5 shadow-sm">
              <Star size={10} className="fill-current text-accent-light" />
              <span>{rating}</span>
            </span>
          </div>

          {/* Floating Texts & Actions (sitting at bottom) */}
          <div className="absolute inset-x-0 bottom-0 z-20 p-3 flex flex-col justify-end h-1/2">
            <div>
              <h3 className="text-white font-bold text-sm sm:text-base mb-0.5 group-hover:text-accent transition-colors duration-300 line-clamp-1 drop-shadow-md">
                {item.name}
              </h3>
              <p className="text-text-primary/85 text-[11px] leading-relaxed line-clamp-2 h-7 mb-2 drop-shadow-sm">
                {item.description}
              </p>
            </div>

            {/* Bottom pricing and controls */}
            <div className="flex items-center justify-between mt-1">
              <span className="text-accent font-black text-xs sm:text-sm flex items-baseline gap-0.5 drop-shadow-md">
                {item.price}
                <span className="text-[9px] font-normal text-text-secondary">ر.ي</span>
              </span>

              {/* Add / Quantity Controls */}
              <div
                onClick={(e) => e.stopPropagation()}
                onMouseDown={(e) => e.stopPropagation()}
                onTouchStart={(e) => e.stopPropagation()}
                className="relative z-30"
              >
                <AnimatePresence mode="wait">
                  {quantityInCart > 0 ? (
                    <motion.div
                      key="actions-active"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      transition={{ type: "spring", stiffness: 450, damping: 25 }}
                      className="flex items-center gap-1.5"
                    >
                      {/* Quantity display badge */}
                      <span className="px-2 py-1 rounded-xl bg-accent-light/15 border border-accent-light/25 text-accent-light text-[9px] font-bold shadow-md backdrop-blur-sm">
                        {quantityInCart} في السلة
                      </span>

                      {/* Cancel / Remove Button */}
                      <motion.button
                        whileTap={{ scale: 0.9 }}
                        onClick={handleRemove}
                        className="w-7 h-7 bg-danger/15 hover:bg-danger/25 text-danger border border-danger/25 rounded-xl flex items-center justify-center transition-all shadow-md"
                        title="إلغاء من السلة"
                        aria-label="إلغاء من السلة"
                      >
                        <X size={11} />
                      </motion.button>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="actions-inactive"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      transition={{ type: "spring", stiffness: 450, damping: 25 }}
                      className="flex items-center gap-1.5"
                    >
                      {/* Local Quantity selector (quantity before adding) */}
                      <div className="flex items-center bg-bg-primary/95 border border-bg-tertiary/80 rounded-xl px-0.5 py-0.5 shadow-lg backdrop-blur-sm">
                        <button
                          onClick={handleLocalDecrease}
                          className="w-5.5 h-5.5 flex items-center justify-center text-text-secondary hover:text-accent hover:bg-accent/10 rounded-lg transition-all duration-200"
                          aria-label="تقليل الكمية"
                        >
                          <Minus size={9} />
                        </button>

                        <span className="w-4 text-center text-[11px] font-bold text-white">
                          {localQty}
                        </span>

                        <button
                          onClick={handleLocalIncrease}
                          className="w-5.5 h-5.5 flex items-center justify-center text-text-secondary hover:text-accent hover:bg-accent/10 rounded-lg transition-all duration-200"
                          aria-label="زيادة الكمية"
                        >
                          <Plus size={9} />
                        </button>
                      </div>

                      {/* Add Cart Button */}
                      <motion.button
                        whileTap={{ scale: 0.93 }}
                        onClick={handleAddClick}
                        className="bg-brand/90 hover:bg-brand text-white border border-brand-light/30 w-7 h-7 sm:w-8 sm:h-8 rounded-xl transition-all duration-300 flex items-center justify-center shadow-md hover:shadow-brand/20 relative overflow-hidden group/btn"
                        title="أضف للسلة"
                        aria-label="أضف للسلة"
                      >
                        <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent group-hover/btn:translate-x-full transition-transform duration-700" />
                        <ShoppingCart size={11} />
                      </motion.button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Golden Celebration & Trail Particles (rendered AFTER card to guarantee stacking context on top!) */}
      <AnimatePresence>
        {particles.map((p) => (
          <motion.div
            key={p.id}
            initial={{ x: 0, y: 0, scale: 1, opacity: 1, rotate: 0 }}
            animate={{
              x: p.x,
              y: p.y,
              scale: 0,
              opacity: 0,
              rotate: p.rotation,
            }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.9, ease: "easeOut" }}
            className={`absolute rounded-full z-[99] pointer-events-none ${p.color}`}
            style={{
              left: p.startX,
              top: p.startY,
              width: p.size,
              height: p.size,
              boxShadow: "0 0 8px rgba(232,118,43,0.6)",
            }}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}
