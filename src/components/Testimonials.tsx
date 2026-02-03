import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { Badge } from "@/components/ui/badge";
import { Quote } from "lucide-react";

export const Testimonials = () => {
  const { ref, isVisible } = useScrollAnimation({ threshold: 0.2 });

  const testimonials = [
    {
      name: "Sofia Martinez",
      credentials: "CMI, CoreCHI-Spanish",
      role: "Medical Interpreter",
      location: "Houston, TX",
      quote: "InterpreLab transformed my practice. The real-time terminology suggestions have improved my accuracy by 40% during complex surgical procedures.",
    },
    {
      name: "Nguyễn Thị Lan",
      credentials: "CCHI-Vietnamese",
      role: "Healthcare Interpreter",
      location: "Orange County, CA",
      quote: "The cultural competency modules helped me bridge communication gaps I didn't even know existed. My patients feel truly heard now.",
    },
    {
      name: "Dmitry Volkov",
      credentials: "CoreCHI-Russian",
      role: "Medical & Legal Interpreter",
      location: "Brooklyn, NY",
      quote: "Passed both NBCMI and CCHI certifications on first attempts. The exam prep is incredibly thorough and mirrors real-world scenarios perfectly.",
    },
    {
      name: "Dr. Sarah Chen",
      credentials: "CMI, NBCMI",
      role: "Healthcare Interpreter Manager",
      location: "Seattle, WA",
      quote: "Our team of 200+ interpreters saw a 35% performance improvement. The analytics dashboard is a game-changer for training programs.",
    },
    {
      name: "Ahmed Al-Rashid",
      credentials: "CoreCHI-Arabic",
      role: "Medical Interpreter",
      location: "Dearborn, MI",
      quote: "The multilingual terminology database is unmatched. I confidently handle everything from cardiology to oncology consultations now.",
    },
    {
      name: "Mei Lin Wang",
      credentials: "CMI, CCHI-Mandarin",
      role: "Conference Interpreter",
      location: "San Francisco, CA",
      quote: "The AI-powered context suggestions during live sessions are like having a senior interpreter mentoring you in real-time. Absolutely invaluable.",
    },
    {
      name: "Carlos Mendez",
      credentials: "NBCMI, CoreCHI-Spanish",
      role: "Court & Medical Interpreter",
      location: "Miami, FL",
      quote: "The ethics and legal compliance modules are exceptional. I feel prepared for the most challenging courtroom and hospital scenarios.",
    },
    {
      name: "Olga Petrova",
      credentials: "CCHI-Russian",
      role: "Community Health Interpreter",
      location: "Chicago, IL",
      quote: "Connected with interpreters globally through InterpreLink. Landed three hospital contracts and found an amazing mentor community.",
    },
  ];

  // Duplicate for seamless infinite scroll
  const allTestimonials = [...testimonials, ...testimonials];

  return (
    <section
      className="py-24 px-6 relative bg-nobel-cream dark:bg-background overflow-hidden"
      ref={ref}
      aria-labelledby="testimonials-heading"
    >
      <div className="container mx-auto relative z-10 mb-16">
        <div
          className={`text-center transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
            }`}
        >
          <Badge className="px-6 py-3 mb-6 bg-nobel-gold/10 text-nobel-gold border-nobel-gold/20">
            Real Stories
          </Badge>
          <h2
            id="testimonials-heading"
            className="font-serif text-5xl md:text-6xl font-medium text-foreground mb-6"
          >
            Hear From <span className="text-nobel-gold">Real Interpreters</span>
          </h2>
          <p className="text-xl text-stone-600 dark:text-muted-foreground max-w-2xl mx-auto font-light">
            These are actual professionals using InterpreLab every day. Here's what they have to say about it
          </p>
        </div>
      </div>

      {/* Marquee Container - Single Row with hover pause */}
      <div className="group overflow-hidden relative w-auto flex-nowrap hidden lg:flex">
        {/* Left gradient overlay */}
        <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-nobel-cream dark:from-background to-transparent z-10 pointer-events-none" />
        {/* Right gradient overlay */}
        <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-nobel-cream dark:from-background to-transparent z-10 pointer-events-none" />

        <div className="flex gap-4 py-4 animate-marquee group-hover:[animation-play-state:paused] motion-reduce:animate-none will-change-transform">
          {allTestimonials.map((testimonial, index) => (
            <div
              key={`testimonial-${index}`}
              className="min-w-[380px] max-w-[380px] flex-shrink-0 group/card"
            >
              <div className="bg-white dark:bg-card border border-border group-hover/card:border-nobel-gold/50 transition-colors rounded-2xl p-6 shadow-sm h-full">
                {/* Quote with icon */}
                <div className="relative mb-4">
                  <div className="absolute -left-1 -top-1 flex h-6 w-6 items-center justify-center rounded-full bg-nobel-gold">
                    <Quote className="h-3 w-3 text-white fill-white" />
                  </div>
                  <p className="text-muted-foreground text-base leading-relaxed pl-7">
                    {testimonial.quote}
                  </p>
                </div>

                {/* Author info */}
                <div className="border-t border-border/50 pt-4 mt-4">
                  <h4 className="text-foreground font-semibold text-base">
                    {testimonial.name}
                  </h4>
                  <p className="text-nobel-gold text-sm font-medium mt-1">
                    {testimonial.credentials}
                  </p>
                  <p className="text-muted-foreground text-sm mt-1">
                    {testimonial.role}
                  </p>
                  <p className="text-muted-foreground text-xs mt-1">
                    {testimonial.location}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Duplicate for seamless loop */}
        <div className="flex gap-4 py-4 animate-marquee group-hover:[animation-play-state:paused] motion-reduce:animate-none will-change-transform" aria-hidden="true">
          {allTestimonials.map((testimonial, index) => (
            <div
              key={`testimonial-dup-${index}`}
              className="min-w-[380px] max-w-[380px] flex-shrink-0 group/card"
            >
              <div className="bg-white dark:bg-card border border-border group-hover/card:border-nobel-gold/50 transition-colors rounded-2xl p-6 shadow-sm h-full">
                {/* Quote with icon */}
                <div className="relative mb-4">
                  <div className="absolute -left-1 -top-1 flex h-6 w-6 items-center justify-center rounded-full bg-nobel-gold">
                    <Quote className="h-3 w-3 text-white fill-white" />
                  </div>
                  <p className="text-muted-foreground text-base leading-relaxed pl-7">
                    {testimonial.quote}
                  </p>
                </div>

                {/* Author info */}
                <div className="border-t border-border/50 pt-4 mt-4">
                  <h4 className="text-foreground font-semibold text-base">
                    {testimonial.name}
                  </h4>
                  <p className="text-nobel-gold text-sm font-medium mt-1">
                    {testimonial.credentials}
                  </p>
                  <p className="text-muted-foreground text-sm mt-1">
                    {testimonial.role}
                  </p>
                  <p className="text-muted-foreground text-xs mt-1">
                    {testimonial.location}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Mobile fallback - show grid on smaller screens */}
      <div className="lg:hidden grid grid-cols-1 md:grid-cols-2 gap-6 container mx-auto">
        {testimonials.slice(0, 4).map((testimonial, index) => (
          <div key={`mobile-${index}`} className="group/card">
            <div className="bg-white dark:bg-card border border-border group-hover/card:border-nobel-gold/50 transition-colors rounded-2xl p-6 shadow-sm">
              {/* Quote with icon */}
              <div className="relative mb-4">
                <div className="absolute -left-1 -top-1 flex h-6 w-6 items-center justify-center rounded-full bg-nobel-gold">
                  <Quote className="h-3 w-3 text-white fill-white" />
                </div>
                <p className="text-muted-foreground text-base leading-relaxed pl-7">
                  {testimonial.quote}
                </p>
              </div>

              {/* Author info */}
              <div className="border-t border-border/50 pt-4 mt-4">
                <h4 className="text-foreground font-semibold text-base">
                  {testimonial.name}
                </h4>
                <p className="text-nobel-gold text-sm font-medium mt-1">
                  {testimonial.credentials}
                </p>
                <p className="text-muted-foreground text-sm mt-1">
                  {testimonial.role}
                </p>
                <p className="text-muted-foreground text-xs mt-1">
                  {testimonial.location}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};