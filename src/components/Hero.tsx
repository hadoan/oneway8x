import { ArrowRight } from "lucide-react";

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden px-4 pt-24 pb-20 md:pt-32 md:pb-24">
      {/* Gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-primary/5 pointer-events-none" />
      
      {/* Animated gradient orbs */}
      <div className="absolute top-20 left-10 w-48 h-48 md:w-72 md:h-72 bg-primary/20 rounded-full blur-3xl animate-float pointer-events-none" />
      <div className="absolute bottom-20 right-10 w-64 h-64 md:w-96 md:h-96 bg-accent/20 rounded-full blur-3xl animate-float pointer-events-none" style={{ animationDelay: "1s" }} />
      
      <div className="container mx-auto px-4 relative z-10 w-full">
        <div className="max-w-4xl mx-auto text-center animate-fade-in-up">
          <div className="inline-block mb-4 px-3 py-1.5 md:px-4 md:py-2 bg-primary/10 rounded-full">
            <span className="text-xs md:text-sm font-medium text-primary">
              Available for selected freelance, advisory, and AI MVP projects
            </span>
          </div>
          
          <h1 className="mb-6 text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl leading-tight">
            I help build AI products <br className="hidden md:inline" />
            <span className="bg-gradient-to-r from-primary/90 to-primary/50 bg-clip-text text-transparent">and scalable software systems.</span>
          </h1>
          
          <p className="mx-auto max-w-[700px] text-lg sm:text-xl text-muted-foreground mb-10 leading-relaxed font-light">
            I’m Ha Doan, a Berlin-based software engineer, founder, and former CTO. I work with founders and teams to turn early ideas into useful software — from MVPs to production systems.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
            <a
              href="https://app.workramen.com/hadoan-xyz/30min?duration=30"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm md:text-base font-medium transition-colors bg-primary text-primary-foreground hover:bg-primary/90 h-12 px-8 w-full sm:w-auto shadow-md"
            >
              Book a 30-min intro
              <ArrowRight className="ml-1 h-4 w-4" />
            </a>
            <a
              href="#works"
              className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm md:text-base font-medium transition-colors border border-input bg-background hover:bg-accent hover:text-accent-foreground h-12 px-8 w-full sm:w-auto"
            >
              View selected work
            </a>
          </div>
          
          {/* Cleaner CTA Card */}
          <div className="max-w-2xl mx-auto p-6 md:p-8 bg-card border border-border rounded-2xl shadow-sm text-left flex flex-col md:flex-row items-center justify-between gap-6 mb-8 md:mb-10">
            <div>
              <p className="text-sm font-semibold text-primary mb-2 uppercase tracking-wider">Available for selected projects</p>
              <h3 className="text-lg md:text-xl font-medium text-foreground">
                Book a 30-minute intro to discuss your product, MVP, or technical direction.
              </h3>
            </div>
            <a
              href="https://app.workramen.com/hadoan-xyz/30min?duration=30"
              target="_blank"
              rel="noopener noreferrer"
              className="flex-shrink-0 inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium transition-colors bg-secondary text-secondary-foreground hover:bg-secondary/80 h-10 px-6 whitespace-nowrap"
            >
              Book a 30-min intro
            </a>
          </div>

          {/* Credibility Row */}
          <p className="text-sm font-medium text-muted-foreground flex flex-wrap justify-center items-center gap-x-2 gap-y-1">
            <span>Former CTO</span>
            <span className="text-primary/40 px-1">•</span>
            <span>AI product experience</span>
            <span className="text-primary/40 px-1">•</span>
            <span>Berlin-based</span>
            <span className="text-primary/40 px-1">•</span>
            <span>Helped scale a product to 200k+ users</span>
            <span className="text-primary/40 px-1">•</span>
            <span>Startup experience across Europe and Asia</span>
          </p>
        </div>
      </div>
    </section>
  );
};

export default Hero;