import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import React from "react";

interface Feature {
  icon: React.ReactNode;
  title: string;
  description: string;
}

interface Step {
  icon: React.ReactNode;
  title: string;
  description: string;
  content?: React.ReactNode;
}

interface FeaturePageProps {
  badge: string;
  title: string;
  subtitle: string;
  primaryAction: {
    text: string;
    icon: React.ReactNode;
    link?: string;
  };
  secondaryAction: {
    text: string;
    link: string;
  };
  features: Feature[];
  steps: Step[];
  image?: string;
}

export const FeaturePage: React.FC<FeaturePageProps> = ({
  badge,
  title,
  subtitle,
  primaryAction,
  secondaryAction,
  features,
  steps,
  image,
}) => {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="py-20 bg-gradient-subtle">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <Badge className="mb-6 bg-primary/10 text-primary border-primary/20">
                {badge}
              </Badge>
              <h1 className="text-4xl md:text-6xl font-bold mb-6 gradient-text">
                {title}
              </h1>
              <p className="text-xl text-muted-foreground mb-8">
                {subtitle}
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="glass-button">
                  {primaryAction.icon}
                  {primaryAction.text}
                </Button>
                <Link to={secondaryAction.link}>
                  <Button variant="outline" size="lg">
                    {secondaryAction.text}
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </Link>
              </div>
            </div>
            {image && (
              <div className="relative">
                <div className="glass rounded-2xl p-8 border border-border/50">
                  <img
                    src={image}
                    alt={`${title} Preview`}
                    className="w-full rounded-lg shadow-2xl"
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Key Features
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="glass border-border/50 hover:border-primary/50 transition-all duration-300">
                <CardHeader>
                  {feature.icon}
                  <CardTitle>{feature.title}</CardTitle>
                  <CardDescription>{feature.description}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Getting Started Timeline */}
      <section className="py-20 bg-gradient-subtle">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Get Started in 3 Steps
            </h2>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="space-y-12">
              {steps.map((step, index) => (
                <div key={index} className="flex gap-8 items-start">
                  <div className="flex-shrink-0">
                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                      {step.icon}
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <h3 className="text-2xl font-semibold">{step.title}</h3>
                    </div>
                    <p className="text-muted-foreground mb-4">
                      {step.description}
                    </p>
                    {step.content}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};
