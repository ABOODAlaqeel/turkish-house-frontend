import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import HeroSection from "@/components/sections/HeroSection";
import AboutSection from "@/components/sections/AboutSection";
import FeaturedSection from "@/components/sections/FeaturedSection";
import ContactSection from "@/components/sections/ContactSection";

export default function Home() {
  return (
    <main className="min-h-screen bg-bg-primary text-text-primary selection:bg-gold selection:text-bg-primary">
      <Navbar />
      
      <HeroSection />
      <AboutSection />
      <FeaturedSection />
      <ContactSection />
      
      <Footer />
    </main>
  );
}
