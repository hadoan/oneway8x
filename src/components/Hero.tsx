import { Button } from "@/components/ui/button";
import { ArrowRight, Calendar } from "lucide-react";

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden px-4 py-20 md:py-0">
      {/* Gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-primary/5" />
      
      {/* Animated gradient orbs */}
      <div className="absolute top-20 left-10 w-48 h-48 md:w-72 md:h-72 bg-primary/20 rounded-full blur-3xl animate-float" />
      <div className="absolute bottom-20 right-10 w-64 h-64 md:w-96 md:h-96 bg-accent/20 rounded-full blur-3xl animate-float" style={{ animationDelay: "1s" }} />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center animate-fade-in-up">
          <div className="inline-block mb-4 px-3 py-1.5 md:px-4 md:py-2 bg-primary/10 rounded-full">
            <span className="text-xs md:text-sm font-medium text-primary">
              Available for Freelance Projects
            </span>
          </div>
          
          <h1 className="mb-4 md:mb-6 text-3xl sm:text-4xl md:text-5xl lg:text-6xl bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
            Experienced Freelancer & Indie Hacker
          </h1>
          
          <p className="text-lg sm:text-xl md:text-2xl text-muted-foreground mb-3 md:mb-4 leading-relaxed px-4">
            Building Scalable Cloud Applications & AI-Driven Solutions
          </p>
          
          <p className="text-sm sm:text-base md:text-lg text-muted-foreground mb-6 md:mb-8 max-w-3xl mx-auto leading-relaxed px-4">
            With extensive experience as a full-stack developer, I specialize in turning ideas into scalable, 
            market-ready products. I have a strong background in cloud-native development, LLMs, k8s, databases, 
            and a variety of technologies including C#, Node.js, Next.js, React.js, Angular, microservices, and Docker.
          </p>
          
          {/* Free Consultation Banner */}
          <div className="mb-6 md:mb-8 p-4 md:p-6 bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10 border-2 border-primary/30 rounded-xl backdrop-blur-sm mx-4">
            <p className="text-base md:text-lg font-semibold mb-3 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              🎁 Limited Time Offer
            </p>
            <Button 
              size="lg" 
              asChild
              className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 shadow-elegant hover:shadow-xl transition-all duration-300 group w-full sm:w-auto text-sm md:text-base"
            >
              <a href="mailto:ha@oneway8x.com?subject=Free 30 minutes tech consultant">
                Get Free 30 Minutes Tech Consultation
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </a>
            </Button>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center items-center px-4">
            <Button 
              size="lg"
              asChild
              className="group shadow-elegant hover:shadow-xl transition-all duration-300 w-full sm:w-auto"
            >
              <a href="mailto:ha@oneway8x.com">
                Contact Now
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </a>
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              asChild
              className="group border-2 hover:border-primary/50 w-full sm:w-auto"
            >
              <a href="https://app.workramen.com/hadoan-xyz/30min?duration=30" target="_blank" rel="noopener noreferrer">
                <Calendar className="mr-2 h-4 w-4" />
                Book A Meeting
              </a>
            </Button>
          </div>
          
          <div className="mt-8 md:mt-12 pt-6 md:pt-8 border-t border-border/50">
            <p className="text-xs md:text-sm text-muted-foreground mb-3 md:mb-4">Tech Stacks</p>
            <div className="flex flex-wrap justify-center gap-2 md:gap-3 px-4">
              {["React", "Node.js", "TypeScript", "Docker", "K8s", "AWS", "Next.js", "Angular", ".NET", "PostgreSQL", "Python", "FastAPI", "NestJS", "LangChain", "LangGraph", "Pinecone"].map((tech) => (
                <span 
                  key={tech}
                  className="px-3 py-1.5 md:px-4 md:py-2 bg-card border border-border rounded-lg text-xs md:text-sm font-medium hover:border-primary/50 transition-colors cursor-default"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;