"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Phone, MapPin, Clock, Globe, MessageCircle, Share2 } from "lucide-react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const footerLinks = [
  { label: "الرئيسية", href: "#hero" },
  { label: "من نحن", href: "#about" },
  { label: "أطباقنا", href: "#featured" },
  { label: "المنيو", href: "/menu" },
  { label: "تواصل معنا", href: "#contact" },
];

const socialLinks = [
  { icon: Globe, href: "#", label: "موقعنا" },
  { icon: MessageCircle, href: "#", label: "واتساب" },
  { icon: Share2, href: "#", label: "شارك" },
];

export default function Footer() {
  useEffect(() => {
    const ctx = gsap.context(() => {
      // Columns fade up on scroll
      gsap.from(".footer-col", {
        scrollTrigger: {
          trigger: "footer",
          start: "top 90%",
          toggleActions: "play none none reverse"
        },
        y: 35,
        opacity: 0,
        stagger: 0.12,
        duration: 0.8,
        ease: "power3.out"
      });

      // Divider draw-on effect
      gsap.from(".footer-divider", {
        scrollTrigger: {
          trigger: ".footer-divider",
          start: "top 95%",
          toggleActions: "play none none reverse"
        },
        scaleX: 0,
        transformOrigin: "center",
        duration: 1.2,
        ease: "power4.inOut"
      });
    });
    return () => ctx.revert();
  }, []);

  return (
    <footer className="bg-bg-secondary border-t border-white/5 relative overflow-hidden">
      {/* Subtle bottom glows */}
      <div className="absolute bottom-0 right-1/4 w-72 h-72 bg-brand/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-72 h-72 bg-accent/5 rounded-full blur-[100px] pointer-events-none" />

      {/* Geometric background pattern */}
      <div
        className="absolute inset-0 opacity-[0.015] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle at 25% 25%, rgba(232,118,43,0.3) 1px, transparent 1px),
                            radial-gradient(circle at 75% 75%, rgba(139,36,56,0.3) 1px, transparent 1px)`,
          backgroundSize: "40px 40px",
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Brand Col */}
          <div className="footer-col">
            <Link href="/" className="flex items-center gap-2 mb-4 group w-max">
              <img 
                src="/images/logo-full.png" 
                alt="البيت التركي للمشويات" 
                className="w-10 h-10 rounded-xl object-contain group-hover:rotate-12 transition-transform duration-300 shadow-md border border-white/5" 
              />
              <span className="text-lg font-black text-text-primary group-hover:text-accent transition-colors duration-300">
                البيت التركي للمشويات
              </span>
            </Link>
            <p className="text-text-secondary text-sm leading-relaxed max-w-sm">
              نقدم لكم أشهى وأجود المشويات التركية الأصيلة، مطبوخة بأيدي أمهر الطهاة وبأجود المكونات الطازجة.
            </p>
            <div className="flex items-center gap-3 mt-6">
              {socialLinks.map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="w-10 h-10 rounded-xl border border-white/5 flex items-center justify-center text-text-secondary social-icon-hover bg-bg-primary/20 backdrop-blur-sm"
                >
                  <Icon size={18} />
                </a>
              ))}
            </div>
          </div>

          {/* Links Col */}
          <div className="footer-col">
            <h3 className="text-text-primary font-semibold mb-5 border-r-2 border-accent pr-2.5">روابط سريعة</h3>
            <ul className="space-y-3">
              {footerLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-text-secondary hover:text-accent transition-colors duration-300 text-sm flex items-center gap-2 group w-max"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-brand/60 group-hover:bg-accent group-hover:scale-125 transition-all duration-300 flex-shrink-0" />
                    <span className="link-underline">{link.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Col */}
          <div className="footer-col">
            <h3 className="text-text-primary font-semibold mb-5 border-r-2 border-accent pr-2.5">تواصل معنا</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-sm text-text-secondary group">
                <MapPin size={16} className="text-accent mt-0.5 flex-shrink-0 group-hover:translate-y-[-2px] transition-transform duration-300" />
                <span className="group-hover:text-text-primary transition-colors duration-300">
                  شارع الملك فهد، الرياض، المملكة العربية السعودية
                </span>
              </li>
              <li className="flex items-center gap-3 text-sm text-text-secondary group">
                <Phone size={16} className="text-accent flex-shrink-0 group-hover:scale-110 transition-transform duration-300" />
                <span dir="ltr" className="group-hover:text-text-primary transition-colors duration-300 font-semibold">
                  +966 50 123 4567
                </span>
              </li>
              <li className="flex items-center gap-3 text-sm text-text-secondary group">
                <Clock size={16} className="text-accent flex-shrink-0 group-hover:rotate-12 transition-transform duration-300" />
                <span className="group-hover:text-text-primary transition-colors duration-300">
                  يومياً: 12:00 ظهراً - 12:00 منتصف الليل
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar Divider */}
        <div className="footer-divider w-full h-[1px] bg-white/5 mt-12" />

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-text-secondary text-xs">
            © {new Date().getFullYear()} البيت التركي للمشويات. جميع الحقوق محفوظة.
          </p>
          <p className="text-text-secondary/50 text-xs font-semibold">
            نظام الطلب الذكي عبر QR Code
          </p>
        </div>
      </div>
    </footer>
  );
}
