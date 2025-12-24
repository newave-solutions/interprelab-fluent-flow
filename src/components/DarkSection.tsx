import { ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ParticlesBackground } from "@/components/ParticlesBackground";

export const DarkSection = () => {
  return (
    <section className="py-24 relative overflow-hidden" style={{ backgroundColor: 'hsl(var(--navy-blue))' }}>
      {/* Particles Background */}
      <ParticlesBackground particleCount={80} variant="mixed" />

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-primary/5 to-transparent pointer-events-none" />

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <Badge className="mb-6 bg-primary/10 text-primary border-primary/20 px-4 py-1.5">
            Our Mission
          </Badge>

          <h2 className="text-3xl md:text-5xl font-bold mb-6 text-foreground">
            Built by Interpreters, <span className="text-primary">For Interpreters</span>
          </h2>

          <p className="text-lg md:text-xl text-muted-foreground leading-relaxed mb-8">
            We're not a faceless corporation—we're working interpreters who have experienced every frustration, every challenge, and every moment of doubt. We've felt the weight of serving vulnerable populations, the stress of certification pressure, and the isolation that comes with this profession.
          </p>

          <p className="text-lg md:text-xl text-muted-foreground leading-relaxed mb-10">
            That's why we built InterpreLab: to be the support system we wished existed. Our tools are designed with empathy, built with expertise, and driven by a mission to lighten the load for every interpreter out there.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="glass-button" asChild>
              <Link to="/about">
                Learn Our Story
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link to="/contact">
                Join the Mission
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};
