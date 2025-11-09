import { FeaturePage } from "@/components/FeaturePage";
import { Brain, Target, BarChart, Users, Play, TrendingUp } from "lucide-react";

const InterpreBot = () => {
  const features = [
    {
      icon: <Brain className="w-12 h-12 text-primary mb-4" />,
      title: "Cognitive Analysis",
      description:
        "Assess cognitive load, processing speed, and mental agility during interpretation.",
    },
    {
      icon: <Target className="w-12 h-12 text-primary mb-4" />,
      title: "Accuracy Metrics",
      description:
        "Measure precision in terminology, context preservation, and cultural adaptation.",
    },
    {
      icon: <BarChart className="w-12 h-12 text-primary mb-4" />,
      title: "Performance Tracking",
      description:
        "Monitor progress with detailed analytics and improvement suggestions.",
    },
    {
      icon: <Users className="w-12 h-12 text-primary mb-4" />,
      title: "Peer Comparison",
      description:
        "Compare your performance with industry standards and peer benchmarks.",
    },
  ];

  const steps = [
    {
      icon: <span className="text-2xl font-bold text-primary">1</span>,
      title: "Take the Assessment",
      description:
        "Complete a language assessment of both your source and target language to obtain a baseline of how you measure up, and if you're already in the field you can select to include interpreting metrics components onto your assessment!",
    },
    {
      icon: <span className="text-2xl font-bold text-primary">2</span>,
      title: "Get Your Metrics",
      description:
        "Instant metrics generated through interprebot with detailed scores on accuracy, fluency, reading comprehension and fluency, sentence structure and vocabulary, voice control and pace, amongst the many. When we say 'detailed' we mean DETAILED",
    },
    {
      icon: <TrendingUp className="w-8 h-8 text-primary" />,
      title: "Get Personalized Training",
      description:
        "Access a customized training path based on your assessment results, focusing on your areas for improvement.",
    },
  ];

  return (
    <FeaturePage
      badge="AI-Powered Assessment"
      title="InterpreBot"
      subtitle="Get instant AI-powered assessment of your interpretation skills with detailed feedback on accuracy, fluency, and medical terminology."
      primaryAction={{
        text: "Take the Assessment",
        icon: <Play className="w-5 h-5 mr-2" />,
      }}
      secondaryAction={{
        text: "Meet InterpreCoach",
        link: "/interprecoach",
      }}
      features={features}
      steps={steps}
    />
  );
};

export default InterpreBot;
