import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ExternalLink, MapPin } from "lucide-react";
import clientsData from "@/data/clients.json";

const ClientsSection = () => {
  return (
    <section className="py-12 md:py-20 px-4 bg-muted/30" id="clients">
      <div className="container mx-auto">
        <div className="text-center mb-8 md:mb-12">
          <h2 className="mb-3 md:mb-4 text-3xl md:text-4xl">Clients & Partners</h2>
          <p className="text-base md:text-lg text-muted-foreground">Trusted by leading companies worldwide</p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {clientsData.map((client) => (
            <Card 
              key={client.id}
              className="group hover:shadow-elegant transition-all duration-300 hover:-translate-y-1"
            >
               <CardHeader>
                 <div className="flex items-start justify-between mb-3">
                   <div className="flex-1">
                     <CardTitle className="text-lg md:text-xl group-hover:text-primary transition-colors mb-2">
                       {client.name}
                     </CardTitle>
                     <div className="flex flex-col gap-2">
                       <Badge variant="secondary" className="w-fit text-xs">
                         {client.position}
                       </Badge>
                       <div className="flex items-center gap-1 text-xs md:text-sm text-muted-foreground">
                         <MapPin className="h-3 w-3 md:h-4 md:w-4" />
                         <span>{client.country}</span>
                       </div>
                     </div>
                   </div>
                   {client.url && (
                     <a 
                       href={client.url} 
                       target="_blank" 
                       rel="noopener noreferrer"
                       className="ml-2 text-muted-foreground hover:text-primary transition-colors flex-shrink-0"
                     >
                       <ExternalLink className="h-4 w-4 md:h-5 md:w-5" />
                     </a>
                   )}
                 </div>
                 <CardDescription className="line-clamp-3 mt-2 text-sm">
                   {client.description}
                 </CardDescription>
               </CardHeader>
               <CardContent>
                 <div className="flex flex-wrap gap-1.5 md:gap-2">
                  {client.tags.map((tag) => (
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

export default ClientsSection;