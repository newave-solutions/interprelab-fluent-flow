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

export const Footer = () => {
  return (
    <footer className="relative border-t border-border bg-card/50 snap-start">
      <div className="container mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">

          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-nobel-gold rounded-full flex items-center justify-center text-background font-serif font-bold text-xl">
                I
              </div>
              <div>
                <h3 className="font-serif text-lg">InterpreLab</h3>
                <p className="text-xs text-muted-foreground">Advanced Interpretation</p>
              </div>
            </div>

            <p className="text-sm text-muted-foreground leading-relaxed font-light">
              Revolutionizing medical and legal interpretation through advanced AI technology
              while preserving the essential human element in critical communication.
            </p>

            <div className="flex gap-2">
              <Badge variant="outline" className="text-xs border-border">
                <Stethoscope className="w-3 h-3 mr-1" />
                Medical
              </Badge>
              <Badge variant="outline" className="text-xs border-border">
                <Scale className="w-3 h-3 mr-1" />
                Legal
              </Badge>
            </div>
          </div>

          {/* Products */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold tracking-widest text-muted-foreground uppercase">Services</h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li>
                <Link to="/interprebot" className="hover:text-nobel-gold transition-colors">
                  InterpreBot
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
            </ul>
          </div>

          {/* Solutions */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold tracking-widest text-muted-foreground uppercase">Resources</h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li>
                <a href="https://www.certifiedmedicalinterpreters.org/" target="_blank" rel="noopener noreferrer" className="hover:text-nobel-gold transition-colors">
                  NBCMI
                </a>
              </li>
              <li>
                <a href="https://cchicertification.org/" target="_blank" rel="noopener noreferrer" className="hover:text-nobel-gold transition-colors">
                  CCHI
                </a>
              </li>
              <li>
                <Link to="/resources" className="hover:text-nobel-gold transition-colors">
                  Articles
                </Link>
              </li>
              <li>
                <Link to="/careers" className="hover:text-nobel-gold transition-colors">
                  Careers
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact & Support */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold tracking-widest text-muted-foreground uppercase">Contact</h4>
            <div className="space-y-3 text-sm text-muted-foreground">
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-nobel-gold" />
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

            <div className="flex gap-2 pt-2">
              <Button variant="ghost" size="icon" className="h-8 w-8 hover:text-nobel-gold hover:bg-nobel-gold/10">
                <Twitter className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8 hover:text-nobel-gold hover:bg-nobel-gold/10">
                <Linkedin className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8 hover:text-nobel-gold hover:bg-nobel-gold/10">
                <Github className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-border mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-6 text-xs text-muted-foreground">
              <span>© 2024 InterpreLab. All rights reserved.</span>
              <Link to="/privacy" className="hover:text-nobel-gold transition-colors">Privacy Policy</Link>
              <Link to="/terms" className="hover:text-nobel-gold transition-colors">Terms of Service</Link>
              <Link to="/security" className="hover:text-nobel-gold transition-colors">Security</Link>
            </div>

            <div className="flex items-center gap-4">
              <Badge variant="outline" className="text-xs border-nobel-gold/50 text-nobel-gold">
                <Shield className="w-3 h-3 mr-1" />
                HIPAA Compliant
              </Badge>
              <Badge variant="outline" className="text-xs border-border">
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
