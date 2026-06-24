import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import ServicesSection from "@/components/ServicesSection";
import TechStackSection from "@/components/TechStackSection";
import WorksSection from "@/components/WorksSection";
import ClientsSection from "@/components/ClientsSection";
import AboutSection from "@/components/AboutSection";
import FaqSection from "@/components/FaqSection";
import BlogSection from "@/components/BlogSection";
import CtaSection from "@/components/CtaSection";
import Footer from "@/components/Footer";
import SeoSchema from "@/components/SeoSchema";

const Index = () => {
  return (
    <div className="min-h-screen">
      <SeoSchema />
      <Navbar />
      <main id="home">
        <Hero />
        <ServicesSection />
        <TechStackSection />
        <WorksSection />
        <ClientsSection />
        <BlogSection />
        <AboutSection />
        <FaqSection />
        <CtaSection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;