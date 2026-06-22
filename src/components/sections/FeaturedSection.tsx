"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ShoppingBag, ArrowLeft } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const featuredDishes = [
  {
    id: "1",
    name: "كباب لحم",
    description: "أسياخ كباب اللحم البلدي المفروم والمتبل بالبهارات التركية الشهيرة، مشوي على الفحم.",
    price: 2200,
    category: "مشويات",
    image: "https://images.unsplash.com/photo-1603048588665-791ca8aea617?auto=format&fit=crop&q=80&w=400"
  },
  {
    id: "2",
    name: "لحم بالعجين",
    description: "عجينة رقيقة مقرمشة مغطاة باللحم المفروم المتبل والخضار الطازجة على الطريقة التركية.",
    price: 700,
    category: "معجنات",
    image: "https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?auto=format&fit=crop&q=80&w=400"
  },
  {
    id: "3",
    name: "سبيشل البيت التركي",
    description: "صينية المشاوي الخاصة بالبيت التركي المزدحمة بألذ الأوصال والكباب والريش والجمبري والخبز المحشي.",
    price: 14000,
    category: "مشويات",
    image: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&q=80&w=400"
  },
  {
    id: "4",
    name: "بيتزا سبيشل محشي الأطراف (كبير)",
    description: "البيتزا الخاصة بالبيت التركي مع أطراف محشية بجبن الموتزاريلا الفاخر والخضار واللحم.",
    price: 3500,
    category: "بيتزا",
    image: "https://images.unsplash.com/photo-1590947132387-155cc02f3212?auto=format&fit=crop&q=80&w=400"
  }
];

export default function FeaturedSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Heading animations
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: ".featured-header",
          start: "top 85%",
          toggleActions: "play none none reverse"
        }
      });

      tl.from(".featured-badge", {
        y: 15,
        opacity: 0,
        duration: 0.5,
        ease: "power2.out"
      })
      .from(".featured-title-line", {
        y: 40,
        opacity: 0,
        duration: 0.6,
        ease: "power3.out"
      }, "-=0.3")
      .from(".featured-divider", {
        scaleX: 0,
        transformOrigin: "center",
        duration: 0.5,
        ease: "power2.out"
      }, "-=0.3")
      .from(".featured-desc", {
        y: 20,
        opacity: 0,
        duration: 0.5,
        ease: "power2.out"
      }, "-=0.3");

      // Cards stagger reveal from the right (RTL direction-friendly)
      gsap.from(".dish-card", {
        scrollTrigger: {
          trigger: ".dish-card-container",
          start: "top 80%",
          toggleActions: "play none none reverse"
        },
        x: 60,
        opacity: 0,
        stagger: 0.12,
        duration: 0.8,
        ease: "power4.out"
      });

      // Price Tag Pop
      gsap.from(".dish-price", {
        scrollTrigger: {
          trigger: ".dish-card-container",
          start: "top 80%",
          toggleActions: "play none none reverse"
        },
        scale: 0,
        opacity: 0,
        stagger: 0.12,
        duration: 0.8,
        delay: 0.2,
        ease: "back.out(1.7)"
      });
      
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section id="featured" ref={sectionRef} className="py-24 bg-bg-secondary relative overflow-hidden">
      {/* Background Decorative elements */}
      <div className="absolute top-1/4 right-0 w-96 h-96 bg-brand/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 left-0 w-96 h-96 bg-accent/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <div className="featured-header text-center mb-16">
          <span className="featured-badge text-accent text-sm font-semibold tracking-widest uppercase mb-3 block animate-badge-pulse bg-accent/10 border border-accent/20 px-3 py-1 rounded-full w-max mx-auto">
            تذوق التميز
          </span>
          <div className="overflow-hidden py-1">
            <h2 className="featured-title-line section-heading">
              أبرز <span className="text-gold-gradient font-black">أطباقنا</span>
            </h2>
          </div>
          <div className="featured-divider gold-divider" />
          <p className="featured-desc text-text-secondary max-w-2xl mx-auto mt-4 text-base md:text-lg">
            نقدم لكم تشكيلة مختارة من أشهى المشويات والأطباق التركية الفاخرة التي نعتز بتقديمها لكم.
          </p>
        </div>

        {/* Grid */}
        <div className="dish-card-container grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredDishes.map((dish) => (
            <div 
              key={dish.id} 
              className="dish-card menu-card group border border-bg-tertiary/60 hover:border-brand/30 transition-all duration-500 hover:-translate-y-3 hover:shadow-[0_20px_40px_rgba(139,36,56,0.15)]"
            >
              {/* Image Container */}
              <div className="relative aspect-[4/3] w-full overflow-hidden bg-bg-tertiary">
                <img 
                  src={dish.image} 
                  alt={dish.name}
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 group-hover:rotate-1 transition-all duration-700 ease-out"
                />
                {/* Default Fade gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-bg-secondary via-transparent to-transparent opacity-80 group-hover:opacity-40 transition-opacity duration-500 z-10" />
                {/* Glow warm gradient on hover */}
                <div className="absolute inset-0 bg-gradient-to-tr from-brand/20 via-transparent to-accent/15 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10" />
                
                {/* Category Badge */}
                <div className="absolute top-3 right-3 z-20 bg-bg-primary/80 backdrop-blur-sm border border-brand/20 text-accent text-xs px-2.5 py-1 rounded-full font-medium transition-all duration-300 group-hover:border-accent/40">
                  {dish.category}
                </div>
              </div>
              
              {/* Content */}
              <div className="p-5 flex flex-col justify-between h-[190px]">
                <div>
                  <div className="flex justify-between items-start mb-2 gap-2">
                    <h3 className="text-lg font-bold text-text-primary group-hover:text-accent transition-colors duration-300 line-clamp-1">
                      {dish.name}
                    </h3>
                    {/* Animated Price Tag */}
                    <div className="dish-price shrink-0 bg-brand/10 border border-brand/20 text-accent px-2.5 py-0.5 rounded text-sm font-black flex items-center gap-1 transition-all duration-300">
                      <span>{dish.price}</span>
                      <span className="text-xs text-text-secondary font-normal">ر.ي</span>
                    </div>
                  </div>
                  <p className="text-text-secondary text-sm leading-relaxed line-clamp-2">
                    {dish.description}
                  </p>
                </div>
                
                {/* Swap Button Action */}
                <div className="relative overflow-hidden h-10 mt-4 rounded-sm border border-accent/20 group-hover:border-accent/50 transition-colors duration-300">
                  {/* Default State: View details */}
                  <div className="absolute inset-0 flex items-center justify-center gap-2 text-accent text-sm font-medium translate-y-0 group-hover:-translate-y-full transition-transform duration-300 ease-out">
                    <span>عرض التفاصيل</span>
                    <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                  </div>
                  {/* Hover State: Add to/Order now */}
                  <div className="absolute inset-0 flex items-center justify-center translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out">
                    <Link 
                      href="/menu" 
                      className="w-full h-full btn-gold py-2 justify-center text-sm items-center gap-2 btn-shimmer"
                    >
                      <ShoppingBag size={16} />
                      <span>اطلب الآن</span>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* View Full Menu CTA */}
        <div className="mt-16 text-center">
          <Link href="/menu" className="inline-flex items-center gap-2 text-text-secondary hover:text-accent transition-colors duration-300 group">
            <span className="font-semibold text-lg link-underline">عرض المنيو الكامل</span>
            <ArrowLeft size={20} className="group-hover:-translate-x-2 transition-transform duration-300 text-accent" />
          </Link>
        </div>
      </div>
    </section>
  );
}
