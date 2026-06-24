import { ArrowRight, ExternalLink } from "lucide-react";

const CtaSection = () => {
  return (
    <section className="py-20 md:py-32 px-4 relative overflow-hidden" id="contact">
      {/* Background gradients */}
      <div className="absolute inset-0 bg-primary/5 pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl h-full max-h-96 bg-primary/20 rounded-full blur-[100px] pointer-events-none" />
      
      <div className="container mx-auto max-w-3xl text-center relative z-10">
        <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-6 text-foreground">
          Building something ambitious?
        </h2>
        <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed">
          If you’re working on an AI product, SaaS MVP, or complex software system, I’m happy to exchange ideas and see if I can help.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
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
            href="https://ai-mvp.oneway8x.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm md:text-base font-medium transition-colors border border-input bg-background hover:bg-accent hover:text-accent-foreground h-12 px-8 w-full sm:w-auto"
          >
            Visit AI MVP Studio
            <ExternalLink className="ml-1 h-4 w-4" />
          </a>
        </div>
      </div>
    </section>
  );
};

export default CtaSection;
