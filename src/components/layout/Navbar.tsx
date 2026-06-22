"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { motion, AnimatePresence, useMotionValueEvent, useScroll } from "framer-motion";
import { Menu, X, ShoppingBag, Flame } from "lucide-react";
import ThemeToggle from "@/components/shared/ThemeToggle";

const navLinks = [
  { label: "الرئيسية", href: "#hero" },
  { label: "من نحن", href: "#about" },
  { label: "أطباقنا", href: "#featured" },
  { label: "تواصل معنا", href: "#contact" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("#hero");
  const { scrollY } = useScroll();
  const headerRef = useRef<HTMLElement>(null);

  useMotionValueEvent(scrollY, "change", (latest) => {
    setScrolled(latest > 60);
  });

  // Track active section
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(`#${entry.target.id}`);
          }
        });
      },
      { threshold: 0.3, rootMargin: "-100px 0px -50% 0px" }
    );

    navLinks.forEach((link) => {
      const el = document.querySelector(link.href);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const handleNavClick = (href: string) => {
    setMobileOpen(false);
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      <motion.header
        ref={headerRef}
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
        className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${
          scrolled
            ? "bg-bg-primary/80 backdrop-blur-xl border-b border-white/5 shadow-[0_10px_30px_rgba(0,0,0,0.3)]"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2.5 group">
              <motion.div 
                whileHover={{ rotateY: 15, scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300 }}
                className="perspective-500"
              >
                <img src="/images/logo-full.png" alt="البيت التركي للمشويات" className="w-10 h-10 rounded-sm object-contain" />
              </motion.div>
              <div className="flex flex-col">
                <span className="text-lg font-bold text-text-primary group-hover:text-accent transition-colors duration-300">
                  البيت التركي
                </span>
                <span className="text-[10px] text-text-secondary/60 font-light -mt-0.5 tracking-wider hidden sm:block">
                  TURKISH HOUSE GRILLS
                </span>
              </div>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => (
                <button
                  key={link.href}
                  onClick={() => handleNavClick(link.href)}
                  className={`relative px-4 py-2 text-sm font-medium transition-colors duration-300 rounded-xl ${
                    activeSection === link.href
                      ? "text-accent"
                      : "text-text-secondary hover:text-text-primary"
                  }`}
                >
                  {activeSection === link.href && (
                    <motion.div
                      layoutId="activeNavIndicator"
                      className="absolute inset-0 bg-brand/10 border border-brand/20 shadow-[0_0_15px_rgba(139,36,56,0.15)] rounded-xl"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                  <span className="relative z-10">{link.label}</span>
                </button>
              ))}
            </nav>

            {/* CTA + Theme Toggle + Mobile Toggle */}
            <div className="flex items-center gap-3">
              <ThemeToggle />
              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                <Link
                  href="/menu"
                  className="hidden md:flex btn-gold btn-shimmer text-sm gap-2 rounded-xl border border-brand-light/20 hover:border-brand-light/50 shadow-lg shadow-brand/20"
                >
                  <ShoppingBag size={16} className="relative z-10" />
                  <span className="relative z-10">اعرض المنيو</span>
                </Link>
              </motion.div>

              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={() => setMobileOpen(!mobileOpen)}
                className="md:hidden w-10 h-10 flex items-center justify-center rounded-lg border border-bg-tertiary text-text-secondary hover:text-accent hover:border-accent transition-all duration-300"
                aria-label="القائمة"
              >
                <AnimatePresence mode="wait" initial={false}>
                  {mobileOpen ? (
                    <motion.div
                      key="close"
                      initial={{ rotate: -90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: 90, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <X size={20} />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="menu"
                      initial={{ rotate: 90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: -90, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Menu size={20} />
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.button>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, x: 300 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 300 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed inset-y-0 right-0 z-40 w-72 bg-bg-secondary/90 backdrop-blur-xl border-l border-white/5 flex flex-col pt-20 pb-8 px-6 shadow-2xl"
          >
            {/* Mobile brand */}
            <div className="flex items-center gap-2 mb-8 px-4">
              <Flame size={16} className="text-accent" />
              <span className="text-text-secondary text-xs tracking-widest font-light">البيت التركي للمشويات</span>
            </div>

            <nav className="flex flex-col gap-1 flex-1">
              {navLinks.map((link, i) => (
                <motion.button
                  key={link.href}
                  initial={{ opacity: 0, x: 40 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ 
                    delay: i * 0.08 + 0.1, 
                    type: "spring",
                    stiffness: 300,
                    damping: 25
                  }}
                  onClick={() => handleNavClick(link.href)}
                  className={`text-right py-3 px-4 rounded-xl font-medium transition-all duration-300 ${
                    activeSection === link.href
                      ? "text-accent bg-brand/10 border border-brand/20 shadow-[0_0_10px_rgba(139,36,56,0.1)]"
                      : "text-text-secondary hover:text-accent hover:bg-bg-tertiary border border-transparent"
                  }`}
                >
                  {link.label}
                </motion.button>
              ))}
            </nav>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, type: "spring" }}
            >
              <Link
                href="/menu"
                onClick={() => setMobileOpen(false)}
                className="btn-gold btn-shimmer w-full justify-center mt-4 rounded-xl border border-brand-light/20 shadow-lg shadow-brand/20"
              >
                <ShoppingBag size={16} className="relative z-10" />
                <span className="relative z-10">اعرض المنيو</span>
              </Link>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Backdrop */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={() => setMobileOpen(false)}
            className="fixed inset-0 z-30 bg-bg-primary/70 backdrop-blur-sm md:hidden"
          />
        )}
      </AnimatePresence>
    </>
  );
}
