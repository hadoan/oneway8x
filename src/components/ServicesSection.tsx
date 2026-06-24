import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, Code2, Server, Terminal } from "lucide-react";

const ServicesSection = () => {
  const services = [
    {
      title: "AI MVP Studio",
      description: "For founders who want to turn an AI idea into a working MVP in weeks.",
      cta: "Visit AI MVP Studio",
      url: "https://ai-mvp.oneway8x.com",
      icon: Terminal,
      color: "text-blue-500",
      bg: "bg-blue-500/10"
    },
    {
      title: "Fractional CTO / Architecture",
      description: "For startups that need senior technical direction, architecture review, roadmap planning, or team guidance.",
      cta: "Discuss your product",
      url: "https://app.workramen.com/hadoan-xyz/30min?duration=30",
      icon: Server,
      color: "text-purple-500",
      bg: "bg-purple-500/10"
    },
    {
      title: "Product Engineering",
      description: "For teams that need hands-on senior delivery across frontend, backend, cloud, AI, and integrations.",
      cta: "Start a project",
      url: "https://app.workramen.com/hadoan-xyz/30min?duration=30",
      icon: Code2,
      color: "text-green-500",
      bg: "bg-green-500/10"
    }
  ];

  return (
    <section className="py-12 md:py-20 px-4 bg-muted/30" id="services">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-10 md:mb-16">
          <h2 className="mb-4 text-3xl md:text-4xl font-bold tracking-tight">Ways to work with me</h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            I work with founders and teams who need both product thinking and hands-on engineering.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {services.map((service, index) => (
            <Card key={index} className="group hover:shadow-elegant transition-all duration-300 hover:-translate-y-1 flex flex-col h-full bg-card">
              <CardHeader>
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${service.bg}`}>
                  <service.icon className={`h-6 w-6 ${service.color}`} />
                </div>
                <CardTitle className="text-xl mb-2">{service.title}</CardTitle>
                <CardDescription className="text-base text-muted-foreground leading-relaxed">
                  {service.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="mt-auto pt-6">
                <a
                  href={service.url}
                  target={service.url.startsWith("http") ? "_blank" : undefined}
                  rel={service.url.startsWith("http") ? "noopener noreferrer" : undefined}
                  className="inline-flex items-center text-sm font-medium text-primary hover:text-primary/80 transition-colors group/link"
                >
                  {service.cta}
                  <ArrowRight className="ml-1 h-4 w-4 group-hover/link:translate-x-1 transition-transform" />
                </a>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
