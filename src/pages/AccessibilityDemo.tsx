import * as React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AccessibleCarousel } from "@/components/ui/accessible-carousel";
import { AccessibleInfiniteScroll } from "@/components/ui/accessible-infinite-scroll";
import { AccessibleSelect } from "@/components/ui/accessible-select";
import { AccessibleTabs } from "@/components/ui/accessible-tabs";
import { ProgressiveEnhancement, ReducedMotion, FeatureDetection, NoScript } from "@/components/ui/progressive-enhancement";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Code, Eye, Keyboard, MousePointer, Users } from "lucide-react";

/**
 * AccessibilityDemo - Comprehensive demonstration of accessible components
 * 
 * This page showcases all the inclusive design patterns and accessible
 * components built for the InterpreLab platform.
 */
export const AccessibilityDemo = () => {
  // Sample data for demos
  const testimonialSlides = [
    {
      quote: "The accessible carousel respects my motion preferences and gives me full control.",
      author: "Maria Rodriguez",
      role: "Medical Interpreter",
    },
    {
      quote: "Keyboard navigation works perfectly. I can access everything without a mouse.",
      author: "James Chen",
      role: "Screen Reader User",
    },
    {
      quote: "The progressive enhancement ensures I can use the site even with JavaScript disabled.",
      author: "Sarah Thompson",
      role: "Healthcare Professional",
    },
  ];

  const languageOptions = [
    { value: "en", label: "English", description: "English language" },
    { value: "es", label: "Spanish", description: "Español" },
    { value: "fr", label: "French", description: "Français" },
    { value: "de", label: "German", description: "Deutsch" },
    { value: "zh", label: "Chinese", description: "中文" },
    { value: "ar", label: "Arabic", description: "العربية" },
  ];

  // State for demos
  const [selectedLanguage, setSelectedLanguage] = React.useState("");
  const [items, setItems] = React.useState(Array.from({ length: 10 }, (_, i) => ({
    id: i,
    title: `Item ${i + 1}`,
    description: `This is a description for item ${i + 1}`,
  })));
  const [hasMore, setHasMore] = React.useState(true);
  const [isLoading, setIsLoading] = React.useState(false);

  const loadMoreItems = async () => {
    setIsLoading(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    const newItems = Array.from({ length: 5 }, (_, i) => ({
      id: items.length + i,
      title: `Item ${items.length + i + 1}`,
      description: `This is a description for item ${items.length + i + 1}`,
    }));
    
    setItems((prev) => [...prev, ...newItems]);
    setIsLoading(false);
    
    // Stop loading after 3 more loads
    if (items.length > 20) {
      setHasMore(false);
    }
  };

  const featureTabs = [
    {
      id: "keyboard",
      label: "Keyboard Navigation",
      icon: <Keyboard className="h-4 w-4" />,
      content: (
        <div className="space-y-4 p-4">
          <h3 className="text-lg font-semibold">Keyboard Accessibility</h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5" />
              <span>All interactive elements are keyboard accessible</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5" />
              <span>Logical tab order throughout the interface</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5" />
              <span>Arrow keys for navigation within components</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5" />
              <span>Escape key closes popups and modals</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5" />
              <span>Home/End keys jump to first/last items</span>
            </li>
          </ul>
        </div>
      ),
    },
    {
      id: "screenreader",
      label: "Screen Readers",
      icon: <Users className="h-4 w-4" />,
      content: (
        <div className="space-y-4 p-4">
          <h3 className="text-lg font-semibold">Screen Reader Support</h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5" />
              <span>Semantic HTML with proper ARIA roles</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5" />
              <span>Live regions announce dynamic content changes</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5" />
              <span>Descriptive labels for all interactive elements</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5" />
              <span>Proper heading hierarchy for navigation</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5" />
              <span>Alternative text for all images and icons</span>
            </li>
          </ul>
        </div>
      ),
    },
    {
      id: "visual",
      label: "Visual Design",
      icon: <Eye className="h-4 w-4" />,
      content: (
        <div className="space-y-4 p-4">
          <h3 className="text-lg font-semibold">Visual Accessibility</h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5" />
              <span>WCAG AA contrast ratios (4.5:1 minimum)</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5" />
              <span>Text resizable up to 200% without loss of functionality</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5" />
              <span>Clear focus indicators on all interactive elements</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5" />
              <span>Color is not the only means of conveying information</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5" />
              <span>Support for dark mode and high contrast themes</span>
            </li>
          </ul>
        </div>
      ),
    },
  ];

  return (
    <div className="container mx-auto py-12 px-4 space-y-16">
      {/* NoScript Warning */}
      <NoScript>
        <div className="bg-yellow-100 dark:bg-yellow-900 border border-yellow-400 dark:border-yellow-700 rounded-lg p-4 mb-8">
          <p className="text-sm">
            <strong>JavaScript Disabled:</strong> Some interactive features may not work. 
            However, all content remains accessible.
          </p>
        </div>
      </NoScript>

      {/* Header */}
      <div className="text-center space-y-4">
        <Badge className="mb-4">Accessibility Demo</Badge>
        <h1 className="text-4xl md:text-5xl font-bold">
          Inclusive Design Patterns
        </h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Demonstrating WCAG 2.1 AA compliant components with full keyboard navigation,
          screen reader support, and progressive enhancement.
        </p>
      </div>

      {/* Features Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Code className="h-5 w-5" />
            Accessibility Features
          </CardTitle>
          <CardDescription>
            All components follow WCAG 2.1 AA guidelines and best practices
          </CardDescription>
        </CardHeader>
        <CardContent>
          <AccessibleTabs tabs={featureTabs} ariaLabel="Accessibility features" />
        </CardContent>
      </Card>

      {/* Accessible Carousel Demo */}
      <Card>
        <CardHeader>
          <CardTitle>1. Accessible Carousel</CardTitle>
          <CardDescription>
            Auto-rotating carousel with pause/play controls, keyboard navigation, and motion preference support
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ReducedMotion
            fallback={
              <div className="p-8 bg-muted rounded-lg text-center">
                <p className="text-muted-foreground">
                  Static content displayed (motion preferences respected)
                </p>
              </div>
            }
          >
            <AccessibleCarousel
              autoPlay={true}
              autoPlayInterval={4000}
              ariaLabel="Testimonials carousel"
            >
              {testimonialSlides.map((slide, index) => (
                <div key={index} className="p-8 bg-muted rounded-lg">
                  <blockquote className="text-lg mb-4">"{slide.quote}"</blockquote>
                  <cite className="text-sm text-muted-foreground not-italic">
                    — {slide.author}, {slide.role}
                  </cite>
                </div>
              ))}
            </AccessibleCarousel>
          </ReducedMotion>
          <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-950 rounded-lg text-sm">
            <strong>Try:</strong> Use arrow keys to navigate, click pause/play button, or hover to pause.
          </div>
        </CardContent>
      </Card>

      {/* Accessible Select Demo */}
      <Card>
        <CardHeader>
          <CardTitle>2. Accessible Select / Combobox</CardTitle>
          <CardDescription>
            Searchable dropdown with keyboard navigation, clear button, and proper ARIA labels
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <AccessibleSelect
            label="Select Language"
            description="Choose your preferred language for interpretation"
            options={languageOptions}
            value={selectedLanguage}
            onChange={setSelectedLanguage}
            searchable
            allowClear
            placeholder="Select a language..."
          />
          {selectedLanguage && (
            <div className="p-4 bg-green-50 dark:bg-green-950 rounded-lg">
              <p className="text-sm">
                Selected: <strong>{languageOptions.find(o => o.value === selectedLanguage)?.label}</strong>
              </p>
            </div>
          )}
          <div className="p-4 bg-blue-50 dark:bg-blue-950 rounded-lg text-sm">
            <strong>Try:</strong> Use arrow keys to navigate options, type to search, or click the X to clear.
          </div>
        </CardContent>
      </Card>

      {/* Accessible Infinite Scroll Demo */}
      <Card>
        <CardHeader>
          <CardTitle>3. Accessible Infinite Scroll</CardTitle>
          <CardDescription>
            Progressive loading with "Load More" button fallback and loading state announcements
          </CardDescription>
        </CardHeader>
        <CardContent>
          <FeatureDetection
            feature="intersectionObserver"
            fallback={
              <div className="p-4 bg-yellow-50 dark:bg-yellow-950 rounded-lg text-sm mb-4">
                <strong>Note:</strong> Automatic loading not supported. Use "Load More" button instead.
              </div>
            }
          >
            <AccessibleInfiniteScroll
              items={items}
              renderItem={(item) => (
                <div className="p-4 bg-muted rounded-lg">
                  <h4 className="font-semibold">{item.title}</h4>
                  <p className="text-sm text-muted-foreground">{item.description}</p>
                </div>
              )}
              loadMore={loadMoreItems}
              hasMore={hasMore}
              isLoading={isLoading}
              autoLoad={false}
            />
          </FeatureDetection>
          <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-950 rounded-lg text-sm">
            <strong>Try:</strong> Click "Load More" or enable auto-load to see loading states announced to screen readers.
          </div>
        </CardContent>
      </Card>

      {/* Progressive Enhancement Demo */}
      <Card>
        <CardHeader>
          <CardTitle>4. Progressive Enhancement</CardTitle>
          <CardDescription>
            Content accessible without JavaScript, with enhanced features when available
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <ProgressiveEnhancement
            fallback={
              <div className="p-4 border-2 border-dashed rounded-lg">
                <h4 className="font-semibold mb-2">Basic Content (No JS)</h4>
                <p className="text-sm text-muted-foreground">
                  This is the fallback content that works without JavaScript.
                  All essential information is available.
                </p>
              </div>
            }
          >
            <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950 rounded-lg">
              <h4 className="font-semibold mb-2 flex items-center gap-2">
                <MousePointer className="h-4 w-4" />
                Enhanced Content (With JS)
              </h4>
              <p className="text-sm text-muted-foreground">
                JavaScript is enabled! You're seeing the enhanced version with
                interactive features and dynamic functionality.
              </p>
            </div>
          </ProgressiveEnhancement>
          <div className="p-4 bg-blue-50 dark:bg-blue-950 rounded-lg text-sm">
            <strong>Note:</strong> Core content is always available. Enhanced features load progressively.
          </div>
        </CardContent>
      </Card>

      {/* Resources */}
      <Card>
        <CardHeader>
          <CardTitle>Additional Resources</CardTitle>
          <CardDescription>
            Learn more about accessibility and inclusive design
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm">
            <li>
              <a href="/ACCESSIBILITY_GUIDE.md" className="text-primary hover:underline">
                View Complete Accessibility Guide →
              </a>
            </li>
            <li>
              <a href="https://www.w3.org/WAI/WCAG21/quickref/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                WCAG 2.1 Quick Reference →
              </a>
            </li>
            <li>
              <a href="https://www.a11yproject.com/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                The A11Y Project →
              </a>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default AccessibilityDemo;
