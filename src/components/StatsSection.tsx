import { Badge } from "./ui/badge";
import { TrendingUp, Users, Globe, Award } from "lucide-react";

export const StatsSection = () => {
  const stats = [
    {
      icon: Users,
      value: "10,000+",
      label: "Active Interpreters",
      gradient: "from-primary to-blue-600"
    },
    {
      icon: Globe,
      value: "50+",
      label: "Countries Worldwide",
      gradient: "from-green-600 to-primary"
    },
    {
      icon: TrendingUp,
      value: "40%",
      label: "Accuracy Improvement",
      gradient: "from-purple-600 to-pink-600"
    },
    {
      icon: Award,
      value: "98%",
      label: "Client Satisfaction",
      gradient: "from-orange-600 to-red-600"
    }
  ];

  return (
    <section className="py-20 px-6 relative">
      <div className="container mx-auto">
        <div className="glass border-border/30 rounded-3xl p-12 md:p-16 relative overflow-hidden hover-lift">
          {/* Background glow */}
          <div className="absolute inset-0 bg-gradient-glow opacity-10" />

          <div className="relative z-10">
            {/* Header */}
            <div className="text-center mb-12">
              <Badge className="mb-4 px-6 py-3 glass border-primary/20">
                Trusted Globally
              </Badge>
              <h2 className="text-3xl md:text-5xl font-bold text-foreground">
                Transforming Interpretation
              </h2>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <div key={index} className="text-center space-y-3">
                    <div className={`w-12 h-12 mx-auto bg-gradient-to-br ${stat.gradient} rounded-xl flex items-center justify-center mb-4 hover-lift`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <div className="text-4xl md:text-5xl font-bold text-foreground">
                      {stat.value}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {stat.label}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
