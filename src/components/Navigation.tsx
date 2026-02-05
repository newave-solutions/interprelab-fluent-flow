import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, Chrome, Shield, Phone, Mail, ArrowRight, User, LogOut, X } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { ThemeToggle } from "@/components/ThemeToggle";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";

export const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const { t } = useLanguage();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const navItems = [
    {
      label: t('solutions'),
      submenu: [
        { label: 'InterpreTest', href: '/interpretest' },
        { label: 'InterpreCoach', href: '/interprecoach' },
        { label: 'InterpreTrack', href: '/interpretrack' },
        { label: 'InterpreStudy', href: '/interprestudy' },
        { label: 'InterpreSigns', href: '/interpresigns' },
        { label: 'InterpreWellness', href: '/interpre-wellness' },
        { label: 'InterpreLink', href: '/interprelink' },
      ]
    },
    { label: t('resources'), href: '/resources' },
    { label: t('about'), href: '/about' },
    { label: t('contact'), href: '/contact' },
  ];

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? 'bg-background/60 backdrop-blur-md py-3' : 'bg-transparent py-6'}`}>
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="transition-all duration-300">
              <h1 className="font-serif text-xl font-semibold tracking-wide text-foreground/60 group-hover:text-foreground transition-colors duration-300">InterpreLab</h1>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              item.submenu ? (
                <NavigationMenu key={item.label}>
                  <NavigationMenuList>
                    <NavigationMenuItem>
                      <NavigationMenuTrigger className="text-xs font-medium tracking-wider text-foreground/50 hover:text-foreground/90 bg-transparent uppercase transition-all duration-300 border-0">
                        {item.label}
                      </NavigationMenuTrigger>
                      <NavigationMenuContent>
                        <ul className="grid w-52 gap-2 p-3">
                          {item.submenu.map((subitem) => (
                            <li key={subitem.href}>
                              <NavigationMenuLink asChild>
                                <Link to={subitem.href} className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-nobel-gold/10 hover:text-nobel-gold focus:bg-nobel-gold/10 focus:text-nobel-gold">
                                  <div className="text-sm font-medium leading-none">{subitem.label}</div>
                                </Link>
                              </NavigationMenuLink>
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
                  className="text-xs font-medium tracking-wider text-foreground/50 hover:text-foreground/90 transition-all duration-300 uppercase"
                >
                  {item.label}
                </Link>
              )
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="hidden md:flex items-center gap-4">
            <ThemeToggle />
            {user ? (
              <>
                <Button variant="ghost" size="sm" className="hover:text-nobel-gold" asChild>
                  <Link to="/dashboard">
                    Dashboard
                  </Link>
                </Button>
                <Button onClick={handleSignOut} variant="ghost" size="sm" className="hover:text-nobel-gold">
                  <LogOut className="w-4 h-4 mr-2" />
                  {t('signOut')}
                </Button>
              </>
            ) : (
              <>
                <Button variant="ghost" size="sm" className="text-foreground/50 hover:text-foreground/90 text-xs" asChild>
                  <Link to="/waitlist">
                    Join Waitlist
                  </Link>
                </Button>
                <Button
                  size="sm"
                  className="px-4 py-1.5 bg-foreground/10 hover:bg-foreground/20 text-foreground/70 hover:text-foreground rounded-full font-medium border border-foreground/20 hover:border-foreground/40 transition-all duration-300 text-xs"
                  asChild
                >
                  <Link to="/signin">
                    {t('signIn')}
                  </Link>
                </Button>
              </>
            )}
          </div>

          {/* Mobile Menu */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button
                variant="ghost"
                size="icon"
                className="hover:text-nobel-gold"
                aria-label={isOpen ? "Close menu" : "Open menu"}
              >
                {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="bg-background/95 backdrop-blur-md">
              <div className="space-y-6 mt-8">
                {navItems.map((item) => (
                  item.submenu ? (
                    <div key={item.label} className="space-y-2">
                      <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">{item.label}</p>
                      {item.submenu.map((subitem) => (
                        <Link
                          key={subitem.href}
                          to={subitem.href}
                          className="block text-base font-medium text-foreground hover:text-nobel-gold transition-colors pl-4"
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
                      className="block text-lg font-medium text-foreground hover:text-nobel-gold transition-colors uppercase"
                      onClick={() => setIsOpen(false)}
                    >
                      {item.label}
                    </Link>
                  )
                ))}

                <div className="pt-6 space-y-3">
                  <div className="flex justify-center pb-3">
                    <ThemeToggle />
                  </div>
                  {user ? (
                    <Button
                      onClick={() => {
                        handleSignOut();
                        setIsOpen(false);
                      }}
                      variant="ghost"
                      className="w-full hover:text-nobel-gold"
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      {t('signOut')}
                    </Button>
                  ) : (
                    <>
                      <Button variant="ghost" className="w-full hover:text-nobel-gold" asChild>
                        <Link to="/waitlist" onClick={() => setIsOpen(false)}>
                          Join Waitlist
                        </Link>
                      </Button>
                      <Button
                        className="w-full bg-nobel-gold hover:bg-nobel-gold/90 text-white rounded-full font-medium"
                        asChild
                      >
                        <Link to="/signin" onClick={() => setIsOpen(false)}>
                          Sign In
                        </Link>
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
};
