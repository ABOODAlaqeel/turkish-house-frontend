"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { MapPin, Phone, Clock, Mail, Send } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

export default function ContactSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [ripples, setRipples] = useState<{ x: number; y: number; id: number }[]>([]);

  const handleRipple = (e: React.MouseEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const newRipple = { x, y, id: Date.now() };
    setRipples((prev) => [...prev, newRipple]);
  };

  useEffect(() => {
    if (ripples.length > 0) {
      const timer = setTimeout(() => {
        setRipples((prev) => prev.slice(1));
      }, 600);
      return () => clearTimeout(timer);
    }
  }, [ripples]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Heading reveal
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: ".contact-header",
          start: "top 85%",
          toggleActions: "play none none reverse"
        }
      });

      tl.from(".contact-badge", {
        y: 15,
        opacity: 0,
        duration: 0.5,
        ease: "power2.out"
      })
      .from(".contact-title", {
        y: 30,
        opacity: 0,
        duration: 0.6,
        ease: "power3.out"
      }, "-=0.3")
      .from(".contact-divider", {
        scaleX: 0,
        transformOrigin: "center",
        duration: 0.5,
        ease: "power2.out"
      }, "-=0.3");

      // Contact info items stagger reveal (RTL-friendly slide from right)
      gsap.from(".contact-card", {
        scrollTrigger: { 
          trigger: ".contact-info", 
          start: "top 85%", 
          toggleActions: "play none none reverse" 
        },
        x: 50,
        opacity: 0,
        stagger: 0.12,
        duration: 0.8,
        ease: "power3.out",
      });
      
      // Contact form slide-in from left
      gsap.from(".contact-form", {
        scrollTrigger: { 
          trigger: ".contact-form", 
          start: "top 85%", 
          toggleActions: "play none none reverse" 
        },
        x: -50,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out",
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section id="contact" ref={sectionRef} className="py-24 bg-bg-primary relative overflow-hidden">
      {/* Background Decor Orbs */}
      <div className="absolute top-1/4 right-0 w-[500px] h-[500px] bg-brand/5 rounded-full blur-[150px] pointer-events-none animate-float-subtle" />
      <div className="absolute bottom-1/4 left-0 w-[400px] h-[400px] bg-accent/5 rounded-full blur-[120px] pointer-events-none animate-float" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <div className="contact-header text-center mb-16">
          <span className="contact-badge text-accent text-sm font-semibold tracking-widest uppercase mb-3 block animate-badge-pulse bg-accent/10 border border-accent/20 px-3 py-1 rounded-full w-max mx-auto">
            نسعد بخدمتكم
          </span>
          <h2 className="contact-title section-heading">
            تواصل <span className="text-gold-gradient font-black">معنا</span>
          </h2>
          <div className="contact-divider gold-divider" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          
          {/* Contact Info */}
          <div className="contact-info space-y-6">
            
            {/* Card 1: Map */}
            <div className="contact-card flex items-start gap-4 p-5 rounded-2xl bg-bg-secondary/40 backdrop-blur-sm border border-white/5 hover:border-brand/35 transition-all duration-500 hover:bg-bg-secondary/60 hover:-translate-y-1.5 hover:shadow-[0_15px_35px_rgba(139,36,56,0.15)] group">
              <div className="w-12 h-12 rounded-xl bg-brand/10 border border-brand/20 flex items-center justify-center flex-shrink-0 text-accent group-hover:text-white group-hover:bg-brand group-hover:border-brand transition-all duration-500">
                <MapPin size={22} className="group-hover:animate-bounce" />
              </div>
              <div>
                <h3 className="text-text-primary text-lg font-bold mb-1 group-hover:text-accent transition-colors">موقعنا</h3>
                <p className="text-text-secondary leading-relaxed">
                  شارع الملك فهد، حي العليا<br />
                  الرياض، المملكة العربية السعودية
                </p>
              </div>
            </div>

            {/* Card 2: Hours */}
            <div className="contact-card flex items-start gap-4 p-5 rounded-2xl bg-bg-secondary/40 backdrop-blur-sm border border-white/5 hover:border-brand/35 transition-all duration-500 hover:bg-bg-secondary/60 hover:-translate-y-1.5 hover:shadow-[0_15px_35px_rgba(139,36,56,0.15)] group">
              <div className="w-12 h-12 rounded-xl bg-brand/10 border border-brand/20 flex items-center justify-center flex-shrink-0 text-accent group-hover:text-white group-hover:bg-brand group-hover:border-brand transition-all duration-500">
                <Clock size={22} className="group-hover:rotate-12 transition-transform" />
              </div>
              <div>
                <h3 className="text-text-primary text-lg font-bold mb-1 group-hover:text-accent transition-colors">ساعات العمل</h3>
                <p className="text-text-secondary leading-relaxed">
                  يومياً: 12:00 ظهراً - 12:00 منتصف الليل<br />
                  الجمعة: 1:00 ظهراً - 1:00 بعد منتصف الليل
                </p>
              </div>
            </div>

            {/* Card 3: Phone */}
            <div className="contact-card flex items-start gap-4 p-5 rounded-2xl bg-bg-secondary/40 backdrop-blur-sm border border-white/5 hover:border-brand/35 transition-all duration-500 hover:bg-bg-secondary/60 hover:-translate-y-1.5 hover:shadow-[0_15px_35px_rgba(139,36,56,0.15)] group">
              <div className="w-12 h-12 rounded-xl bg-brand/10 border border-brand/20 flex items-center justify-center flex-shrink-0 text-accent group-hover:text-white group-hover:bg-brand group-hover:border-brand transition-all duration-500">
                <Phone size={22} className="group-hover:animate-pulse" />
              </div>
              <div>
                <h3 className="text-text-primary text-lg font-bold mb-1 group-hover:text-accent transition-colors">أرقام التواصل</h3>
                <p className="text-text-secondary leading-relaxed font-semibold" dir="ltr">
                  +966 50 123 4567<br />
                  +966 11 987 6543
                </p>
              </div>
            </div>

            {/* Card 4: Mail */}
            <div className="contact-card flex items-start gap-4 p-5 rounded-2xl bg-bg-secondary/40 backdrop-blur-sm border border-white/5 hover:border-brand/35 transition-all duration-500 hover:bg-bg-secondary/60 hover:-translate-y-1.5 hover:shadow-[0_15px_35px_rgba(139,36,56,0.15)] group">
              <div className="w-12 h-12 rounded-xl bg-brand/10 border border-brand/20 flex items-center justify-center flex-shrink-0 text-accent group-hover:text-white group-hover:bg-brand group-hover:border-brand transition-all duration-500">
                <Mail size={22} className="group-hover:-rotate-12 transition-transform" />
              </div>
              <div>
                <h3 className="text-text-primary text-lg font-bold mb-1 group-hover:text-accent transition-colors">البريد الإلكتروني</h3>
                <p className="text-text-secondary leading-relaxed">
                  info@turkishhousegrills.com
                </p>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="contact-form bg-bg-secondary/40 backdrop-blur-md border border-white/5 hover:border-brand/35 transition-all duration-500 rounded-2xl p-6 sm:p-8 hover:shadow-[0_25px_50px_rgba(139,36,56,0.22)] relative overflow-hidden group">
            {/* Inner background decorative glow */}
            <div className="absolute inset-0 bg-gradient-to-tr from-brand/5 via-transparent to-accent/5 pointer-events-none" />
            
            <h3 className="text-xl font-black text-text-primary mb-6 border-r-4 border-accent pr-3 relative z-10">أرسل لنا رسالة</h3>
            <form className="space-y-5 relative z-10" onSubmit={(e) => e.preventDefault()}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <label htmlFor="name" className="text-sm text-text-secondary font-medium block">الاسم الكامل</label>
                  <input 
                    type="text" 
                    id="name" 
                    className="w-full bg-bg-primary/65 border border-white/5 rounded-xl px-4 py-3 text-text-primary focus:outline-none transition-all duration-300 input-glow"
                    placeholder="أدخل اسمك"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="phone" className="text-sm text-text-secondary font-medium block">رقم الجوال</label>
                  <input 
                    type="tel" 
                    id="phone" 
                    className="w-full bg-bg-primary/65 border border-white/5 rounded-xl px-4 py-3 text-text-primary focus:outline-none transition-all duration-300 input-glow"
                    placeholder="05x xxx xxxx"
                    dir="ltr"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <label htmlFor="subject" className="text-sm text-text-secondary font-medium block">الموضوع</label>
                <input 
                  type="text" 
                  id="subject" 
                  className="w-full bg-bg-primary/65 border border-white/5 rounded-xl px-4 py-3 text-text-primary focus:outline-none transition-all duration-300 input-glow"
                  placeholder="موضوع الرسالة"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="message" className="text-sm text-text-secondary font-medium block">الرسالة</label>
                <textarea 
                  id="message" 
                  rows={4}
                  className="w-full bg-bg-primary/65 border border-white/5 rounded-xl px-4 py-3 text-text-primary focus:outline-none transition-all duration-300 input-glow resize-none"
                  placeholder="اكتب رسالتك هنا..."
                ></textarea>
              </div>

              {/* Ripple Effect Submit Button */}
              <button 
                type="submit" 
                onClick={handleRipple}
                className="w-full btn-gold py-3.5 justify-center relative overflow-hidden btn-ripple btn-shimmer flex items-center gap-2 rounded-xl border border-brand-light/20 shadow-lg shadow-brand/25 text-base font-bold transition-all duration-300"
              >
                {ripples.map((ripple) => (
                  <span 
                    key={ripple.id} 
                    className="ripple-effect" 
                    style={{ left: ripple.x, top: ripple.y }} 
                  />
                ))}
                <Send size={18} />
                <span>إرسال الرسالة</span>
              </button>
            </form>
          </div>

        </div>
      </div>
    </section>
  );
}
