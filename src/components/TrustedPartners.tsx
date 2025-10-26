import { Badge } from "@/components/ui/badge";
import { Shield } from "lucide-react";

export const TrustedPartners = () => {
  const partners = [
    {
      name: "Google Cloud",
      logo: "https://placehold.co/200x80/e8eaed/1f1f1f?text=Google+Cloud&font=roboto",
    },
    {
      name: "AWS",
      logo: "https://placehold.co/200x80/e8eaed/1f1f1f?text=AWS&font=roboto",
    },
    {
      name: "Microsoft Azure",
      logo: "https://placehold.co/200x80/e8eaed/1f1f1f?text=Microsoft&font=roboto",
    },
    {
      name: "OpenAI",
      logo: "https://placehold.co/200x80/e8eaed/1f1f1f?text=OpenAI&font=roboto",
    },
  ];

  return (
    <section className="py-20 px-6 bg-muted/30">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <Badge className="glass px-6 py-3 mb-4 border-primary/20">
            Trusted Partners
          </Badge>
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
            Backed by Industry Leaders
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Partnering with the world's most trusted technology providers to deliver secure, reliable, and cutting-edge solutions.
          </p>
        </div>

        {/* Partner Logos */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-5xl mx-auto items-center">
          {partners.map((partner, index) => (
            <div
              key={index}
              className="glass p-6 rounded-xl flex items-center justify-center hover-lift transition-all duration-300 border-border/30"
            >
              <img
                src={partner.logo}
                alt={partner.name}
                className="w-full h-auto opacity-60 hover:opacity-100 transition-opacity"
              />
            </div>
          ))}
        </div>

        {/* Trust Badges */}
        <div className="flex flex-wrap justify-center gap-4 mt-12">
          <Badge variant="outline" className="px-4 py-2">
            <Shield className="w-4 h-4 mr-2" />
            HIPAA Compliant
          </Badge>
          <Badge variant="outline" className="px-4 py-2">
            <Shield className="w-4 h-4 mr-2" />
            SOC 2 Certified
          </Badge>
          <Badge variant="outline" className="px-4 py-2">
            <Shield className="w-4 h-4 mr-2" />
            ISO 27001
          </Badge>
          <Badge variant="outline" className="px-4 py-2">
            <Shield className="w-4 h-4 mr-2" />
            GDPR Ready
          </Badge>
        </div>
      </div>
    </section>
  );
};
