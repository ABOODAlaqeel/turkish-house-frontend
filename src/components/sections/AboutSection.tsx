"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Award, Flame, Leaf, Users } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const features = [
  { icon: Award, title: "جودة استثنائية", desc: "نختار أفضل المكونات الطازجة من مصادر موثوقة" },
  { icon: Flame, title: "مطبوخ بحب", desc: "وصفات تركية أصيلة توارثناها جيلاً بعد جيل" },
  { icon: Leaf, title: "طازج يومياً", desc: "لا نستخدم إلا المكونات الطازجة والطبيعية" },
  { icon: Users, title: "تجربة عائلية", desc: "أجواء دافئة تناسب العائلات والأصدقاء" },
];

// --- 3D Tilt Card ---
function TiltCard({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -8;
    const rotateY = ((x - centerX) / centerX) * 8;
    card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
  }, []);

  const handleMouseLeave = useCallback(() => {
    const card = cardRef.current;
    if (!card) return;
    card.style.transform = 'perspective(800px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
  }, []);

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`transition-transform duration-200 ease-out ${className}`}
      style={{ transformStyle: 'preserve-3d' }}
    >
      {children}
    </div>
  );
}

export default function AboutSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // --- Image curtain reveal ---
      const imageTl = gsap.timeline({
        scrollTrigger: { 
          trigger: ".about-image", 
          start: "top 80%", 
          toggleActions: "play none none reverse" 
        }
      });
      
      // Curtain element reveals first
      imageTl.from(".about-image-curtain", {
        scaleY: 1,
        duration: 0,
      })
      .to(".about-image-curtain", {
        scaleY: 0,
        transformOrigin: "top",
        duration: 1,
        ease: "power3.inOut",
      })
      .from(".about-image-inner", {
        scale: 1.3,
        duration: 1.2,
        ease: "power3.out",
      }, "-=0.8");

      // --- Decorative frame draw-on ---
      gsap.from(".about-frame-line", {
        scrollTrigger: { trigger: ".about-image", start: "top 75%", toggleActions: "play none none reverse" },
        scaleX: 0,
        scaleY: 0,
        stagger: 0.15,
        duration: 0.8,
        ease: "power2.out",
      });

      // --- Content stagger with improved timing ---
      const contentTl = gsap.timeline({
        scrollTrigger: { trigger: ".about-content", start: "top 80%", toggleActions: "play none none reverse" }
      });
      
      contentTl.from(".about-label", {
        opacity: 0, x: 30,
        duration: 0.5, ease: "power3.out",
      })
      .from(".about-heading", {
        opacity: 0, y: 30, clipPath: "inset(100% 0 0 0)",
        duration: 0.8, ease: "power4.out",
      }, "-=0.2")
      .from(".about-divider", {
        width: 0,
        duration: 0.6, ease: "power2.out",
      }, "-=0.3")
      .from(".about-text", {
        opacity: 0, y: 20,
        stagger: 0.15,
        duration: 0.6, ease: "power3.out",
      }, "-=0.2")
      .from(".about-social-proof", {
        opacity: 0, y: 20, scale: 0.95,
        duration: 0.5, ease: "back.out(1.4)",
      }, "-=0.2");

      // --- Feature cards stagger ---
      gsap.from(".feature-card", {
        scrollTrigger: { trigger: ".feature-cards-grid", start: "top 85%", toggleActions: "play none none reverse" },
        y: 40,
        opacity: 0,
        scale: 0.95,
        stagger: 0.12,
        duration: 0.7,
        ease: "back.out(1.4)",
      });

      // --- Floating badge entrance ---
      gsap.from(".about-floating-badge", {
        scrollTrigger: { trigger: ".about-floating-badge", start: "top 90%", toggleActions: "play none none reverse" },
        scale: 0,
        opacity: 0,
        rotation: -15,
        duration: 0.6,
        ease: "back.out(2)",
      });

      // --- Counter animation for badge ---
      gsap.from(".about-counter", {
        scrollTrigger: { trigger: ".about-counter", start: "top 90%", toggleActions: "play none none reverse" },
        textContent: 0,
        duration: 2,
        ease: "power1.inOut",
        snap: { textContent: 1 },
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section id="about" ref={sectionRef} className="py-24 md:py-32 bg-bg-primary relative overflow-hidden">
      {/* Background Accents */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-24 bg-gradient-to-b from-accent/30 to-transparent" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_800px_600px_at_50%_50%,rgba(232,118,43,0.03),transparent)]" />
      
      {/* Floating ember decoration */}
      <div className="ember-bg w-72 h-72 -top-20 -right-20 opacity-30" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Grid: Image + Text */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-20">
          {/* Image */}
          <div className="about-image relative">
            <div className="relative rounded-lg overflow-hidden aspect-[4/5] max-w-md mx-auto lg:mx-0">
              {/* Curtain overlay */}
              <div className="about-image-curtain absolute inset-0 bg-brand z-20 origin-top" />
              
              <div className="about-image-inner absolute inset-0">
                <div className="absolute inset-0 bg-gradient-to-br from-[#1a0d0d] to-bg-secondary" />
                
                {/* Decorative frame with draw-on animation */}
                <div className="about-frame-line absolute inset-4 border border-accent/20 rounded-sm z-10 pointer-events-none origin-center" />
                <div className="about-frame-line absolute top-3 right-3 w-8 h-8 border-t-2 border-r-2 border-accent z-10 pointer-events-none origin-top-right" />
                <div className="about-frame-line absolute bottom-3 left-3 w-8 h-8 border-b-2 border-l-2 border-accent z-10 pointer-events-none origin-bottom-left" />
                
                {/* Placeholder visual */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-accent/10 border border-accent/30 flex items-center justify-center animate-glow-pulse">
                      <Flame size={40} className="text-accent" />
                    </div>
                    <p className="text-text-secondary text-sm">صورة المطعم</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Floating Badge */}
            <div className="about-floating-badge absolute -bottom-4 -right-4 lg:bottom-8 lg:-right-8 bg-bg-secondary border border-accent/30 rounded-lg p-4 animate-float-subtle shadow-lg shadow-brand/10">
              <div className="text-3xl font-black text-accent">١٠+</div>
              <div className="text-text-secondary text-xs mt-1">سنوات من التميز</div>
            </div>
          </div>

          {/* Content */}
          <div className="about-content">
            <span className="about-label text-accent text-sm font-medium tracking-widest uppercase mb-4 block">من نحن</span>
            <h2 className="about-heading section-heading text-right mb-4">
              قصة <span className="text-gold-gradient">شغف</span> وأصالة
            </h2>
            <div className="about-divider gold-divider mr-0 my-6" />
            <p className="about-text text-text-secondary leading-relaxed mb-6">
              منذ أكثر من عشر سنوات، بدأت رحلتنا بحلم بسيط: تقديم المشويات التركية الأصيلة بأعلى معايير الجودة والضيافة.
              اليوم، أصبحنا وجهة يقصدها عشاق المشويات التركية من كل مكان.
            </p>
            <p className="about-text text-text-secondary leading-relaxed mb-8">
              نحن نؤمن بأن الطعام الجيد يبدأ من المكونات الجيدة. لذلك نحرص على اختيار أفضل اللحوم الطازجة والتوابل
              الأصيلة المُستوردة مباشرة من تركيا، لنضمن لكم تجربة طعام لا تُنسى.
            </p>
            <div className="about-social-proof flex items-center gap-4 bg-bg-secondary/50 border border-bg-tertiary rounded-lg p-4">
              <div className="flex -space-x-3 space-x-reverse">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="w-10 h-10 rounded-full bg-bg-tertiary border-2 border-bg-secondary flex items-center justify-center transition-transform hover:scale-110 hover:-translate-y-1 duration-300">
                    <Users size={14} className="text-accent" />
                  </div>
                ))}
              </div>
              <div>
                <div className="text-text-primary font-semibold text-sm">+١٠٠٠ زبون راضٍ</div>
                <div className="text-text-secondary text-xs">يثقون في جودتنا</div>
              </div>
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="feature-cards-grid grid grid-cols-2 md:grid-cols-4 gap-4">
          {features.map(({ icon: Icon, title, desc }) => (
            <TiltCard key={title}>
              <div className="feature-card bg-bg-secondary border border-bg-tertiary rounded-lg p-6 text-center hover:border-accent/30 hover:bg-bg-tertiary transition-all duration-300 group cursor-default h-full">
                <div className="w-12 h-12 mx-auto mb-4 rounded-lg bg-accent/10 border border-accent/20 flex items-center justify-center group-hover:bg-accent/20 group-hover:scale-110 transition-all duration-300">
                  <Icon size={22} className="text-accent group-hover:rotate-12 transition-transform duration-300" />
                </div>
                <h3 className="text-text-primary font-semibold text-sm mb-2">{title}</h3>
                <p className="text-text-secondary text-xs leading-relaxed">{desc}</p>
              </div>
            </TiltCard>
          ))}
        </div>
      </div>
    </section>
  );
}
