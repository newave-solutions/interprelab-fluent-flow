import { Suspense, lazy } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import { AuthProvider } from "@/contexts/AuthContext";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

// Lazy load pages for better performance
const Index = lazy(() => import("./pages/Index"));
const InterpreBot = lazy(() => import("./pages/InterpreBot"));
const InterpreCoach = lazy(() => import("./pages/InterpreCoach"));
const InterpreStudy = lazy(() => import("./pages/InterpreStudy"));
const InterpreLink = lazy(() => import("./pages/InterpreLink"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const CallTracker = lazy(() => import("./pages/CallTracker"));
const Settings = lazy(() => import("./pages/Settings"));
const Resources = lazy(() => import("./pages/Resources"));
const IndustryInsights = lazy(() => import("./pages/IndustryInsights"));
const Article = lazy(() => import("./pages/Article"));
const About = lazy(() => import("./pages/About"));
const InterpreWellness = lazy(() => import("./pages/InterpreWellness"));
const Contact = lazy(() => import("./pages/Contact"));
const GetInTouch = lazy(() => import("./pages/GetInTouch"));
const Careers = lazy(() => import("./pages/Careers"));
const SignIn = lazy(() => import("./pages/SignIn"));
const Waitlist = lazy(() => import("./pages/Waitlist"));
const NotFound = lazy(() => import("./pages/NotFound"));
const ASLTeacher = lazy(() => import("./pages/ASLTeacher"));
const Account = lazy(() => import("./pages/Account"));
const Dilemma = lazy(() => import("./pages/Dilemma"));

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
      <AuthProvider>
        <LanguageProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Suspense
                fallback={
                  <div className="flex h-screen w-full items-center justify-center">
                    <LoadingSpinner size="lg" text="Loading InterpreLab..." />
                  </div>
                }
              >
                <Routes>
                  <Route path="/" element={<Index />} />
                  {/* Redirect /home to / for backwards compatibility */}
                  <Route path="/home" element={<Navigate to="/" replace />} />
                  <Route path="/interprebot" element={<InterpreBot />} />
                  <Route path="/interprecoach" element={<InterpreCoach />} />
                  <Route path="/interprestudy" element={<InterpreStudy />} />
                  <Route path="/asl-teacher" element={<ASLTeacher />} />
                  <Route path="/interprelink" element={<InterpreLink />} />

                  {/* Protected Routes */}
                  <Route path="/dashboard" element={
                    <ProtectedRoute>
                      <Dashboard />
                    </ProtectedRoute>
                  } />
                  <Route path="/interpretrack" element={
                    <ProtectedRoute>
                      <CallTracker />
                    </ProtectedRoute>
                  } />
                  {/* Redirect legacy call-tracker route */}
                  <Route path="/call-tracker" element={<Navigate to="/interpretrack" replace />} />

                  <Route path="/settings" element={
                    <ProtectedRoute>
                      <Settings />
                    </ProtectedRoute>
                  } />
                  <Route path="/account" element={
                    <ProtectedRoute>
                      <Account />
                    </ProtectedRoute>
                  } />

                  {/* Public Pages */}
                  <Route path="/resources" element={<Resources />} />
                  <Route path="/resources/industry-insights" element={<IndustryInsights />} />
                  <Route path="/resources/articles/:slug" element={<Article />} />
                  <Route path="/careers" element={<Careers />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/get-in-touch" element={<GetInTouch />} />
                  <Route path="/signin" element={<SignIn />} />
                  <Route path="/waitlist" element={<Waitlist />} />
                  <Route path="/interpre-wellness" element={<InterpreWellness />} />
                  <Route path="/interprewellbeing" element={<InterpreWellness />} />
                  <Route path="/dilemma" element={<Dilemma />} />

                  {/* Catch-all */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </Suspense>
            </BrowserRouter>
          </TooltipProvider>
        </LanguageProvider>
      </AuthProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
