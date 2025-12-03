import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export const ThemeToggle = () => {
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
      <Sun className={`h-5 w-5 transition-all ${theme === "dark" ? "rotate-0 scale-100" : "rotate-90 scale-0"}`} aria-hidden={theme !== "dark"} />
      <Moon className={`absolute h-5 w-5 transition-all ${theme === "dark" ? "rotate-90 scale-0" : "rotate-0 scale-100"}`} aria-hidden={theme === "dark"} />
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
};
