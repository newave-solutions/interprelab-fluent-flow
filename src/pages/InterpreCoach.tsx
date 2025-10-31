import { Navigation } from "../components/Navigation";
import { Footer } from "../components/Footer";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";

const InterpreCoach = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-subtle">
      <Navigation />

      {/* Hero Section */}
      <section className="py-20 bg-gradient-subtle">
        <div className="container mx-auto px-6 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 gradient-text">InterpreCoach</h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            Your real-time AI assistant for medical interpretation.
          </p>
        </div>
      </section>

      <main className="flex-grow container mx-auto px-6 py-12">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Your AI Companion in Live Sessions
          </h2>
        </div>

        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            <Card className="glass border-border/50 hover-lift p-8">
              <div className="text-center mb-6">
                <div className="bg-gradient-primary rounded-lg h-64 flex items-center justify-center">
                  <p className="text-white text-lg font-semibold">InterpreCoach in action</p>
                </div>
              </div>
            </Card>

            <Card className="glass border-border/50 hover-lift p-8">
              <h3 className="text-2xl font-bold mb-4">Browser Extension Features</h3>
              <p className="text-muted-foreground mb-6">
                InterpreCoach is a browser extension that provides real-time assistance during your interpretation sessions. Get access to advanced terminology management, voice training, and key insights.
              </p>
              <ul className="space-y-3">
                <li className="flex items-center gap-3">
                  <span className="text-primary text-xl">✔</span>
                  <span>Advanced Terminology Management with images</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="text-primary text-xl">✔</span>
                  <span>Acoustic & Voice Training</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="text-primary text-xl">✔</span>
                  <span>Key Insights & Summarization</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="text-primary text-xl">✔</span>
                  <span>Predictive Assistance</span>
                </li>
              </ul>
            </Card>
          </div>
        </div>

        <div className="max-w-md mx-auto mt-16">
          <h2 className="text-2xl font-bold text-center">Join the Waitlist</h2>
          <p className="text-center text-muted-foreground mt-2">Be the first to experience InterpreCoach.</p>
          <form className="space-y-4 mt-6">
            <div>
              <Label htmlFor="name">Full Name</Label>
              <Input id="name" type="text" placeholder="John Doe" />
            </div>
            <div>
              <Label htmlFor="email">Email Address</Label>
              <Input id="email" type="email" placeholder="john.doe@example.com" />
            </div>
            <Button type="submit" className="w-full">Join the Waitlist</Button>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default InterpreCoach;
