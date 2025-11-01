import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Menu, Chrome, Shield, Phone, Mail, ArrowRight, User, LogOut, Sun, Moon } from "lucide-react";
import { useTheme } from "next-themes";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";

interface NavigationProps {
  transparent?: boolean;
}

const ThemeToggleButton = () => {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <Button variant="ghost" size="icon" className="glass">
        <Sun className="h-5 w-5" />
      </Button>
    );
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="glass hover:bg-accent transition-all duration-300"
    >
      {theme === "dark" ? (
        <Sun className="h-5 w-5 rotate-0 scale-100 transition-all" />
      ) : (
        <Moon className="h-5 w-5 rotate-0 scale-100 transition-all" />
      )}
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
};

export const Navigation = ({ transparent = false }: NavigationProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const { t } = useLanguage();

  useEffect(() => {
    if (!transparent) return;

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [transparent]);

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const navItems = [
    {
      label: t('solutions'),
      submenu: [
        { label: 'InterpreBot', href: '/interprebot' },
        { label: 'InterpreCoach', href: '/interprecoach' },
        { label: 'InterpreStudy', href: '/interprestudy' },
        { label: 'InterpreTrack', href: '/interpretrack' },
        { label: 'InterpreHub', href: '/interpre-hub' },
      ]
    },
    { label: t('resources'), href: '/resources' },
    { label: t('about'), href: '/about' },
    { label: t('contact'), href: '/contact' },
  ];

  const navClass = transparent && !isScrolled
    ? "fixed top-0 left-0 right-0 z-50 bg-transparent border-b border-white/10"
    : "fixed top-0 left-0 right-0 z-50 glass border-b border-border/50";

  return (
    <nav className={navClass}>
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3">
            <div className="p-2 bg-gradient-primary rounded-lg">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className={`text-xl font-bold ${transparent && !isScrolled ? "text-white" : ""}`}>
                InterpreLab
              </h1>
              <p className={`text-xs ${transparent && !isScrolled ? "text-white/70" : "text-muted-foreground"}`}>
                Advanced Interpretation
              </p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              item.submenu ? (
                <NavigationMenu key={item.label}>
                  <NavigationMenuList>
                    <NavigationMenuItem>
                      <NavigationMenuTrigger
                        className={`text-sm font-medium bg-transparent ${
                          transparent && !isScrolled
                            ? "text-white/90 hover:text-white"
                            : "text-foreground/80 hover:text-foreground"
                        }`}
                      >
                        {item.label}
                      </NavigationMenuTrigger>
                      <NavigationMenuContent>
                        <ul className="grid w-48 gap-2 p-2">
                          {item.submenu.map((subitem) => (
                            <li key={subitem.href}>
                              <Link to={subitem.href}>
                                <NavigationMenuLink className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                                  <div className="text-sm font-medium leading-none">{subitem.label}</div>
                                </NavigationMenuLink>
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </NavigationMenuContent>
                    </NavigationMenuItem>
                  </NavigationMenuList>
                </NavigationMenu>
              ) : (
                <Link
                  key={item.label}
                  to={item.href}
                  className={`text-sm font-medium transition-colors ${
                    transparent && !isScrolled
                      ? "text-white/90 hover:text-white"
                      : "text-foreground hover:text-primary"
                  }`}
                >
                  {item.label}
                </Link>
              )
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <>
                <Link to="/dashboard">
                  <Button variant="ghost" size="sm">
                    Dashboard
                  </Button>
                </Link>
                <Button onClick={handleSignOut} variant="glass" size="sm">
                  <LogOut className="w-4 h-4 mr-2" />
                  {t('signOut')}
                </Button>
              </>
            ) : (
              <>
                <Link to="/waitlist">
                  <Button variant="glass" size="sm" className="flex items-center gap-2">
                    Join Waitlist
                  </Button>
                </Link>
                <Link to="/signin">
                  <Button variant="hero" size="sm">
                    <User className="w-4 h-4 mr-2" />
                    {t('signIn')}
                  </Button>
                </Link>
              </>
            )}
            <ThemeToggleButton />
          </div>

          {/* Mobile Menu */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon">
                <Menu className="w-5 h-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="glass">
              <div className="space-y-6 mt-8">
                {navItems.map((item) => (
                  item.submenu ? (
                    <div key={item.label} className="space-y-2">
                      <p className="text-sm font-semibold text-muted-foreground">{item.label}</p>
                      {item.submenu.map((subitem) => (
                        <Link
                          key={subitem.href}
                          to={subitem.href}
                          className="block text-base font-medium text-foreground hover:text-primary transition-colors pl-4"
                          onClick={() => setIsOpen(false)}
                        >
                          {subitem.label}
                        </Link>
                      ))}
                    </div>
                  ) : (
                    <Link
                      key={item.label}
                      to={item.href}
                      className="block text-lg font-medium text-foreground hover:text-primary transition-colors"
                      onClick={() => setIsOpen(false)}
                    >
                      {item.label}
                    </Link>
                  )
                ))}

                <div className="pt-6 space-y-3">
                  {user ? (
                    <Button
                      onClick={() => {
                        handleSignOut();
                        setIsOpen(false);
                      }}
                      variant="glass"
                      className="w-full"
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      {t('signOut')}
                    </Button>
                  ) : (
                    <>
                      <Link to="/waitlist">
                        <Button variant="glass" className="w-full flex items-center gap-2" onClick={() => setIsOpen(false)}>
                          Join Waitlist
                        </Button>
                      </Link>
                      <Link to="/signin">
                        <Button variant="hero" className="w-full" onClick={() => setIsOpen(false)}>
                          <User className="w-4 h-4 mr-2" />
                          {t('signIn')}
                        </Button>
                      </Link>
                    </>
                  )}
                </div>

                <div className="pt-6 border-t border-border/50">
                  <p className="text-sm text-muted-foreground mb-3">Contact</p>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4" />
                      <span>+1 (555) 123-4567</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4" />
                      <span>hello@interprelab.com</span>
                    </div>
                  </div>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
};
