import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ExternalLink, MapPin } from "lucide-react";
import clientsData from "@/data/clients.json";

const ClientsSection = () => {
  return (
    <section className="py-12 md:py-20 px-4 bg-muted/30" id="clients">
      <div className="container mx-auto">
        <div className="text-center mb-8 md:mb-12">
          <h2 className="mb-3 md:mb-4 text-3xl md:text-4xl font-bold tracking-tight">Selected Client & CTO Work</h2>
          <p className="text-base md:text-lg text-muted-foreground">Some startup, freelance, and architecture work across Europe and Asia.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {clientsData.map((client) => (
            <div 
              key={client.id}
              className="p-6 border border-border/50 rounded-xl group flex flex-col h-full hover:border-primary/20 transition-colors bg-card/20"
            >
              <div className="flex flex-col gap-2 mb-4">
                <div className="flex items-start justify-between gap-4">
                  <h3 className="text-lg font-bold flex items-center gap-2 group-hover:text-primary transition-colors leading-tight">
                    {client.url ? (
                      <a href={client.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 hover:underline">
                        {client.name}
                        <ExternalLink className="h-3.5 w-3.5 text-muted-foreground" />
                      </a>
                    ) : (
                      client.name
                    )}
                  </h3>
                </div>
                <div className="flex flex-col gap-1.5 mt-1">
                  {client.role && (
                    <span className="text-sm font-medium text-primary">{client.role}</span>
                  )}
                  {client.position && !client.role && (
                    <Badge variant="secondary" className="w-fit text-[11px] font-normal">
                      {client.position}
                    </Badge>
                  )}
                  {client.location && (
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-0.5">
                      <MapPin className="h-3.5 w-3.5" />
                      <span>{client.location}</span>
                    </div>
                  )}
                </div>
              </div>
              
              <p className="text-sm text-muted-foreground mb-6 leading-relaxed flex-grow">
                {client.description}
              </p>
              
              <div className="flex flex-wrap gap-1.5 mt-auto">
                {client.tags.map((tag) => (
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

export default ClientsSection;