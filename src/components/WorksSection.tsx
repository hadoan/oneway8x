import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ExternalLink } from "lucide-react";
import worksData from "@/data/works.json";

const WorksSection = () => {
  return (
    <section className="py-20 px-4" id="works">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h2 className="mb-4">My Works</h2>
          <p className="text-lg text-muted-foreground">My startups & side projects</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {worksData.map((work) => (
            <Card 
              key={work.id}
              className="group hover:shadow-elegant transition-all duration-300 hover:-translate-y-1 bg-gradient-to-br from-card to-card/50"
            >
              <CardHeader>
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <CardTitle className="text-xl mb-2 group-hover:text-primary transition-colors">
                      {work.title}
                    </CardTitle>
                    <div className="flex flex-wrap gap-2 mb-2">
                      {work.category && (
                        <Badge variant="secondary" className="text-xs">
                          {work.category}
                        </Badge>
                      )}
                      {work.employees && (
                        <Badge variant="outline" className="text-xs">
                          {work.employees}
                        </Badge>
                      )}
                      {work.status === "closed" && (
                        <Badge variant="destructive" className="text-xs">
                          Closed
                        </Badge>
                      )}
                    </div>
                  </div>
                  {work.url && (
                    <a 
                      href={work.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="ml-2 text-muted-foreground hover:text-primary transition-colors"
                    >
                      <ExternalLink className="h-5 w-5" />
                    </a>
                  )}
                </div>
                <CardDescription className="line-clamp-3">
                  {work.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
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