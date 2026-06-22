"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ChevronDown, ShoppingBag, Star, Flame, Utensils } from "lucide-react";
import EmberCanvas from "@/components/shared/EmberCanvas";

gsap.registerPlugin(ScrollTrigger);

// --- Animated Counter Component ---
function AnimatedCounter({ target }: { target: string }) {
  const [displayed, setDisplayed] = useState("٠");
  useEffect(() => {
    const a2e = (s: string) =>
      s.replace(/[٠-٩]/g, (d) => "٠١٢٣٤٥٦٧٨٩".indexOf(d).toString());
    const e2a = (n: number) =>
      n.toString().replace(/[0-9]/g, (d) => "٠١٢٣٤٥٦٧٨٩"[parseInt(d)]);
    const num = parseInt(a2e(target.replace(/[^٠-٩0-9]/g, "")), 10);
    if (isNaN(num)) {
      setDisplayed(target);
      return;
    }
    const prefix = target.startsWith("+") ? "+" : "";
    const start = performance.now();
    const dur = 2200;
    const step = (now: number) => {
      const p = Math.min((now - start) / dur, 1);
      const ease = 1 - Math.pow(1 - p, 3);
      setDisplayed(prefix + e2a(Math.floor(ease * num)));
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [target]);
  return <span>{displayed}</span>;
}

// --- Floating Geometric Shapes ---
function FloatingShapes() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" style={{ zIndex: 8 }}>
      {/* Ornamental lines */}
      <div className="absolute top-[15%] right-[10%] w-32 h-px bg-gradient-to-l from-transparent via-accent/20 to-transparent animate-float-subtle" style={{ animationDelay: "0s" }} />
      <div className="absolute top-[35%] left-[8%] w-24 h-px bg-gradient-to-r from-transparent via-brand/20 to-transparent animate-float-subtle" style={{ animationDelay: "2s" }} />
      <div className="absolute bottom-[30%] right-[15%] w-20 h-px bg-gradient-to-l from-transparent via-accent/15 to-transparent animate-float-subtle" style={{ animationDelay: "4s" }} />

      {/* Glowing dots */}
      <div className="absolute top-[20%] right-[20%] w-1.5 h-1.5 rounded-full bg-accent/30 animate-float" style={{ animationDelay: "1s" }} />
      <div className="absolute top-[50%] left-[15%] w-1 h-1 rounded-full bg-brand/40 animate-float" style={{ animationDelay: "3s" }} />
      <div className="absolute bottom-[25%] right-[30%] w-2 h-2 rounded-full bg-accent/20 animate-float" style={{ animationDelay: "5s" }} />

      {/* Decorative corner ornaments */}
      <div className="absolute top-16 right-8 w-16 h-16 border-t border-r border-accent/10 rounded-tr-sm opacity-40" />
      <div className="absolute bottom-32 left-8 w-16 h-16 border-b border-l border-brand/10 rounded-bl-sm opacity-40" />
    </div>
  );
}

export default function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [countersVisible, setCountersVisible] = useState(false);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [currentImage, setCurrentImage] = useState(0);

  const heroImages = [
    "/images/hero_bg_1.png",
    "/images/hero_bg_2.png",
    "/images/hero_bg_3.png",
  ];

  // Image slideshow
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % heroImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [heroImages.length]);

  // GSAP Animations
  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ delay: 0.6 });

      // Badge entrance
      tl.from(".hero-badge", {
        opacity: 0,
        y: 30,
        scale: 0.9,
        duration: 0.7,
        ease: "back.out(1.7)",
      })
        // Title reveal
        .from(".hero-title-line", {
          opacity: 0,
          y: 60,
          clipPath: "inset(100% 0 0 0)",
          stagger: 0.2,
          duration: 1,
          ease: "power4.out",
        }, "-=0.3")
        // Divider
        .from(".hero-divider-line", {
          width: 0,
          opacity: 0,
          stagger: 0.15,
          duration: 0.6,
          ease: "power2.out",
        }, "-=0.4")
        .from(".hero-divider-text", {
          opacity: 0,
          scale: 0.8,
          duration: 0.5,
          ease: "back.out(1.4)",
        }, "-=0.3")
        // Subtitle
        .from(".hero-subtitle", {
          opacity: 0,
          y: 25,
          duration: 0.7,
          ease: "power3.out",
        }, "-=0.2")
        // CTA Buttons
        .from(".hero-cta-btn", {
          opacity: 0,
          y: 30,
          scale: 0.95,
          stagger: 0.12,
          duration: 0.6,
          ease: "back.out(1.4)",
        }, "-=0.3")
        // Stats
        .add(() => setCountersVisible(true))
        .from(".hero-stat", {
          opacity: 0,
          y: 30,
          scale: 0.9,
          stagger: 0.1,
          duration: 0.5,
          ease: "back.out(1.7)",
        }, "-=0.3")
        // Decorative
        .from(".hero-decor", {
          opacity: 0,
          scale: 0,
          stagger: 0.08,
          duration: 0.4,
          ease: "back.out(2)",
        }, "-=0.5");

      // Parallax on scroll
      gsap.to(".hero-bg-layer", {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "bottom top",
          scrub: 1,
        },
        y: 150,
        scale: 1.1,
        ease: "none",
      });

      // Content fade on scroll
      gsap.to(".hero-content", {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "center center",
          end: "bottom top",
          scrub: 1,
        },
        y: -50,
        opacity: 0,
        ease: "none",
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  const scrollToMenu = () => {
    document.querySelector("#featured")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      id="hero"
      ref={sectionRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* === Background Layer === */}
      <div className="hero-bg-layer absolute inset-0">
        {/* Video Background */}
        <video
          autoPlay
          loop
          muted
          playsInline
          onCanPlayThrough={() => setVideoLoaded(true)}
          className="absolute inset-0 w-full h-full object-cover"
          style={{
            transform: "scale(1.08)",
            opacity: videoLoaded ? 0.75 : 0,
            transition: "opacity 1.5s ease",
          }}
        >
          <source src="/images/grill_video.mp4" type="video/mp4" />
        </video>

        {/* Image Slideshow (behind video, shows through blending) */}
        {heroImages.map((src, i) => (
          <img
            key={src}
            src={src}
            alt=""
            className="absolute inset-0 w-full h-full object-cover"
            style={{
              opacity: currentImage === i ? 0.3 : 0,
              transition: "opacity 2s ease-in-out",
              transform: "scale(1.05)",
              mixBlendMode: "overlay",
            }}
          />
        ))}

        {/* Fallback gradient */}
        <div
          className="absolute inset-0 bg-gradient-to-br from-[#0a0606] via-[#1a0d0d] to-[#120808]"
          style={{
            opacity: videoLoaded ? 0 : 1,
            transition: "opacity 2s ease",
          }}
        />

        {/* Ambient glows */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-brand/[0.08] rounded-full blur-[140px] animate-glow-pulse" />
        <div className="absolute -top-20 -right-20 w-[450px] h-[450px] bg-accent/[0.06] rounded-full blur-[120px] animate-float-subtle" />
        <div className="absolute -bottom-20 -left-20 w-[400px] h-[400px] bg-brand/[0.07] rounded-full blur-[120px] animate-float" style={{ animationDelay: "2s" }} />

        {/* Geometric pattern */}
        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage: `radial-gradient(circle at 25% 25%, rgba(232,118,43,0.3) 1px, transparent 1px),
                              radial-gradient(circle at 75% 75%, rgba(139,36,56,0.3) 1px, transparent 1px)`,
            backgroundSize: "60px 60px",
          }}
        />
      </div>

      {/* Cinematic Overlay */}
      <div
        className="absolute inset-0"
        style={{
          zIndex: 5,
          background: `linear-gradient(
            to bottom,
            rgba(10,6,6,0.60) 0%,
            rgba(10,6,6,0.35) 30%,
            rgba(10,6,6,0.30) 50%,
            rgba(10,6,6,0.75) 80%,
            rgba(10,6,6,0.95) 100%
          )`,
        }}
      />

      {/* Noise Texture */}
      <div className="absolute inset-0 noise-overlay opacity-20" style={{ zIndex: 6 }} />

      {/* Floating Particles (CSS) */}
      <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 7 }}>
        {[...Array(8)].map((_, i) => (
          <div key={i} className="hero-particle" />
        ))}
      </div>

      {/* Smoke Wisps */}
      <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 7 }}>
        {[...Array(3)].map((_, i) => (
          <div key={i} className="smoke-wisp" />
        ))}
      </div>

      {/* Canvas Ember Particles */}
      <EmberCanvas particleCount={50} style={{ zIndex: 16 }} />

      {/* Floating Geometric Shapes */}
      <FloatingShapes />

      {/* Golden vignette */}
      <div
        className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_35%,rgba(10,6,6,0.9)_100%)]"
        style={{ zIndex: 10 }}
      />

      {/* === Content === */}
      <div className="hero-content relative max-w-4xl mx-auto px-4 sm:px-6 text-center" style={{ zIndex: 25 }}>
        {/* Premium Badge */}
        <div className="hero-badge inline-flex items-center gap-2.5 px-6 py-2.5 rounded-full border border-accent/30 bg-accent/[0.08] backdrop-blur-md mb-8 animate-badge-pulse">
          <Star size={14} className="text-accent fill-accent" />
          <span className="text-accent text-sm font-semibold tracking-wide">
            تجربة طعام لا تُنسى
          </span>
          <Star size={14} className="text-accent fill-accent" />
        </div>

        {/* Title */}
        <h1 className="mb-6">
          <span className="hero-title-line block text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black text-text-primary leading-tight drop-shadow-[0_4px_30px_rgba(0,0,0,0.5)]">
            البيت التركي
          </span>
          <span className="hero-title-line block text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black leading-tight">
            <span
              className="text-gold-gradient animate-gradient-flow"
              style={{ backgroundSize: "200% 200%" }}
            >
              للمشويات
            </span>
          </span>
        </h1>

        {/* Divider */}
        <div className="flex items-center justify-center gap-4 mb-5">
          <div className="hero-divider-line h-px w-20 bg-gradient-to-r from-transparent to-accent/60" />
          <div className="hero-divider-text flex items-center gap-2">
            <Flame size={18} className="text-accent/80" />
            <span className="text-accent/80 text-lg font-light tracking-[0.2em]">
              مشويات فاخرة
            </span>
            <Flame size={18} className="text-accent/80" />
          </div>
          <div className="hero-divider-line h-px w-20 bg-gradient-to-l from-transparent to-accent/60" />
        </div>

        {/* Subtitle */}
        <p className="hero-subtitle text-text-secondary text-base sm:text-lg md:text-xl leading-relaxed max-w-2xl mx-auto mb-12">
          أشهى المشويات التركية الأصيلة، محضّرة بأجود المكونات وعلى يد أمهر
          الطهاة. اطلب طعامك بسهولة من طاولتك.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-14">
          <Link
            href="/menu"
            className="hero-cta-btn btn-gold btn-shimmer text-base px-10 py-4 gap-3 font-bold z-10 rounded-xl shadow-lg shadow-brand/30"
          >
            <ShoppingBag size={20} className="relative z-10" />
            <span className="relative z-10">اعرض المنيو الآن</span>
          </Link>
          <button
            onClick={scrollToMenu}
            className="hero-cta-btn btn-ghost text-base px-10 py-4 gap-3 rounded-xl group backdrop-blur-sm"
          >
            <Utensils
              size={20}
              className="group-hover:rotate-12 transition-transform duration-300"
            />
            <span>اعرف أكثر</span>
          </button>
        </div>

        {/* Stats */}
        <div className="flex items-center justify-center gap-8 sm:gap-14">
          {[
            { value: "+٥٠", label: "طبق أصيل", icon: "🍖" },
            { value: "+١٠٠٠", label: "زبون سعيد", icon: "⭐" },
            { value: "١٠", label: "سنوات خبرة", icon: "🏆" },
          ].map((stat) => (
            <div key={stat.label} className="hero-stat text-center group">
              <div className="text-lg mb-1">{stat.icon}</div>
              <div className="text-2xl sm:text-3xl font-black text-accent group-hover:scale-110 transition-transform duration-300">
                {countersVisible ? (
                  <AnimatedCounter target={stat.value} />
                ) : (
                  <span className="opacity-0">{stat.value}</span>
                )}
              </div>
              <div className="text-text-secondary text-xs sm:text-sm mt-1 font-medium">
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* Decorative elements */}
        <div className="hero-decor absolute top-1/4 -right-4 sm:right-4 opacity-20">
          <div className="w-8 h-8 border border-accent/30 rounded-sm rotate-45 animate-float" style={{ animationDelay: "1s" }} />
        </div>
        <div className="hero-decor absolute bottom-1/4 -left-4 sm:left-4 opacity-20">
          <div className="w-6 h-6 border border-brand/30 rounded-full animate-float" style={{ animationDelay: "3s" }} />
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.button
        onClick={scrollToMenu}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-text-secondary hover:text-accent transition-colors duration-300 group"
        animate={{ y: [0, 8, 0] }}
        transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
        style={{ zIndex: 25 }}
      >
        <span className="text-xs tracking-widest font-light">اكتشف أكثر</span>
        <ChevronDown
          size={20}
          className="group-hover:text-accent transition-colors"
        />
      </motion.button>
    </section>
  );
}
