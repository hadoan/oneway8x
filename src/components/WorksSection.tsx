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
          <p className="text-base md:text-lg text-muted-foreground">Products, experiments, and startup projects I’ve built or led.</p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {worksData.map((work) => (
            <Card 
              key={work.id}
              className="group hover:shadow-elegant transition-all duration-300 hover:-translate-y-1 bg-gradient-to-br from-card to-card/50"
            >
              <CardHeader>
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <CardTitle className="text-lg md:text-xl mb-1 group-hover:text-primary transition-colors">
                      {work.title}
                    </CardTitle>
                    {work.role && (
                      <p className="text-sm font-medium text-primary mb-2">
                        {work.role}
                      </p>
                    )}
                    <div className="flex flex-wrap gap-1.5 md:gap-2 mb-2">
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
                  {work.url && (
                    <a 
                      href={work.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="ml-2 text-muted-foreground hover:text-primary transition-colors flex-shrink-0"
                    >
                      <ExternalLink className="h-4 w-4 md:h-5 md:w-5" />
                    </a>
                  )}
                </div>
                <CardDescription className="line-clamp-3 text-sm">
                  {work.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-1.5 md:gap-2">
                  {work.tags.map((tag) => (
                    <Badge key={tag} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WorksSection;