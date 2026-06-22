"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Search, Navigation, MapPin, ShoppingBag, ChevronLeft, Flame, Star, X, Minus, Plus, Clock, Trash2 } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { gsap } from "gsap";
import CategoryTabs from "@/components/customer/CategoryTabs";
import MenuCard from "@/components/customer/MenuCard";
import { useCartStore } from "@/stores/cart.store";
import { useMenuStore, MenuItemType } from "@/stores/menu.store";
import ThemeToggle from "@/components/shared/ThemeToggle";
import EmberCanvas from "@/components/shared/EmberCanvas";

// --- Props ---
interface MenuContentProps {
  mode: "dine-in" | "delivery";
  tableId?: string;
}

export default function MenuContent({ mode, tableId }: MenuContentProps) {
  const categories = useMenuStore((state) => state.categories);
  const items = useMenuStore((state) => state.items);

  const activeCategories = categories.filter((c) => !c.isDisabled);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  const [previewItem, setPreviewItem] = useState<MenuItemType | null>(null);

  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  // Load recent searches from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("recent_menu_searches");
    if (saved) {
      try {
        setRecentSearches(JSON.parse(saved));
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  const saveSearchTerm = (term: string) => {
    if (!term.trim()) return;
    const cleanTerm = term.trim();
    setRecentSearches((prev) => {
      const filtered = prev.filter((t) => t !== cleanTerm);
      const updated = [cleanTerm, ...filtered].slice(0, 5); // Keep last 5
      localStorage.setItem("recent_menu_searches", JSON.stringify(updated));
      return updated;
    });
  };

  const handleSearchSubmit = (term: string) => {
    setSearchQuery(term);
    saveSearchTerm(term);
    setIsSearchFocused(false);
    inputRef.current?.blur();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearchSubmit(searchQuery);
    }
  };

  const deleteRecentSearch = (term: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setRecentSearches((prev) => {
      const updated = prev.filter((t) => t !== term);
      localStorage.setItem("recent_menu_searches", JSON.stringify(updated));
      return updated;
    });
  };

  const clearAllRecents = (e: React.MouseEvent) => {
    e.stopPropagation();
    setRecentSearches([]);
    localStorage.removeItem("recent_menu_searches");
  };

  const trendingSearches = ["مشاوي مشكل", "كباب لحم", "ورق عنب", "حمص", "بيتزا سلامي"];

  const getTotalItems = useCartStore((state) => state.getTotalItems);
  const getTotalPrice = useCartStore((state) => state.getTotalPrice);
  const [isMounted, setIsMounted] = useState(false);

  const bannerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Sync selected category once mounted or if categories change
  useEffect(() => {
    if (isMounted && activeCategories.length > 0) {
      if (!selectedCategory || !activeCategories.find((c) => c.id === selectedCategory)) {
        setSelectedCategory(activeCategories[0].id);
      }
    }
  }, [isMounted, activeCategories, selectedCategory]);

  // Banner parallax with GSAP
  useEffect(() => {
    if (!bannerRef.current) return;
    const ctx = gsap.context(() => {
      gsap.to(".menu-banner-img", {
        y: 60,
        ease: "none",
        scrollTrigger: {
          trigger: bannerRef.current,
          start: "top top",
          end: "bottom top",
          scrub: 1,
        },
      });
    }, bannerRef);
    return () => ctx.revert();
  }, []);

  const filteredItems = items.filter((item) => {
    const category = categories.find((c) => c.id === item.categoryId);
    if (item.isDisabled || (category && category.isDisabled)) return false;

    const matchesCategory = item.categoryId === selectedCategory;
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase());

    if (searchQuery.trim() !== "") return matchesSearch;
    return matchesCategory;
  });

  const cartLink = mode === "dine-in" ? `/table/${tableId}/cart` : "/cart";

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-bg-primary pb-32 relative"
    >
      {/* === Cinematic Banner === */}
      <div ref={bannerRef} className="relative h-[280px] sm:h-[320px] overflow-hidden">
        {/* Banner Image */}
        <img
          src="/images/hero_bg_1.png"
          alt="البيت التركي"
          className="menu-banner-img absolute inset-0 w-full h-full object-cover"
          style={{ transform: "scale(1.1)" }}
        />

        {/* Dark Overlay Gradient */}
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(
              to bottom,
              rgba(10,6,6,0.45) 0%,
              rgba(10,6,6,0.55) 50%,
              var(--bg-primary) 100%
            )`,
          }}
        />

        {/* Noise */}
        <div className="absolute inset-0 noise-overlay opacity-15" />

        {/* Ember Particles */}
        <EmberCanvas particleCount={20} style={{ zIndex: 5 }} />

        {/* Banner Content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4" style={{ zIndex: 10 }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.7 }}
            className="flex items-center gap-2 mb-3"
          >
            <div className="h-px w-8 bg-gradient-to-r from-transparent to-accent/60" />
            <Flame size={16} className="text-accent" />
            <span className="text-accent text-xs font-semibold tracking-[0.15em]">
              {mode === "dine-in" ? "قائمة طعام الطاولة" : "قائمة التوصيل"}
            </span>
            <Flame size={16} className="text-accent" />
            <div className="h-px w-8 bg-gradient-to-l from-transparent to-accent/60" />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30, clipPath: "inset(100% 0 0 0)" }}
            animate={{ opacity: 1, y: 0, clipPath: "inset(0 0 0 0)" }}
            transition={{ delay: 0.4, duration: 0.8, ease: "easeOut" }}
            className="text-3xl sm:text-4xl font-black text-white mb-2 drop-shadow-[0_2px_20px_rgba(0,0,0,0.5)]"
          >
            البيت التركي <span className="text-gold-gradient">للمشويات</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.6 }}
            className="text-gray-300 text-sm max-w-md"
          >
            اختر من أشهى الأطباق التركية الأصيلة
          </motion.p>

          {mode === "dine-in" && tableId && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.9, duration: 0.4, ease: "backOut" }}
              className="mt-3 inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-accent/10 border border-accent/25 backdrop-blur-sm"
            >
              <MapPin size={12} className="text-accent" />
              <span className="text-accent text-xs font-bold">طاولة رقم {tableId}</span>
            </motion.div>
          )}
        </div>
      </div>

      {/* Sticky Header */}
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 20, delay: 0.3 }}
        className="bg-bg-secondary/85 backdrop-blur-xl border-b border-white/5 px-4 py-4 sticky top-0 z-40"
        style={{
          boxShadow: "0 4px 30px rgba(0,0,0,0.15)",
        }}
      >
        <div className="max-w-3xl mx-auto flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3 group">
              <img
                src="/images/logo-full.png"
                alt="البيت التركي للمشويات"
                className="w-10 h-10 rounded-lg object-contain transition-transform group-hover:rotate-12 group-hover:scale-110 duration-300"
              />
              <div>
                <h2 className="text-text-primary font-bold text-base leading-none mb-1 group-hover:text-accent transition-colors">
                  البيت التركي
                </h2>
                <p className="text-text-secondary text-[11px] flex items-center gap-1">
                  {mode === "dine-in" ? (
                    <>
                      <MapPin size={10} className="text-accent" />
                      <span>طاولة {tableId}</span>
                    </>
                  ) : (
                    <>
                      <Navigation size={10} className="text-accent" />
                      <span>توصيل للعنوان</span>
                    </>
                  )}
                </p>
              </div>
            </Link>
            <ThemeToggle />
          </div>

          {/* Enhanced Search */}
          <motion.div
            animate={{
              scale: isSearchFocused ? 1.02 : 1,
              boxShadow: isSearchFocused
                ? "0 0 0 3px rgba(232,118,43,0.12), 0 0 20px rgba(232,118,43,0.06)"
                : "0 0 0 0 transparent",
            }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
            className="relative rounded-xl z-50"
          >
            <Search
              size={18}
              className={`absolute right-3.5 top-1/2 -translate-y-1/2 transition-colors duration-300 z-10 ${
                isSearchFocused ? "text-accent" : "text-text-secondary"
              }`}
            />
            <input
              ref={inputRef}
              type="text"
              placeholder="ابحث عن أطباقك المفضلة..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setIsSearchFocused(false)}
              onKeyDown={handleKeyDown}
              className="w-full bg-bg-primary/80 border border-bg-tertiary rounded-xl py-3 pr-11 pl-4 text-sm text-text-primary focus:outline-none focus:border-accent/50 transition-all duration-300 placeholder:text-text-secondary/60 relative z-10"
            />

            {/* Smart Search Dropdown */}
            <AnimatePresence>
              {isSearchFocused && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.98 }}
                  transition={{ duration: 0.2 }}
                  onMouseDown={(e) => e.preventDefault()} // Keeps the input focused when clicking items
                  className="absolute left-0 right-0 top-full mt-2 p-4 bg-bg-secondary border border-bg-tertiary rounded-2xl shadow-2xl flex flex-col gap-4 z-40 select-none text-right"
                  style={{ direction: "rtl" }}
                >
                  {/* Trending Searches */}
                  <div>
                    <h3 className="text-xs font-bold text-text-secondary mb-2 flex items-center gap-1.5 justify-start">
                      <Flame size={12} className="text-accent fill-current animate-pulse" />
                      <span>الأكثر بحثاً اليوم</span>
                    </h3>
                    <div className="flex flex-wrap gap-1.5 justify-start">
                      {trendingSearches.map((term) => (
                        <button
                          key={term}
                          onClick={() => handleSearchSubmit(term)}
                          className="px-2.5 py-1.5 rounded-xl bg-bg-primary hover:bg-bg-tertiary border border-bg-tertiary/60 text-[11px] text-text-primary transition-all duration-200 active:scale-95 hover:border-accent/30"
                        >
                          {term}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Recent Searches */}
                  {recentSearches.length > 0 && (
                    <div className="border-t border-bg-tertiary/50 pt-3">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-xs font-bold text-text-secondary flex items-center gap-1.5">
                          <Clock size={12} className="text-text-secondary" />
                          <span>عمليات البحث الأخيرة</span>
                        </h3>
                        <button
                          onClick={clearAllRecents}
                          className="text-[10px] text-accent hover:underline"
                        >
                          مسح الكل
                        </button>
                      </div>
                      <div className="flex flex-col gap-1">
                        {recentSearches.map((term) => (
                          <div
                            key={term}
                            onClick={() => handleSearchSubmit(term)}
                            className="flex items-center justify-between px-2 py-1.5 rounded-lg hover:bg-bg-primary transition-colors cursor-pointer group"
                          >
                            <div className="flex items-center gap-2">
                              <Clock size={11} className="text-text-secondary group-hover:text-accent transition-colors" />
                              <span className="text-xs text-text-primary group-hover:text-accent transition-colors">{term}</span>
                            </div>
                            <button
                              onClick={(e) => deleteRecentSearch(term, e)}
                              className="text-text-secondary hover:text-danger p-1 rounded-md transition-colors"
                              title="حذف من السجل"
                            >
                              <Trash2 size={11} />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </motion.header>

      <main className="max-w-3xl mx-auto relative">
        {/* Subtle Background Ember Layer */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 0 }}>
          <EmberCanvas particleCount={12} style={{ opacity: 0.4 }} />
        </div>

        {/* Categories */}
        {isMounted && searchQuery.trim() === "" && activeCategories.length > 0 && (
          <CategoryTabs
            categories={activeCategories}
            selectedId={selectedCategory}
            onSelect={setSelectedCategory}
          />
        )}

        {/* Menu Items */}
        <div className="px-4 py-6 relative" style={{ zIndex: 1 }}>
          {searchQuery.trim() !== "" && (
            <motion.div
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-2 mb-4"
            >
              <Search size={14} className="text-accent" />
              <h2 className="text-sm font-bold text-text-secondary">
                نتائج البحث عن &quot;{searchQuery}&quot; ({filteredItems.length})
              </h2>
            </motion.div>
          )}

          <AnimatePresence mode="wait">
            {!isMounted ? (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="w-full"
              >
                {/* Premium Loading Skeletons for Grid cards */}
                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
                  {[1, 2, 3, 4, 5, 6].map((i) => (
                    <div
                      key={i}
                      className="relative h-[270px] sm:h-[300px] w-full rounded-2xl border border-bg-tertiary/75 bg-bg-secondary p-3.5 flex flex-col justify-end overflow-hidden animate-pulse"
                    >
                      <div className="space-y-2 relative z-10">
                        <div className="h-4 bg-bg-tertiary rounded w-3/4" />
                        <div className="h-3 bg-bg-tertiary rounded w-full" />
                        <div className="h-3 bg-bg-tertiary rounded w-1/2" />
                        <div className="flex justify-between items-center mt-3 pt-1">
                          <div className="h-3.5 bg-bg-tertiary rounded w-1/4" />
                          <div className="h-7 bg-bg-tertiary rounded w-1/3 rounded-xl" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            ) : filteredItems.length > 0 ? (
              <motion.div
                key={selectedCategory + searchQuery}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.35, ease: "easeOut" }}
                className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 relative z-10"
              >
                {filteredItems.map((item, index) => (
                  <MenuCard key={item.id} item={item} index={index} onPreview={setPreviewItem} />
                ))}
              </motion.div>
            ) : (
              <motion.div
                key="empty-state"
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                className="text-center py-20"
              >
                <motion.div
                  animate={{ rotate: [0, -12, 12, -12, 12, 0] }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                  className="w-20 h-20 rounded-2xl bg-bg-tertiary flex items-center justify-center mx-auto mb-5 text-text-secondary border border-bg-tertiary shadow-lg"
                >
                  <Search size={28} className="text-accent" />
                </motion.div>
                <h3 className="text-text-primary font-bold text-xl mb-2">لا توجد نتائج</h3>
                <p className="text-text-secondary text-sm">جرب البحث بكلمات أخرى</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      {/* === Floating Cart Button === */}
      {isMounted && (
        <AnimatePresence>
          {getTotalItems() > 0 && (
            <motion.div
              initial={{ y: 100, opacity: 0, scale: 0.95 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: 100, opacity: 0, scale: 0.95 }}
              transition={{ type: "spring", stiffness: 350, damping: 25 }}
              className="fixed bottom-6 left-0 right-0 px-4 z-40 max-w-lg mx-auto"
            >
              <Link href={cartLink}>
                <div className="bg-brand text-white rounded-2xl p-4 shadow-2xl shadow-brand/25 flex items-center justify-between overflow-hidden relative group border border-brand-light/20">
                  {/* Shimmer */}
                  <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/15 to-transparent group-hover:animate-shimmer" />

                  <div className="flex items-center gap-4 relative z-10">
                    <div className="relative">
                      <div className="w-11 h-11 rounded-xl bg-white/10 flex items-center justify-center backdrop-blur-sm">
                        <ShoppingBag size={22} />
                      </div>
                      <motion.div
                        key={getTotalItems()}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute -top-2 -right-2 bg-accent text-bg-primary text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center border-2 border-brand shadow-md"
                      >
                        {getTotalItems()}
                      </motion.div>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm font-bold">
                        {mode === "dine-in" ? "عرض السلة" : "مراجعة سلة التوصيل"}
                      </span>
                      <span className="text-xs font-medium opacity-90">
                        {getTotalPrice()} ر.ي
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 relative z-10 bg-white/10 rounded-xl py-2 px-4 group-hover:bg-white/20 transition-colors backdrop-blur-sm">
                    <span className="text-sm font-bold">إتمام الطلب</span>
                    <ChevronLeft
                      size={16}
                      className="group-hover:-translate-x-1 transition-transform"
                    />
                  </div>
                </div>
              </Link>
            </motion.div>
          )}
        </AnimatePresence>
      )}

      {/* === Preview Modal === */}
      <AnimatePresence>
        {previewItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 cursor-default"
            onClick={() => setPreviewItem(null)}
          >
            <motion.div
              initial={{ scale: 0.92, y: 15, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.92, y: 15, opacity: 0 }}
              transition={{ type: "spring", stiffness: 350, damping: 26 }}
              className="relative bg-bg-secondary border border-bg-tertiary w-full max-w-md rounded-3xl overflow-hidden shadow-2xl flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={() => setPreviewItem(null)}
                className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-black/60 hover:bg-black/85 text-white flex items-center justify-center transition-all border border-white/10 hover:scale-105 active:scale-95 shadow-md"
                aria-label="إغلاق"
              >
                <X size={14} />
              </button>

              {/* High-res Image Header */}
              <div className="w-full aspect-[4/3] relative bg-bg-tertiary">
                <img
                  src={
                    previewItem.image ||
                    (previewItem.name.includes("مندي") || previewItem.name.includes("مظبي")
                      ? "https://images.unsplash.com/photo-1628292858544-7f15dbbc4c80?auto=format&fit=crop&q=80&w=400"
                      : previewItem.name.includes("عقدة") || previewItem.name.includes("فحسة")
                      ? "https://images.unsplash.com/photo-1547928576-965be7f5f6a6?auto=format&fit=crop&q=80&w=400"
                      : previewItem.name.includes("شاي") || previewItem.name.includes("بيبسي")
                      ? "https://images.unsplash.com/photo-1576092762791-dd9e2220cad1?auto=format&fit=crop&q=80&w=400"
                      : "https://images.unsplash.com/photo-1547928576-a4a33237cbc3?auto=format&fit=crop&q=80&w=400")
                  }
                  alt={previewItem.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-bg-secondary via-transparent to-transparent" />
                
                {/* Rating Badge inside modal */}
                <div className="absolute bottom-4 right-4 flex items-center gap-1 px-2.5 py-1 rounded-lg bg-bg-primary/85 backdrop-blur-sm border border-white/5 text-accent-light text-xs font-bold shadow-md">
                  <Star size={12} className="fill-current text-accent-light" />
                  <span>
                    {(4.5 + (parseInt(previewItem.id.replace(/\D/g, "") || "5") % 5) * 0.1).toFixed(1)}
                  </span>
                  <span className="text-text-secondary text-[10px] font-normal">/ 5.0</span>
                </div>
              </div>

              {/* Modal Body Info */}
              <div className="p-5 flex flex-col gap-4">
                <div className="flex flex-col gap-1.5">
                  <div className="flex items-center justify-between">
                    <h2 className="text-text-primary text-lg sm:text-xl font-bold">{previewItem.name}</h2>
                    <span className="text-accent font-black text-base sm:text-lg">
                      {previewItem.price} <span className="text-xs font-normal text-text-secondary">ر.ي</span>
                    </span>
                  </div>
                  <p className="text-text-primary/90 text-xs sm:text-sm leading-relaxed">{previewItem.description}</p>
                </div>

                {/* Modal Actions */}
                <div className="flex items-center justify-between gap-4 mt-1 border-t border-bg-tertiary/60 pt-4">
                  <div className="text-[10px] text-text-secondary flex items-center gap-1 pointer-events-none">
                    <Flame size={12} className="text-accent" />
                    <span>معد بالحبّ على الفحم البلدي</span>
                  </div>

                  <div className="flex items-center">
                    <ModalCartControls item={previewItem} />
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// --- Helper component for Modal Cart Operations ---
function ModalCartControls({ item }: { item: MenuItemType }) {
  const cartItems = useCartStore((state) => state.items);
  const addItem = useCartStore((state) => state.addItem);
  const removeItem = useCartStore((state) => state.removeItem);

  const cartItem = cartItems.find((ci) => ci.id === item.id);
  const quantity = cartItem ? cartItem.quantity : 0;

  // Local state for selecting quantity inside modal before adding
  const [localQty, setLocalQty] = useState(1);

  const handleAdd = () => {
    for (let i = 0; i < localQty; i++) {
      addItem(item);
    }
  };

  const handleRemove = () => {
    removeItem(item.id);
    setLocalQty(1);
  };

  if (quantity > 0) {
    return (
      <div className="flex items-center gap-2">
        {/* Quantity display badge */}
        <span className="px-3 py-1.5 rounded-xl bg-accent-light/15 border border-accent-light/25 text-accent-light text-xs font-bold shadow-md">
          {quantity} في السلة
        </span>

        {/* Cancel Button */}
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={handleRemove}
          className="w-8 h-8 bg-danger/15 hover:bg-danger/25 text-danger border border-danger/25 rounded-xl flex items-center justify-center transition-all shadow-md"
          title="إلغاء من السلة"
          aria-label="إلغاء من السلة"
        >
          <X size={13} />
        </motion.button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      {/* Local quantity selector */}
      <div className="flex items-center bg-bg-primary border border-bg-tertiary rounded-xl px-1.5 py-1 shadow-inner">
        <button
          onClick={() => localQty > 1 && setLocalQty(localQty - 1)}
          className="w-6 h-6 flex items-center justify-center text-text-secondary hover:text-accent hover:bg-accent/10 rounded-lg transition-all duration-200"
          aria-label="تقليل الكمية"
        >
          <Minus size={11} />
        </button>
        <span className="w-5 text-center text-xs font-bold text-text-primary">
          {localQty}
        </span>
        <button
          onClick={() => setLocalQty(localQty + 1)}
          className="w-6 h-6 flex items-center justify-center text-text-secondary hover:text-accent hover:bg-accent/10 rounded-lg transition-all duration-200"
          aria-label="زيادة الكمية"
        >
          <Plus size={11} />
        </button>
      </div>

      {/* Cart button */}
      <button
        onClick={handleAdd}
        className="bg-brand hover:bg-brand-light text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1 transition-all shadow-md active:scale-95 relative overflow-hidden group/modalbtn"
        aria-label="إضافة للطلب"
      >
        <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent group-hover/modalbtn:translate-x-full transition-transform duration-700" />
        <Plus size={12} />
        <span>أضف للطلب</span>
      </button>
    </div>
  );
}
