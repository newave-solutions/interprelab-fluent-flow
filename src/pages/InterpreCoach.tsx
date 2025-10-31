import { FeaturePage } from "@/components/FeaturePage";
import { Chrome, Zap, Shield, Globe, Download, Star } from "lucide-react";

const InterpreCoach = () => {
  const features = [
    {
      icon: <Zap className="w-12 h-12 text-primary mb-4" />,
      title: "Real-time Assistance",
      description:
        "Get instant terminology suggestions, context clues, and cultural references while you interpret.",
    },
    {
      icon: <Globe className="w-12 h-12 text-primary mb-4" />,
      title: "Multi-language Support",
      description:
        "Support for 50+ language pairs with specialized terminology databases for medical, legal, and technical fields.",
    },
    {
      icon: <Shield className="w-12 h-12 text-primary mb-4" />,
      title: "Privacy Secured",
      description:
        "HIPAA-compliant with end-to-end encryption. Your sessions remain completely confidential and secure.",
    },
    {
      icon: <Star className="w-12 h-12 text-primary mb-4" />,
      title: "Performance Analytics",
      description:
        "Track your improvement with detailed session analytics and personalized feedback reports.",
    },
    {
      icon: <Download className="w-12 h-12 text-primary mb-4" />,
      title: "Offline Capability",
      description:
        "Access core features even without internet connection for uninterrupted interpretation sessions.",
    },
    {
      icon: <Chrome className="w-12 h-12 text-primary mb-4" />,
      title: "Easy Integration",
      description:
        "Works with popular video conferencing platforms and interpretation management systems.",
    },
  ];

  const steps = [
    {
      icon: <Chrome className="w-8 h-8 text-primary" />,
      title: "Install Extension",
      description:
        "Add InterpreCoach to Chrome from the Web Store. One-click installation, no complex setup required.",
    },
    {
      icon: <span className="text-2xl font-bold text-primary">2</span>,
      title: "Configure Your Profile",
      description:
        "Set your language pairs, specialty areas, and preferences for personalized coaching suggestions.",
    },
    {
      icon: <Zap className="w-8 h-8 text-primary" />,
      title: "Start Your Session",
      description:
        "Join a video call and activate InterpreCoach. Get instant terminology support and cultural context suggestions.",
    },
  ];

  return (
    <FeaturePage
      badge="Chrome Extension"
      title="InterpreCoach"
      subtitle="Chrome extension providing real-time transcription support, terminology detection and translation, key highlights and continuous upload thorughout encounter, a notepad section, and post-session QA feedback!"
      primaryAction={{
        text: "Meet InterpreCoach",
        icon: <Chrome className="w-5 h-5 mr-2" />,
      }}
      secondaryAction={{
        text: "Take the Assessment",
        link: "/interprebot",
      }}
      features={features}
      steps={steps}
      image="/src/assets/extension-preview.jpg"
    />
  );
};

export default InterpreCoach;
