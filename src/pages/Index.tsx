import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import WorksSection from "@/components/WorksSection";
import ClientsSection from "@/components/ClientsSection";
import BlogSection from "@/components/BlogSection";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main id="home">
        <Hero />
        <WorksSection />
        <ClientsSection />
        <BlogSection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;