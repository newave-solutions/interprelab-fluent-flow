import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import {
  Shield,
  Mail,
  Phone,
  MapPin,
  Twitter,
  Linkedin,
  Github,
  Stethoscope,
  Scale,
  Globe
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export const Footer = () => {
  return (
    <footer className="relative bg-stone-900 text-stone-400 snap-start">
      <div className="container mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">

          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-nobel-gold rounded-lg">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">InterpreLab</h3>
                <p className="text-xs text-stone-500">Advanced Interpretation</p>
              </div>
            </div>

            <p className="text-sm text-stone-400 leading-relaxed">
              Revolutionizing medical and legal interpretation through advanced AI technology
              while preserving the essential human element in critical communication.
            </p>

            <div className="flex gap-2">
              <Badge variant="outline" className="text-xs border-stone-700 text-stone-400">
                <Stethoscope className="w-3 h-3 mr-1" />
                Medical
              </Badge>
              <Badge variant="outline" className="text-xs border-stone-700 text-stone-400">
                <Scale className="w-3 h-3 mr-1" />
                Legal
              </Badge>
            </div>
          </div>

          {/* Products */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-white uppercase tracking-wide">Solutions</h4>
            <ul className="space-y-2 text-sm text-stone-400">
              <li>
                <Link to="/interpretest" className="hover:text-nobel-gold transition-colors">
                  InterpreTest
                </Link>
              </li>
              <li>
                <Link to="/interprecoach" className="hover:text-nobel-gold transition-colors">
                  InterpreCoach
                </Link>
              </li>
              <li>
                <Link to="/interprestudy" className="hover:text-nobel-gold transition-colors">
                  InterpreStudy
                </Link>
              </li>
              <li>
                <Link to="/interpretrack" className="hover:text-nobel-gold transition-colors">
                  InterpreTrack
                </Link>
              </li>
              <li>
                <Link to="/interpresigns" className="hover:text-nobel-gold transition-colors">
                  InterpreSigns
                </Link>
              </li>
              <li>
                <Link to="/interprelink" className="hover:text-nobel-gold transition-colors">
                  InterpreLink
                </Link>
              </li>
              <li>
                <Link to="/interpre-wellness" className="hover:text-nobel-gold transition-colors">
                  InterpreWellness
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources & Company */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-white uppercase tracking-wide">Company</h4>
            <ul className="space-y-2 text-sm text-stone-400">
              <li>
                <Link to="/about" className="hover:text-nobel-gold transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/resources" className="hover:text-nobel-gold transition-colors">
                  Resources
                </Link>
              </li>
              <li>
                <Link to="/resources/industry-insights" className="hover:text-nobel-gold transition-colors">
                  Industry Insights
                </Link>
              </li>
              <li>
                <Link to="/careers" className="hover:text-nobel-gold transition-colors">
                  Careers
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-nobel-gold transition-colors">
                  Contact Us
                </Link>
              </li>
              <li>
                <a href="https://www.certifiedmedicalinterpreters.org/" target="_blank" rel="noopener noreferrer" className="hover:text-nobel-gold transition-colors">
                  NBCMI Certification
                </a>
              </li>
              <li>
                <a href="https://cchicertification.org/" target="_blank" rel="noopener noreferrer" className="hover:text-nobel-gold transition-colors">
                  CCHI Certification
                </a>
              </li>
            </ul>
          </div>

          {/* Contact & Support */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-white uppercase tracking-wide">Contact</h4>
            <div className="space-y-3 text-sm text-stone-400">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                <span>admin.ceo@interprelab.com</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-nobel-gold" />
                <span>+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="w-4 h-4 text-nobel-gold" />
                <span>Houston, Texas</span>
              </div>
            </div>

            <div className="pt-2">
              <Link to="/waitlist">
                <Button size="sm" className="w-full bg-nobel-gold hover:bg-nobel-gold/90 text-white">
                  Join Waitlist
                </Button>
              </Link>
            </div>

            <div className="flex gap-2">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 hover:bg-stone-800 hover:text-nobel-gold"
                    aria-label="Twitter"
                  >
                    <Twitter className="w-4 h-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Follow us on Twitter</p>
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 hover:bg-stone-800 hover:text-nobel-gold"
                    aria-label="LinkedIn"
                  >
                    <Linkedin className="w-4 h-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Connect on LinkedIn</p>
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 hover:bg-stone-800 hover:text-nobel-gold"
                    aria-label="GitHub"
                  >
                    <Github className="w-4 h-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>View source on GitHub</p>
                </TooltipContent>
              </Tooltip>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-stone-800 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-6 text-xs text-stone-500">
              <span>© 2024 InterpreLab. All rights reserved.</span>
              <Link to="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
              <Link to="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
              <Link to="/security" className="hover:text-white transition-colors">Security</Link>
            </div>

            <div className="flex items-center gap-4">
              <Badge variant="outline" className="text-xs border-stone-700 text-stone-400">
                <Shield className="w-3 h-3 mr-1" />
                HIPAA Compliant
              </Badge>
              <Badge variant="outline" className="text-xs border-stone-700 text-stone-400">
                SOC 2 Type II
              </Badge>
              <div className="flex items-center gap-1 text-xs text-stone-400">
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
