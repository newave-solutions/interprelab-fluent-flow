import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Shield,
  Mail,
  Phone,
  MapPin,
  Twitter,
  Linkedin,
  Github,
  Chrome,
  Stethoscope,
  Scale,
  Globe
} from "lucide-react";

export const Footer = () => {
  return (
    <footer className="relative border-t border-border/50 bg-card/50 backdrop-blur-sm">
      <div className="container mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">

          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-primary rounded-lg">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-bold">InterpreLab</h3>
                <p className="text-xs text-muted-foreground">Advanced Interpretation</p>
              </div>
            </div>

            <p className="text-sm text-muted-foreground leading-relaxed">
              Revolutionizing medical and legal interpretation through advanced AI technology
              while preserving the essential human element in critical communication.
            </p>

            <div className="flex gap-2">
              <Badge variant="outline" className="text-xs">
                <Stethoscope className="w-3 h-3 mr-1" />
                Medical
              </Badge>
              <Badge variant="outline" className="text-xs">
                <Scale className="w-3 h-3 mr-1" />
                Legal
              </Badge>
            </div>
          </div>

          {/* Products */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-foreground">Products</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <a href="#" className="hover:text-foreground transition-colors flex items-center gap-2">
                  <Chrome className="w-3 h-3" />
                  InterpreCoach Extension
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-foreground transition-colors flex items-center gap-2">
                  <Shield className="w-3 h-3" />
                  Enterprise Platform
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-foreground transition-colors">
                  API Integration
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-foreground transition-colors">
                  Custom Solutions
                </a>
              </li>
            </ul>
          </div>

          {/* Solutions */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-foreground">Solutions</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <a href="#" className="hover:text-foreground transition-colors">
                  Healthcare Systems
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-foreground transition-colors">
                  Legal Firms
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-foreground transition-colors">
                  Government Agencies
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-foreground transition-colors">
                  Educational Institutions
                </a>
              </li>
            </ul>
          </div>

          {/* Contact & Support */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-foreground">Contact</h4>
            <div className="space-y-3 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                <span>hello@interprelab.com</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                <span>+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                <span>San Francisco, CA</span>
              </div>
            </div>

            <div className="flex gap-2">
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Twitter className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Linkedin className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Github className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-border/50 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-6 text-xs text-muted-foreground">
              <span>© 2024 InterpreLab. All rights reserved.</span>
              <a href="#" className="hover:text-foreground transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-foreground transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-foreground transition-colors">Security</a>
            </div>

            <div className="flex items-center gap-4">
              <Badge variant="outline" className="text-xs">
                <Shield className="w-3 h-3 mr-1" />
                HIPAA Compliant
              </Badge>
              <Badge variant="outline" className="text-xs">
                SOC 2 Type II
              </Badge>
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Globe className="w-3 h-3" />
                <span>50+ Countries</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};