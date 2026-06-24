import { CheckCircle2 } from "lucide-react";

const AboutSection = () => {
  const bullets = [
    "Former CTO at Heyy, an AI-powered mental wellbeing startup",
    "Helped scale a wellbeing app to 200k+ users",
    "Built SaaS, mobile, automation, and cloud systems across Europe and Asia",
    "Based in Berlin, working with teams across Europe"
  ];

  return (
    <section className="py-12 md:py-20 px-4 bg-background" id="about">
      <div className="container mx-auto max-w-4xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 items-center">
          <div>
            <h2 className="mb-6 text-3xl md:text-4xl font-bold tracking-tight">About Ha</h2>
            <div className="space-y-4 text-base md:text-lg text-muted-foreground leading-relaxed">
              <p>
                I’m a Berlin-based software engineer, founder, and former CTO with experience building products from zero to scale. I’ve worked across AI products, SaaS, healthcare, logistics, mental wellbeing, cloud architecture, and mobile apps.
              </p>
              <p>
                I like working with founders and teams who need both product thinking and hands-on engineering. My focus is simple: build the right first version, ship fast, and keep the architecture practical enough to grow.
              </p>
            </div>
          </div>
          
          <div className="bg-card p-6 md:p-8 rounded-2xl border border-border shadow-sm">
            <h3 className="font-semibold text-lg mb-4 text-foreground">Fast Facts</h3>
            <ul className="space-y-4">
              {bullets.map((bullet, index) => (
                <li key={index} className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <span className="text-muted-foreground">{bullet}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
