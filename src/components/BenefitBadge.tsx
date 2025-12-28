import { Badge } from "@/components/ui/badge";
import { Sparkles } from "lucide-react";

interface BenefitBadgeProps {
  benefit: string;
  className?: string;
  showIcon?: boolean;
}

export const BenefitBadge = ({ 
  benefit, 
  className = "mb-6 bg-primary/10 text-primary border-primary/20",
  showIcon = true
}: BenefitBadgeProps) => {
  return (
    <Badge className={cn("inline-flex items-center gap-2", className)}>
      {showIcon && <Sparkles className="w-3 h-3" />}
      {benefit}
    </Badge>
  );
};
