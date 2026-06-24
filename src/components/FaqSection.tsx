import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const FaqSection = () => {
  const faqs = [
    {
      question: "Who is Ha Doan?",
      answer: "Ha Doan is a Berlin-based founder-engineer, former CTO, and AI product builder."
    },
    {
      question: "What does Oneway8X do?",
      answer: "Oneway8X is Ha Doan’s personal studio for AI products, SaaS MVPs, cloud systems, and founder-focused engineering work."
    },
    {
      question: "Can Ha help build an AI MVP?",
      answer: "Yes. AI MVP work is handled through AI MVP Studio by Oneway8X at ai-mvp.oneway8x.com."
    },
    {
      question: "Where is Ha based?",
      answer: "Ha is based in Berlin, Germany and works with founders and teams across Europe."
    },
    {
      question: "What kind of projects does Ha work on?",
      answer: "AI products, SaaS MVPs, internal tools, cloud systems, mobile apps, product architecture, and startup engineering."
    }
  ];

  return (
    <section className="py-12 md:py-20 px-4 bg-muted/30" id="faq">
      <div className="container mx-auto max-w-3xl">
        <div className="mb-8 md:mb-12">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">Quick answers</h2>
        </div>
        
        <Accordion type="single" collapsible className="w-full">
          {faqs.map((faq, index) => (
            <AccordionItem key={index} value={`item-${index}`} className="border-b border-border py-2">
              <AccordionTrigger className="text-left text-lg font-medium hover:text-primary transition-colors">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-base text-muted-foreground leading-relaxed">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
};

export default FaqSection;
