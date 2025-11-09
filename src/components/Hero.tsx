import { Button } from "@/components/ui/button";
import { ArrowRight, Calendar } from "lucide-react";

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-primary/5" />
      
      {/* Animated gradient orbs */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-primary/20 rounded-full blur-3xl animate-float" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/20 rounded-full blur-3xl animate-float" style={{ animationDelay: "1s" }} />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center animate-fade-in-up">
          <div className="inline-block mb-4 px-4 py-2 bg-primary/10 rounded-full">
            <span className="text-sm font-medium text-primary">
              Available for Freelance Projects
            </span>
          </div>
          
          <h1 className="mb-6 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
            Experienced Freelancer & Indie Hacker
          </h1>
          
          <p className="text-xl md:text-2xl text-muted-foreground mb-4 leading-relaxed">
            Building Scalable Cloud Applications & AI-Driven Solutions
          </p>
          
          <p className="text-base md:text-lg text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed">
            With extensive experience as a full-stack developer, I specialize in turning ideas into scalable, 
            market-ready products. I have a strong background in cloud-native development, LLMs, k8s, databases, 
            and a variety of technologies including C#, Node.js, Next.js, React.js, Angular, microservices, and Docker.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button 
              size="lg" 
              className="group shadow-elegant hover:shadow-xl transition-all duration-300"
              onClick={() => window.location.href = 'mailto:ha@oneway8x.com'}
            >
              Contact Now
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              className="group border-2 hover:border-primary/50"
              onClick={() => window.open('https://app.workramen.com/hadoan-xyz/30min?duration=30', '_blank')}
            >
              <Calendar className="mr-2 h-4 w-4" />
              Book A Meeting
            </Button>
          </div>
          
          <div className="mt-12 pt-8 border-t border-border/50">
            <p className="text-sm text-muted-foreground mb-4">Tech Stacks</p>
            <div className="flex flex-wrap justify-center gap-3">
              {["React", "Node.js", "TypeScript", "Docker", "K8s", "AWS", "Next.js", "Angular", ".NET", "PostgreSQL", "Python", "FastAPI", "NestJS", "LangChain", "LangGraph", "Pinecone"].map((tech) => (
                <span 
                  key={tech}
                  className="px-4 py-2 bg-card border border-border rounded-lg text-sm font-medium hover:border-primary/50 transition-colors cursor-default"
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