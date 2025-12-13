import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, User, LogOut, ChevronDown } from "lucide-react";
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

export const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const { t } = useLanguage();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
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
        { label: 'InterpreBot', href: '/interprebot' },
        { label: 'InterpreCoach', href: '/interprecoach' },
        { label: 'InterpreTrack', href: '/interpretrack' },
        { label: 'InterpreStudy', href: '/interprestudy' },
        { label: 'ASL Teacher', href: '/asl-teacher' },
        { label: 'Interpre-Wellness', href: '/interpre-wellness' },
        { label: 'InterpreLink', href: '/interprelink' },
      ]
    },
    { label: t('resources'), href: '/resources' },
    { label: t('about'), href: '/about' },
    { label: t('contact'), href: '/contact' },
  ];

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled 
        ? 'bg-background/90 backdrop-blur-md shadow-sm py-4' 
        : 'bg-transparent py-6'
    }`}>
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-nobel-gold rounded-full flex items-center justify-center text-background font-serif font-bold text-xl shadow-sm">
              I
            </div>
            <div>
              <h1 className="text-xl font-serif font-medium">InterpreLab</h1>
              <p className="text-xs text-muted-foreground">Advanced Interpretation</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              item.submenu ? (
                <NavigationMenu key={item.label}>
                  <NavigationMenuList>
                    <NavigationMenuItem>
                      <NavigationMenuTrigger className="text-sm font-medium text-muted-foreground hover:text-foreground bg-transparent data-[state=open]:text-nobel-gold">
                        {item.label}
                      </NavigationMenuTrigger>
                      <NavigationMenuContent>
                        <ul className="grid w-56 gap-1 p-2 bg-card border border-border rounded-lg">
                          {item.submenu.map((subitem) => (
                            <li key={subitem.href}>
                              <NavigationMenuLink asChild>
                                <Link 
                                  to={subitem.href} 
                                  className="block select-none rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground text-sm"
                                >
                                  {subitem.label}
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
                  className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
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
                <Button variant="ghost" size="sm" asChild>
                  <Link to="/dashboard">
                    Dashboard
                  </Link>
                </Button>
                <Button variant="ghost" size="sm" asChild>
                  <Link to="/account">
                    <User className="w-4 h-4 mr-2" />
                    Account
                  </Link>
                </Button>
                <Button onClick={handleSignOut} variant="outline" size="sm" className="border-nobel-gold/50 text-nobel-gold hover:bg-nobel-gold/10">
                  <LogOut className="w-4 h-4 mr-2" />
                  {t('signOut')}
                </Button>
              </>
            ) : (
              <>
                <Button variant="ghost" size="sm" asChild>
                  <Link to="/waitlist">
                    Join Waitlist
                  </Link>
                </Button>
                <Button variant="default" size="sm" className="bg-nobel-gold text-background hover:bg-nobel-gold/90" asChild>
                  <Link to="/signin">
                    <User className="w-4 h-4 mr-2" />
                    {t('signIn')}
                  </Link>
                </Button>
              </>
            )}
          </div>

          {/* Mobile Menu */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon">
                <Menu className="w-5 h-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="bg-card border-border">
              <div className="space-y-6 mt-8">
                {navItems.map((item) => (
                  item.submenu ? (
                    <div key={item.label} className="space-y-2">
                      <p className="text-xs font-bold tracking-widest text-muted-foreground uppercase">{item.label}</p>
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
                      className="block text-lg font-medium text-foreground hover:text-nobel-gold transition-colors"
                      onClick={() => setIsOpen(false)}
                    >
                      {item.label}
                    </Link>
                  )
                ))}

                <div className="pt-6 space-y-3 border-t border-border">
                  {user ? (
                    <>
                      <Button variant="ghost" className="w-full justify-start" asChild>
                        <Link to="/account" onClick={() => setIsOpen(false)}>
                          <User className="w-4 h-4 mr-2" />
                          Account
                        </Link>
                      </Button>
                      <Button
                        onClick={() => {
                          handleSignOut();
                          setIsOpen(false);
                        }}
                        variant="outline"
                        className="w-full border-nobel-gold/50 text-nobel-gold"
                      >
                        <LogOut className="w-4 h-4 mr-2" />
                        {t('signOut')}
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button variant="ghost" className="w-full" asChild>
                        <Link to="/waitlist" onClick={() => setIsOpen(false)}>
                          Join Waitlist
                        </Link>
                      </Button>
                      <Button className="w-full bg-nobel-gold text-background hover:bg-nobel-gold/90" asChild>
                        <Link to="/signin" onClick={() => setIsOpen(false)}>
                          <User className="w-4 h-4 mr-2" />
                          {t('signIn')}
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
