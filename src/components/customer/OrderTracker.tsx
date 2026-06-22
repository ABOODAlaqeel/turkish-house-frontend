"use client";

import { motion } from "framer-motion";
import { CheckCircle2, Clock, ChefHat, BellRing } from "lucide-react";

export type OrderStatus = "pending" | "confirmed" | "preparing" | "ready" | "completed" | "rejected";

interface OrderTrackerProps {
  status: OrderStatus;
}

export default function OrderTracker({ status }: OrderTrackerProps) {
  const steps = [
    { id: "pending", label: "قيد المراجعة", icon: Clock },
    { id: "confirmed", label: "مؤكد", icon: CheckCircle2 },
    { id: "preparing", label: "قيد التحضير", icon: ChefHat },
    { id: "ready", label: "جاهز", icon: BellRing },
  ];

  let currentStepIndex = steps.findIndex((s) => s.id === status);
  if (status === "completed") currentStepIndex = steps.length - 1; // Show full progress
  if (status === "rejected") currentStepIndex = -1; // Hide progress if rejected

  return (
    <div className="w-full py-8">
      <div className="relative">
        {/* Background Line */}
        <div className="absolute top-6 left-8 right-8 h-1 bg-bg-tertiary rounded-full -z-10" />
        
        {/* Active Line Progress */}
        <motion.div 
          className="absolute top-6 right-8 h-1 bg-gold rounded-full -z-10"
          initial={{ width: "0%" }}
          animate={{ 
            width: `${(currentStepIndex / (steps.length - 1)) * 100}%`,
            left: `${100 - (currentStepIndex / (steps.length - 1)) * 100}%` 
          }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
        />

        {/* Steps */}
        <div className="flex justify-between items-center relative z-10">
          {steps.map((step, index) => {
            const isCompleted = index <= currentStepIndex;
            const isActive = index === currentStepIndex;
            const Icon = step.icon;

            return (
              <div key={step.id} className="flex flex-col items-center gap-3">
                <motion.div 
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: index * 0.1, duration: 0.4 }}
                  className={`w-12 h-12 rounded-full flex items-center justify-center border-4 transition-all duration-500 ${
                    isActive 
                      ? "bg-bg-primary border-gold text-gold shadow-[0_0_15px_rgba(139,36,56,0.3)] scale-110" 
                      : isCompleted
                        ? "bg-brand border-brand text-text-primary"
                        : "bg-bg-secondary border-bg-tertiary text-text-secondary"
                  }`}
                >
                  <Icon size={20} className={isActive ? "animate-pulse" : ""} />
                </motion.div>
                
                <motion.span 
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: index * 0.1 + 0.2, duration: 0.3 }}
                  className={`text-xs sm:text-sm font-bold transition-colors duration-300 ${
                    isActive 
                      ? "text-gold" 
                      : isCompleted
                        ? "text-text-primary"
                        : "text-text-secondary"
                  }`}
                >
                  {step.label}
                </motion.span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
