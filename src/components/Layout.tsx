import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { ReactNode } from "react";

interface LayoutProps {
  children: ReactNode;
  showBreadcrumbs?: boolean;
}

export const Layout = ({ children, showBreadcrumbs = true }: LayoutProps) => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      {showBreadcrumbs && <Breadcrumbs />}
      <main className="pt-20">
        {children}
      </main>
      <Footer />
    </div>
  );
};