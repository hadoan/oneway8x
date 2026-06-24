import { CheckCircle2 } from "lucide-react";

const AboutSection = () => {
  const bullets = [
    "Former CTO at Heyy, a mental wellbeing startup",
    "Helped scale a wellbeing app to 200k+ users",
    "Built SaaS, mobile, automation, and cloud systems across Europe and Asia",
    "Based in Berlin, working with founders and small teams across Europe"
  ];

  return (
    <section className="py-12 md:py-20 px-4 bg-background" id="about">
      <div className="container mx-auto max-w-4xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 items-center">
          <div>
            <h2 className="mb-6 text-3xl md:text-4xl font-bold tracking-tight">About Ha</h2>
            <div className="space-y-4 text-base md:text-lg text-muted-foreground leading-relaxed">
              <p>
                I’m a Berlin-based software engineer, founder, and former CTO. Over the years, I’ve worked on products across AI, SaaS, healthcare, logistics, mental wellbeing, cloud systems, and mobile apps.
              </p>
              <p>
                I enjoy working close to the product: understanding the problem, simplifying the first version, and building software that can actually be used by real people.
              </p>
              <p>
                I’m especially interested in early-stage products, practical AI features, and helping small teams make good technical decisions without overbuilding.
              </p>
            </div>
          </div>
          
          <div className="bg-card p-6 md:p-8 rounded-2xl border border-border shadow-sm">
            <h3 className="font-semibold text-lg mb-4 text-foreground">A few things I’ve worked on</h3>
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
