const TechStackSection = () => {
  const technologies = [
    "React", "Next.js", "TypeScript", "Node.js", "NestJS", ".NET", 
    "PostgreSQL", "Python", "FastAPI", "Docker", "Kubernetes", "AWS", 
    "OpenAI", "LangChain", "LangGraph", "Pinecone"
  ];

  return (
    <section className="py-8 md:py-12 px-4 bg-background">
      <div className="container mx-auto max-w-4xl text-center">
        <h2 className="text-xl md:text-2xl font-bold tracking-tight mb-3">Tools I often use</h2>
        <p className="text-base md:text-lg text-muted-foreground mb-8">
          A practical stack I use for AI products, SaaS MVPs, and cloud systems.
        </p>
        <div className="flex flex-wrap justify-center gap-2 md:gap-3">
          {technologies.map((tech) => (
            <span 
              key={tech}
              className="px-4 py-2 bg-transparent border border-border/30 rounded-lg text-sm font-medium hover:border-primary/20 hover:bg-muted/30 transition-all cursor-default text-muted-foreground"
            >
              {tech}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TechStackSection;
