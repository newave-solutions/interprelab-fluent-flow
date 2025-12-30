import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Quote } from "lucide-react";
import { AccessibleCarousel } from "@/components/ui/accessible-carousel";

export const Testimonials = () => {
  const testimonials = [
    {
      name: "Dr. Maria Rodriguez",
      role: "Medical Interpreter",
      location: "Los Angeles, CA",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612e2c5?w=150&h=150&fit=crop&crop=face",
      quote: "InterpreLab transformed my practice. The real-time feedback from InterpreCoach during live sessions has improved my accuracy by 40%. It's like having a mentor always with me.",
      rating: 5,
      specialty: "Medical"
    },
    {
      name: "Carlos Mendez",
      role: "Court Interpreter",
      location: "Miami, FL",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
      quote: "The ethics training and cultural context features are game-changers. InterpreBot's analysis helped me identify blind spots I never knew I had.",
      rating: 5,
      specialty: "Legal"
    },
    {
      name: "Sarah Chen",
      role: "Healthcare Interpreter Manager",
      location: "Seattle, WA",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
      quote: "We've trained over 200 interpreters using InterpreLab. The personalized learning paths and comprehensive analytics have revolutionized our training program.",
      rating: 5,
      specialty: "Training"
    },
    {
      name: "Ahmed Hassan",
      role: "Freelance Medical Interpreter",
      location: "Houston, TX",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
      quote: "The multilingual dictionaries and terminology detection saved my career. I can now confidently handle complex medical procedures in three languages.",
      rating: 5,
      specialty: "Medical"
    },
    {
      name: "Lisa Thompson",
      role: "Legal Interpretation Coordinator",
      location: "New York, NY",
      avatar: "https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=150&h=150&fit=crop&crop=face",
      quote: "InterpreLab's compliance features ensure our interpreters meet all legal standards. The HIPAA training module alone is worth the subscription.",
      rating: 5,
      specialty: "Legal"
    },
    {
      name: "Roberto Silva",
      role: "Community Health Interpreter",
      location: "Phoenix, AZ",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face",
      quote: "The InterpreterHub community has been incredible. I've connected with interpreters worldwide and landed three new contracts through the platform.",
      rating: 5,
      specialty: "Community"
    }
  ];

  return (
    <section className="py-32 px-6 relative bg-card/50" aria-labelledby="testimonials-heading">
      <div className="container mx-auto relative z-10">
        <div className="text-center mb-16 space-y-6">
          <div className="inline-block mb-3 text-xs font-bold tracking-widest text-muted-foreground uppercase animate-fade-in-up stagger-1">
            Testimonials
          </div>
          <h2 
            id="testimonials-heading"
            className="font-serif text-4xl md:text-5xl leading-tight text-foreground animate-fade-in-up stagger-2"
          >
            Loved by
            <br />
            <span className="text-muted-foreground italic font-normal text-3xl md:text-4xl block mt-4">
              Interpreters
            </span>
          </h2>
          <div className="w-16 h-1 bg-amber-500 mx-auto animate-fade-in-up stagger-3"></div>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed animate-fade-in-up stagger-4">
            Join thousands of professionals who've transformed their practice.
          </p>
        </div>

        <div className="max-w-5xl mx-auto">
          <AccessibleCarousel
            autoPlay={true}
            autoPlayInterval={5000}
            showControls={true}
            showIndicators={true}
            ariaLabel="Customer testimonials"
            className="px-4"
          >
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="glass border-border hover:border-amber-500/30 transition-all duration-300 hover:shadow-md">
                <CardContent className="p-8 md:p-12">
                  <div className="space-y-6">
                    {/* Quote */}
                    <div className="relative">
                      <Quote className="w-10 h-10 text-amber-500/20 absolute -top-4 -left-4" aria-hidden="true" />
                      <blockquote className="text-lg md:text-xl text-foreground leading-relaxed pl-8 font-light">
                        "{testimonial.quote}"
                      </blockquote>
                    </div>

                    {/* Rating */}
                    <div className="flex items-center gap-1" role="img" aria-label={`${testimonial.rating} out of 5 stars`}>
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <span key={i} className="text-amber-500 text-xl" aria-hidden="true">★</span>
                      ))}
                    </div>

                    {/* Author */}
                    <div className="flex items-center gap-4 pt-4 border-t border-border/50">
                      <Avatar className="w-14 h-14 ring-2 ring-amber-500/20">
                        <AvatarImage src={testimonial.avatar} alt={`Photo of ${testimonial.name}`} />
                        <AvatarFallback>{testimonial.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <h4 className="text-lg font-semibold text-foreground">{testimonial.name}</h4>
                        <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                      </div>
                      <Badge className="glass border-amber-500/30 text-amber-500">
                        {testimonial.specialty}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </AccessibleCarousel>
        </div>
      </div>
    </section>
  );
};
