import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";

export const FAQ = () => {
  const faqs = [
    {
      question: "What exactly is InterpreLab?",
      answer:
        "Think of it as your complete AI toolkit for interpretation. You get seven tools that cover everything: assessment to find your weak spots, real-time help during calls, study materials, session tracking, wellness support, community connection, and ASL practice. All in one place.",
    },
    {
      question: "How does the assessment work?",
      answer:
        "You take a 30-minute test that evaluates your accuracy, fluency, terminology knowledge, cultural awareness, and ethics. Then you get a detailed report showing exactly what you're good at and what needs work, plus a custom learning plan. No vague feedback—just specific, actionable advice.",
    },
    {
      question: "Is my data actually safe?",
      answer:
        "Yes. We're HIPAA compliant, SOC 2 certified, and ISO 27001 certified. Everything is encrypted. We never sell your data or share your sessions with anyone. Your information stays private, period.",
    },
    {
      question: "Can I use InterpreCoach while I'm on a live call?",
      answer:
        "Absolutely! It's a browser extension that runs quietly in the background. If you get stuck on terminology, just glance at it for instant suggestions. It won't interrupt your flow or be visible to anyone else on the call.",
    },
    {
      question: "What languages do you support?",
      answer:
        "Over 50 languages right now, including Spanish, Mandarin, Arabic, French, Russian, Portuguese, and lots more. We keep adding new ones based on what people need. If yours isn't on the list yet, let us know and we'll prioritize it.",
    },
    {
      question: "Do you work with hospitals and agencies?",
      answer:
        "Yes! We have enterprise plans for healthcare systems, hospitals, and interpretation agencies. You can customize everything—branding, dashboards, team analytics, the whole package. Just reach out to our sales team to talk details.",
    },
    {
      question: "How much does this cost?",
      answer:
        "You can start with a free trial to test everything out. After that, we have monthly and yearly plans for individual interpreters. If you're buying for a team or organization, we'll build a custom plan that fits your budget. Check our pricing page or contact sales for specifics.",
    },
    {
      question: "Can I track all my sessions and earnings?",
      answer:
        "Yes! InterpreTrack logs every session automatically—times, dates, earnings, clients, everything. It even generates reports for invoicing and taxes. Perfect if you're freelancing and juggling multiple platforms or clients.",
    },
  ];

  return (
    <section className="py-20 px-6 bg-background border-t border-border/50">
      <div className="container mx-auto max-w-4xl">
        <div className="text-center mb-12">
          <Badge className="glass px-6 py-3 mb-4 border-primary/20">
            Got Questions?
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Here Are the Answers
          </h2>
          <p className="text-muted-foreground">
            The most common questions we get about InterpreLab, answered honestly
          </p>
        </div>

        <Accordion type="single" collapsible className="w-full space-y-4">
          {faqs.map((faq, index) => (
            <AccordionItem
              key={index}
              value={`item-${index}`}
              className="glass border-border/30 rounded-lg px-6 hover:border-primary/30 transition-colors"
            >
              <AccordionTrigger className="text-left hover:no-underline py-5">
                <span className="font-semibold text-foreground">{faq.question}</span>
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground pb-5 leading-relaxed">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>

        <div className="text-center mt-12">
          <p className="text-muted-foreground mb-4">Still have questions?</p>
          <a
            href="/contact"
            className="text-primary hover:underline font-semibold"
          >
            Contact our support team →
          </a>
        </div>
      </div>
    </section>
  );
};
