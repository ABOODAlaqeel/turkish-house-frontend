"use client";

import { Minus, Plus, Trash2, Edit3 } from "lucide-react";
import { useCartStore, CartItemType } from "@/stores/cart.store";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface CartItemProps {
  item: CartItemType;
}

export default function CartItem({ item }: CartItemProps) {
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const removeItem = useCartStore((state) => state.removeItem);
  const updateNotes = useCartStore((state) => state.updateNotes);

  const [showNotes, setShowNotes] = useState(false);

  const handleDecrease = () => updateQuantity(item.id, item.quantity - 1);
  const handleIncrease = () => updateQuantity(item.id, item.quantity + 1);
  const handleRemove = () => removeItem(item.id);

  // Select item image based on name (or fallback)
  let imageUrl = item.image || "https://images.unsplash.com/photo-1547928576-a4a33237cbc3?auto=format&fit=crop&q=80&w=150";
  if (item.name.includes("مندي") || item.name.includes("مظبي")) {
    imageUrl = "https://images.unsplash.com/photo-1628292858544-7f15dbbc4c80?auto=format&fit=crop&q=80&w=150"; 
  } else if (item.name.includes("عقدة") || item.name.includes("فحسة")) {
    imageUrl = "https://images.unsplash.com/photo-1547928576-965be7f5f6a6?auto=format&fit=crop&q=80&w=150"; 
  } else if (item.name.includes("شاي") || item.name.includes("بيبسي")) {
    imageUrl = "https://images.unsplash.com/photo-1576092762791-dd9e2220cad1?auto=format&fit=crop&q=80&w=150"; 
  }

  return (
    <motion.div 
      layout
      initial={{ opacity: 0, x: 50, scale: 0.95 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: -50, scale: 0.95, transition: { duration: 0.2 } }}
      className="bg-bg-secondary border border-bg-tertiary rounded-lg p-4 flex flex-col gap-3 hover:border-brand/20 transition-colors duration-300"
    >
      <div className="flex justify-between items-start">
        <div className="flex gap-3">
          <div className="w-16 h-16 bg-bg-tertiary rounded-md flex-shrink-0 overflow-hidden relative border border-bg-tertiary">
            <img src={imageUrl} alt={item.name} className="w-full h-full object-cover" />
          </div>
          <div>
            <h4 className="text-text-primary font-bold text-sm mb-1">{item.name}</h4>
            <div className="text-accent font-bold text-sm">
              {item.price * item.quantity} <span className="text-xs font-normal text-text-secondary">ر.ي</span>
            </div>
            {item.notes && !showNotes && (
              <p className="text-text-secondary text-xs mt-1 italic pr-2 border-r border-accent">ملاحظة: {item.notes}</p>
            )}
          </div>
        </div>

        <button 
          onClick={handleRemove}
          className="w-8 h-8 flex items-center justify-center text-text-secondary hover:text-danger hover:bg-danger/10 rounded-sm transition-colors"
          aria-label="حذف"
        >
          <Trash2 size={16} />
        </button>
      </div>

      <div className="flex items-center justify-between border-t border-bg-tertiary pt-3 mt-1">
        <button 
          onClick={() => setShowNotes(!showNotes)}
          className={`flex items-center gap-1.5 text-xs font-medium transition-colors ${
            item.notes ? "text-accent" : "text-text-secondary hover:text-text-primary"
          }`}
        >
          <Edit3 size={14} />
          <span>{item.notes ? "تعديل الملاحظة" : "إضافة ملاحظة"}</span>
        </button>

        <div className="flex items-center gap-3 bg-bg-primary rounded-full p-1 border border-bg-tertiary">
          <button 
            onClick={handleDecrease}
            className="w-7 h-7 rounded-full bg-bg-secondary flex items-center justify-center text-text-primary hover:text-accent transition-colors"
          >
            <Minus size={14} />
          </button>
          
          <div className="w-4 h-5 relative flex items-center justify-center overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.span 
                key={item.quantity}
                initial={{ y: -8, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 8, opacity: 0 }}
                transition={{ duration: 0.15 }}
                className="text-sm font-bold text-center absolute"
              >
                {item.quantity}
              </motion.span>
            </AnimatePresence>
          </div>

          <button 
            onClick={handleIncrease}
            className="w-7 h-7 rounded-full bg-brand text-white flex items-center justify-center transition-transform active:scale-95"
          >
            <Plus size={14} />
          </button>
        </div>
      </div>

      <AnimatePresence>
        {showNotes && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="pt-2 flex gap-2">
              <input
                type="text"
                defaultValue={item.notes || ""}
                onBlur={(e) => updateNotes(item.id, e.target.value)}
                placeholder="بدون بصل، زيادة شطة..."
                className="flex-1 bg-bg-primary border border-bg-tertiary rounded px-3 py-1.5 text-xs text-text-primary focus:outline-none focus:border-accent input-glow transition-all duration-300"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
