import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import {
  BarChart3,
  Phone,
  Clock,
  DollarSign,
  Timer,
  TrendingUp,
  Lightbulb,
  Calendar,
  Target,
  Brain,
  Zap
} from "lucide-react";
import { Link } from "react-router-dom";

export const TrackingShowcase = () => {
  const mockStats = {
    totalCalls: 127,
    totalMinutes: 2840,
    totalEarnings: 1420.50
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
  };

  return (
    <section className="py-20 bg-gradient-to-br from-gray-50/50 via-white to-blue-50/50">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <Badge className="mb-4 bg-gradient-to-r from-blue-600 to-green-600 text-white">
            <BarChart3 className="w-4 h-4 mr-2" />
            Professional Call Tracking
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
              InterpreTrack Dashboard
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Comprehensive call tracking, earnings management, and AI-powered analytics
            for professional interpreters.
          </p>
        </div>

        {/* Stats Preview */}
        <div className="grid md:grid-cols-3 gap-6 mb-16 max-w-4xl mx-auto">
          <Card className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 hover:shadow-lg transition-all hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600">Total Calls</p>
                <p className="text-3xl font-bold text-blue-900">{mockStats.totalCalls}</p>
                <p className="text-xs text-blue-600">This month</p>
              </div>
              <Phone className="h-8 w-8 text-blue-600" />
            </div>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-gray-50 to-gray-100 border-gray-200 hover:shadow-lg transition-all hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Minutes</p>
                <p className="text-3xl font-bold text-gray-900">{mockStats.totalMinutes.toLocaleString()}</p>
                <p className="text-xs text-gray-600">This month</p>
              </div>
              <Clock className="h-8 w-8 text-gray-600" />
            </div>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-green-50 to-green-100 border-green-200 hover:shadow-lg transition-all hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-600">Total Earnings</p>
                <p className="text-3xl font-bold text-green-900">{formatCurrency(mockStats.totalEarnings)}</p>
                <p className="text-xs text-green-600">This month</p>
              </div>
              <DollarSign className="h-8 w-8 text-green-600" />
            </div>
          </Card>
        </div>

        {/* Features Grid */}
        <div className="grid lg:grid-cols-2 gap-8 mb-16">
          {/* Call Tracking */}
          <Card className="p-8 bg-gradient-to-br from-blue-50 to-blue-100/50 border-blue-200">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-3 mb-2">
                <Timer className="h-8 w-8 text-blue-600" />
                <CardTitle className="text-2xl">Automated Call Tracking</CardTitle>
              </div>
              <p className="text-muted-foreground">
                Effortlessly track your interpretation calls with manual timers and automated logging
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Timer className="h-5 w-5 text-blue-600" />
                  <span className="text-sm">Manual call timer with platform selection</span>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="h-5 w-5 text-blue-600" />
                  <span className="text-sm">VRI and OPI call type tracking</span>
                </div>
                <div className="flex items-center gap-3">
                  <DollarSign className="h-5 w-5 text-blue-600" />
                  <span className="text-sm">Automatic earnings calculation</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Analytics Dashboard */}
          <Card className="p-8 bg-gradient-to-br from-green-50 to-green-100/50 border-green-200">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-3 mb-2">
                <TrendingUp className="h-8 w-8 text-green-600" />
                <CardTitle className="text-2xl">Performance Analytics</CardTitle>
              </div>
              <p className="text-muted-foreground">
                Comprehensive dashboard with weekly trends, earnings analysis, and performance metrics
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <BarChart3 className="h-5 w-5 text-green-600" />
                  <span className="text-sm">Weekly and monthly performance charts</span>
                </div>
                <div className="flex items-center gap-3">
                  <Target className="h-5 w-5 text-green-600" />
                  <span className="text-sm">Platform comparison and optimization</span>
                </div>
                <div className="flex items-center gap-3">
                  <Calendar className="h-5 w-5 text-green-600" />
                  <span className="text-sm">Calendar view with daily earnings</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* AI Insights */}
          <Card className="p-8 bg-gradient-to-br from-purple-50 to-purple-100/50 border-purple-200">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-3 mb-2">
                <Lightbulb className="h-8 w-8 text-purple-600" />
                <CardTitle className="text-2xl">AI-Powered Insights</CardTitle>
              </div>
              <p className="text-muted-foreground">
                Get intelligent recommendations and performance insights powered by advanced AI
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Brain className="h-5 w-5 text-purple-600" />
                  <span className="text-sm">Performance pattern analysis</span>
                </div>
                <div className="flex items-center gap-3">
                  <Zap className="h-5 w-5 text-purple-600" />
                  <span className="text-sm">Optimization recommendations</span>
                </div>
                <div className="flex items-center gap-3">
                  <TrendingUp className="h-5 w-5 text-purple-600" />
                  <span className="text-sm">Earnings growth predictions</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Call Management */}
          <Card className="p-8 bg-gradient-to-br from-orange-50 to-orange-100/50 border-orange-200">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-3 mb-2">
                <Phone className="h-8 w-8 text-orange-600" />
                <CardTitle className="text-2xl">Call Management</CardTitle>
              </div>
              <p className="text-muted-foreground">
                Comprehensive call logging with detailed records and historical data
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Clock className="h-5 w-5 text-orange-600" />
                  <span className="text-sm">Detailed call duration tracking</span>
                </div>
                <div className="flex items-center gap-3">
                  <Calendar className="h-5 w-5 text-orange-600" />
                  <span className="text-sm">Monthly archives and history</span>
                </div>
                <div className="flex items-center gap-3">
                  <BarChart3 className="h-5 w-5 text-orange-600" />
                  <span className="text-sm">Platform and call type breakdown</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Key Features */}
        <div className="mb-16">
          <h3 className="text-2xl font-bold text-center mb-8">Key Tracking Features</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { name: "Manual Timer", icon: "⏱️", desc: "Start/stop call tracking" },
              { name: "Auto Calculations", icon: "💰", desc: "Earnings per minute/hour" },
              { name: "Platform Analytics", icon: "📊", desc: "Compare performance" },
              { name: "AI Insights", icon: "🤖", desc: "Smart recommendations" }
            ].map((feature, index) => (
              <Card key={index} className="p-4 text-center hover:shadow-lg transition-all hover:-translate-y-1">
                <div className="text-3xl mb-2">{feature.icon}</div>
                <h4 className="font-semibold mb-1">{feature.name}</h4>
                <p className="text-xs text-muted-foreground">{feature.desc}</p>
              </Card>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <Card className="p-8 bg-gradient-to-r from-blue-600/10 to-green-600/10 border-primary/30">
            <h3 className="text-2xl font-bold mb-4">Ready to Optimize Your Interpretation Business?</h3>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              Track every call, maximize your earnings, and gain insights into your performance with
              AI-powered analytics and automated logging.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-primary hover:bg-primary/90" asChild>
                <Link to="/interpretrack">
                  <BarChart3 className="w-4 h-4 mr-2" />
                  Launch InterpreTrack
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link to="/about">
                  Learn More
                </Link>
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
};
