import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ExternalLink } from "lucide-react";
import worksData from "@/data/works.json";

const WorksSection = () => {
  return (
    <section className="py-12 md:py-20 px-4" id="works">
      <div className="container mx-auto">
        <div className="text-center mb-8 md:mb-12">
          <h2 className="mb-3 md:mb-4 text-3xl md:text-4xl font-bold tracking-tight">Selected Builds</h2>
          <p className="text-base md:text-lg text-muted-foreground">A few products, experiments, and startup projects I’ve worked on.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {worksData.map((work) => (
            <div 
              key={work.id}
              className="p-6 border border-border/50 rounded-xl group flex flex-col h-full hover:border-primary/20 transition-colors bg-card/20"
            >
              <div className="flex flex-col gap-2 mb-4">
                <div className="flex items-start justify-between gap-4">
                  <h3 className="text-lg font-bold flex items-center gap-2 group-hover:text-primary transition-colors leading-tight">
                    {work.url ? (
                      <a href={work.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 hover:underline">
                        {work.title}
                        <ExternalLink className="h-3.5 w-3.5 text-muted-foreground" />
                      </a>
                    ) : (
                      work.title
                    )}
                  </h3>
                </div>
                {work.role && (
                  <div className="text-sm font-medium text-primary">{work.role}</div>
                )}
                <div className="flex flex-wrap gap-2 mt-1">
                  {work.category && (
                    <Badge variant="outline" className="text-xs bg-background">
                      {work.category}
                    </Badge>
                  )}
                  {work.status && (
                    <Badge variant="secondary" className="text-xs font-normal">
                      {work.status}
                    </Badge>
                  )}
                </div>
              </div>
              
              <p className="text-sm text-muted-foreground mb-6 leading-relaxed flex-grow">
                {work.description}
              </p>
              
              <div className="flex flex-wrap gap-1.5 mt-auto">
                {work.tags.map((tag) => (
                  <span key={tag} className="text-[11px] text-muted-foreground bg-muted/50 border border-border/50 px-2 py-0.5 rounded-md">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WorksSection;