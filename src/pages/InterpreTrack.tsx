import { useState, useEffect } from "react";
import Navigation from "../components/Navigation";
import { Footer } from "../components/Footer";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Textarea } from "../components/ui/textarea";
import {
  Phone,
  PhoneOff,
  Clock,
  DollarSign,
  BarChart3,
  Calendar,
  Timer,
  TrendingUp,
  Lightbulb,
  Settings,
  CheckCircle,
  Zap
} from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useCallTracker } from "../hooks/useCallTracker";
import { CallLogService, AnalyticsService } from "../integrations/supabase/services";

// Real-time stats interface
interface StatsData {
  monthEarnings: number;
  monthCalls: number;
  monthTotal: number;
  yearEarnings: number;
  yearCalls: number;
  avgCallDuration: number;
  totalCalls: number;
}

// Default stats for loading state
const defaultStats: StatsData = {
  monthEarnings: 0,
  monthCalls: 0,
  monthTotal: 0,
  yearEarnings: 0,
  yearCalls: 0,
  avgCallDuration: 0,
  totalCalls: 0
};

const InterpreTrackEnhanced = () => {
  const [activeTab, setActiveTab] = useState("tracker");
  const [notes, setNotes] = useState('');
  const [stats, setStats] = useState<StatsData>(defaultStats);
  const [recentCalls, setRecentCalls] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const {
    isTracking,
    elapsedSeconds,
    startCall,
    endCall,
    formatDuration,
    formatCurrency,
    calculateEarnings,
    userSettings,
  } = useCallTracker();

  useEffect(() => {
    if (user) {
      loadDashboardData();
    }
  }, [user]);

  const loadDashboardData = async () => {
    if (!user) return;
    setLoading(true);
    try {
      // Load recent calls
      const { data: callsData } = await CallLogService.getCallLogs(user.id, 10);
      if (callsData) {
        setRecentCalls(callsData);
      }

      // Load monthly stats
      const currentDate = new Date();
      const { data: monthlyData } = await CallLogService.getMonthlyStats(
        user.id,
        currentDate.getFullYear(),
        currentDate.getMonth() + 1
      );

      // Load yearly stats
      const { data: yearlyData } = await AnalyticsService.getYearlyStats(
        user.id,
        currentDate.getFullYear()
      );

      if (monthlyData && yearlyData) {
        setStats({
          monthEarnings: monthlyData.totalEarnings,
          monthCalls: monthlyData.totalCalls,
          monthTotal: monthlyData.totalSeconds,
          yearEarnings: yearlyData.totalEarnings,
          yearCalls: yearlyData.totalCalls,
          avgCallDuration: yearlyData.averageDuration,
          totalCalls: yearlyData.totalCalls,
        });
      }
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEndCall = async () => {
    const result = await endCall(notes);
    if (!result?.error) {
      setNotes('');
      // Reload data after successful call log
      loadDashboardData();
    }
  };

  const currentEarnings = calculateEarnings(elapsedSeconds);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <Navigation />

      {/* Hero Section */}
      <section className="py-20 bg-gradient-subtle">
        <div className="container mx-auto px-6 text-center">
          <Badge className="mb-6 glass px-6 py-3 border-primary/20">
            <Timer className="w-4 h-4 mr-2" />
            Time & Earnings Tracker
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 gradient-text">
            InterpreTrack
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            Track your interpretation sessions, monitor earnings, and manage your professional practice—all in one place.
          </p>
        </div>
      </section>

      <main className="container mx-auto px-6 py-12">
        {/* Main Content Tabs */}
        <div className="max-w-6xl mx-auto">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4 mb-8 h-auto p-2 glass border-border/50">
              <TabsTrigger
                value="tracker"
                className="h-14 text-sm lg:text-base font-semibold data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all"
              >
                <Timer className="w-4 h-4 mr-2" />
                Call Tracker
              </TabsTrigger>
              <TabsTrigger
                value="dashboard"
                className="h-14 text-sm lg:text-base font-semibold data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all"
              >
                <BarChart3 className="w-4 h-4 mr-2" />
                Dashboard
              </TabsTrigger>
              <TabsTrigger
                value="analytics"
                className="h-14 text-sm lg:text-base font-semibold data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all"
              >
                <TrendingUp className="w-4 h-4 mr-2" />
                Analytics
              </TabsTrigger>
              <TabsTrigger
                value="history"
                className="h-14 text-sm lg:text-base font-semibold data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all"
              >
                <Calendar className="w-4 h-4 mr-2" />
                History
              </TabsTrigger>
            </TabsList>

            <TabsContent value="tracker" className="mt-0">
              <div className="max-w-4xl mx-auto">
                <Card className="mb-8 glass border-border/50 hover-lift">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Clock className="h-6 w-6" />
                      Current Session
                    </CardTitle>
                    <CardDescription>
                      Track your interpretation calls and earnings in real-time
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="text-center">
                      <div className="text-6xl font-mono font-bold mb-4 gradient-text">
                        {formatDuration(elapsedSeconds)}
                      </div>
                      {isTracking && (
                        <div className="text-2xl text-muted-foreground">
                          Earnings: {formatCurrency(currentEarnings, userSettings?.preferred_currency)}
                        </div>
                      )}
                    </div>

                    {isTracking && (
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Call Notes (Optional)</label>
                        <Textarea
                          placeholder="Add notes about this call..."
                          value={notes}
                          onChange={(e) => setNotes(e.target.value)}
                          rows={4}
                          className="glass"
                        />
                      </div>
                    )}

                    <div className="flex gap-4 justify-center">
                      {!isTracking ? (
                        <Button
                          onClick={startCall}
                          size="lg"
                          className="w-full max-w-xs glass-button hover-lift"
                        >
                          <Phone className="mr-2 h-5 w-5" />
                          Start Call
                        </Button>
                      ) : (
                        <Button
                          onClick={handleEndCall}
                          variant="destructive"
                          size="lg"
                          className="w-full max-w-xs hover-lift"
                        >
                          <PhoneOff className="mr-2 h-5 w-5" />
                          End Call
                        </Button>
                      )}
                    </div>

                    {userSettings && (
                      <div className="text-center text-sm text-muted-foreground pt-4 border-t border-border/50">
                        Current Rate: {formatCurrency(userSettings.pay_rate, userSettings.preferred_currency)} {userSettings.pay_rate_type === 'per_hour' ? 'per hour' : 'per minute'}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="dashboard" className="mt-0">
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <Card className="glass border-border/50 hover-lift">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">This Month</CardTitle>
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{formatCurrency(stats.monthEarnings, userSettings?.preferred_currency)}</div>
                    <p className="text-xs text-muted-foreground">
                      {stats.monthCalls} calls • {formatDuration(stats.monthTotal)}
                    </p>
                  </CardContent>
                </Card>

                <Card className="glass border-border/50 hover-lift">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">This Year</CardTitle>
                    <TrendingUp className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{formatCurrency(stats.yearEarnings, userSettings?.preferred_currency)}</div>
                    <p className="text-xs text-muted-foreground">
                      {stats.yearCalls} calls • {formatDuration(stats.monthTotal * 12)}
                    </p>
                  </CardContent>
                </Card>

                <Card className="glass border-border/50 hover-lift">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Avg Call Duration</CardTitle>
                    <Clock className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{formatDuration(Math.round(stats.avgCallDuration))}</div>
                    <p className="text-xs text-muted-foreground">Across all calls</p>
                  </CardContent>
                </Card>

                <Card className="glass border-border/50 hover-lift">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Calls</CardTitle>
                    <Phone className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stats.totalCalls}</div>
                    <p className="text-xs text-muted-foreground">All time</p>
                  </CardContent>
                </Card>
              </div>

              {/* Recent Calls */}
              <Card className="glass border-border/50">
                <CardHeader>
                  <CardTitle>Recent Calls</CardTitle>
                  <CardDescription>Your latest interpretation sessions</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {loading ? (
                      <div className="text-center py-8 text-muted-foreground">
                        Loading recent calls...
                      </div>
                    ) : recentCalls.length > 0 ? (
                      recentCalls.map((call) => (
                        <div
                          key={call.id}
                          className="flex items-center justify-between p-4 glass rounded-lg hover-lift"
                        >
                          <div className="flex-1">
                            <div className="font-medium">
                              {formatDate(call.start_time)}
                            </div>
                            {call.notes && (
                              <div className="text-sm text-muted-foreground mt-1">{call.notes}</div>
                            )}
                          </div>
                          <div className="text-right">
                            <div className="font-semibold">{formatCurrency(call.earnings || 0, call.currency)}</div>
                            <div className="text-sm text-muted-foreground">
                              {formatDuration(call.duration_seconds || 0)}
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8 text-muted-foreground">
                        No calls logged yet. Start tracking your first call!
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="analytics" className="mt-0">
              <div className="grid gap-6 lg:grid-cols-2">
                <Card className="glass border-border/50 hover-lift">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Lightbulb className="text-primary" />
                      AI-Powered Insights
                    </CardTitle>
                    <CardDescription>Performance analysis and recommendations</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="p-4 border-l-4 border-primary glass rounded-r-lg">
                        <p className="text-muted-foreground italic">
                          "Your earnings have increased by 23% this month compared to last month, with medical consultations showing the strongest growth."
                        </p>
                      </div>
                      <div className="p-4 border-l-4 border-green-500 glass rounded-r-lg">
                        <p className="text-muted-foreground italic">
                          "Peak performance hours are between 10 AM - 2 PM. Consider scheduling more availability during these times."
                        </p>
                      </div>
                      <div className="p-4 border-l-4 border-blue-500 glass rounded-r-lg">
                        <p className="text-muted-foreground italic">
                          "Medical interpretations generate 35% higher earnings per minute compared to other types."
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="glass border-border/50 hover-lift">
                  <CardHeader>
                    <CardTitle>Performance Metrics</CardTitle>
                    <CardDescription>Key performance indicators</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Timer className="h-5 w-5 text-blue-600" />
                          <span className="font-medium">Average Session</span>
                        </div>
                        <span className="text-2xl font-bold">{formatDuration(Math.round(stats.avgCallDuration))}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <DollarSign className="h-5 w-5 text-green-600" />
                          <span className="font-medium">Hourly Rate</span>
                        </div>
                        <span className="text-2xl font-bold">{formatCurrency(userSettings?.pay_rate || 0, userSettings?.preferred_currency)}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <TrendingUp className="h-5 w-5 text-purple-600" />
                          <span className="font-medium">Growth Rate</span>
                        </div>
                        <span className="text-2xl font-bold text-green-600">+23%</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="history" className="mt-0">
              <Card className="glass border-border/50">
                <CardHeader>
                  <CardTitle>Call History</CardTitle>
                  <CardDescription>Complete log of your interpretation sessions</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {loading ? (
                      <div className="text-center py-8 text-muted-foreground">
                        Loading call history...
                      </div>
                    ) : recentCalls.length > 0 ? (
                      recentCalls.map((call) => (
                        <div
                          key={call.id}
                          className="flex items-center justify-between p-4 glass rounded-lg hover-lift"
                        >
                          <div className="flex-1">
                            <div className="font-medium">
                              {formatDate(call.start_time)}
                            </div>
                            <div className="text-sm text-muted-foreground mt-1">
                              Duration: {formatDuration(call.duration_seconds || 0)}
                            </div>
                            {call.notes && (
                              <div className="text-sm text-muted-foreground mt-1 italic">
                                "{call.notes}"
                              </div>
                            )}
                          </div>
                          <div className="text-right">
                            <div className="font-semibold text-lg">{formatCurrency(call.earnings || 0, call.currency)}</div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8 text-muted-foreground">
                        No call history available. Start tracking calls to see your history here!
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Getting Started Section */}
        <section className="py-20">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Get Started in 3 Steps
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Your path to better practice management
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="space-y-12">
              {/* Step 1 */}
              <div className="flex gap-8 items-start">
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 glass rounded-full flex items-center justify-center">
                    <span className="text-2xl font-bold text-primary">1</span>
                  </div>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <Settings className="w-6 h-6 text-primary" />
                    <h3 className="text-2xl font-semibold">Set Your Pay Rate</h3>
                  </div>
                  <p className="text-muted-foreground mb-4">
                    Configure your hourly or per-minute rate in your preferred currency. Update anytime in Settings.
                  </p>
                  <Button className="glass-button hover-lift">
                    <Settings className="w-4 h-4 mr-2" />
                    Configure Settings
                  </Button>
                </div>
              </div>

              {/* Step 2 */}
              <div className="flex gap-8 items-start">
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 glass rounded-full flex items-center justify-center">
                    <span className="text-2xl font-bold text-primary">2</span>
                  </div>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <Phone className="w-6 h-6 text-primary" />
                    <h3 className="text-2xl font-semibold">Track Your Sessions</h3>
                  </div>
                  <p className="text-muted-foreground mb-4">
                    Click "Start Call" when you begin an interpretation session. Add notes and click "End Call" when finished.
                  </p>
                  <div className="p-4 glass rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-semibold">Example Session</span>
                      <Badge variant="outline">45:30</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">Medical interpretation - Hospital ER</p>
                  </div>
                </div>
              </div>

              {/* Step 3 */}
              <div className="flex gap-8 items-start">
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 glass rounded-full flex items-center justify-center">
                    <span className="text-2xl font-bold text-primary">3</span>
                  </div>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <BarChart3 className="w-6 h-6 text-primary" />
                    <h3 className="text-2xl font-semibold">View Analytics</h3>
                  </div>
                  <p className="text-muted-foreground mb-4">
                    Access your dashboard to view earnings, session statistics, and performance trends over time.
                  </p>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-5 h-5 text-primary" />
                      <span className="text-sm">Monthly earnings summary</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-5 h-5 text-primary" />
                      <span className="text-sm">Session history with notes</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-5 h-5 text-primary" />
                      <span className="text-sm">Performance trend charts</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <div className="text-center mt-16">
          <Card className="p-8 glass border-primary/30 max-w-2xl mx-auto hover-lift">
            <h3 className="text-2xl font-bold mb-4">Ready to Optimize Your Practice?</h3>
            <p className="text-muted-foreground mb-6">
              Start tracking your calls today and gain insights into your interpretation business.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="glass-button hover-lift">
                <Zap className="w-4 h-4 mr-2" />
                Start Tracking Now
              </Button>
              <Button size="lg" variant="outline" className="glass hover-lift">
                Learn More
              </Button>
            </div>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default InterpreTrackEnhanced;
