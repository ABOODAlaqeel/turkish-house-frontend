"use client";

import { useRef, useEffect } from "react";
import { motion } from "framer-motion";

interface CategoryTabsProps {
  categories: { id: string; name: string }[];
  selectedId: string;
  onSelect: (id: string) => void;
}

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05
    }
  }
} as const;

const itemVariants = {
  hidden: { opacity: 0, y: 8, scale: 0.95 },
  show: { 
    opacity: 1, 
    y: 0, 
    scale: 1,
    transition: { type: "spring" as const, stiffness: 300, damping: 22 } 
  }
} as const;

export default function CategoryTabs({ categories, selectedId, onSelect }: CategoryTabsProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  // Scroll to active tab on change
  useEffect(() => {
    if (scrollRef.current) {
      const activeTab = scrollRef.current.querySelector('[data-active="true"]') as HTMLElement;
      if (activeTab) {
        const containerLeft = scrollRef.current.offsetLeft;
        const tabLeft = activeTab.offsetLeft;
        scrollRef.current.scrollTo({
          left: tabLeft - containerLeft - 20, // 20px padding
          behavior: 'smooth'
        });
      }
    }
  }, [selectedId]);

  return (
    <div className="relative w-full overflow-hidden border-b border-white/5 bg-bg-primary/95 backdrop-blur-md sticky top-[76px] z-30 pt-4 pb-2">
      <motion.div 
        ref={scrollRef}
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="flex overflow-x-auto hide-scrollbar gap-2 px-4 scroll-smooth"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {categories.map((category) => {
          const isActive = category.id === selectedId;
          return (
            <motion.button
              key={category.id}
              variants={itemVariants}
              data-active={isActive}
              onClick={() => onSelect(category.id)}
              animate={{ scale: isActive ? 1.05 : 1 }}
              whileTap={{ scale: 0.95 }}
              className={`relative px-5 py-2.5 rounded-full whitespace-nowrap text-sm font-medium transition-colors duration-300 ${
                isActive ? "text-white" : "text-text-secondary hover:text-text-primary hover:bg-bg-tertiary"
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="activeCategoryTab"
                  className="absolute inset-0 bg-brand rounded-full"
                  transition={{ type: "spring", stiffness: 380, damping: 28 }}
                />
              )}
              <span className="relative z-10">{category.name}</span>
            </motion.button>
          );
        })}
      </motion.div>
      
      {/* Enhanced fade edges */}
      <div className="absolute left-0 top-0 bottom-0 w-10 bg-gradient-to-r from-bg-primary via-bg-primary/50 to-transparent pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-10 bg-gradient-to-l from-bg-primary via-bg-primary/50 to-transparent pointer-events-none" />
    </div>
  );
}
