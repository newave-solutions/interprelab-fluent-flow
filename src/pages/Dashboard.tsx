import { useEffect, useState } from 'react';
import { Layout } from '@/components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { SettingsPanel } from '@/components/SettingsPanel';
import { GoalsPanel } from '@/components/GoalsPanel';
import { PlatformRatesPanel } from '@/components/PlatformRatesPanel';
import { Calendar, DollarSign, Clock, TrendingUp, Phone } from 'lucide-react';
import { format } from 'date-fns';

interface Stats {
  monthTotal: number;
  monthEarnings: number;
  monthCalls: number;
  yearTotal: number;
  yearEarnings: number;
  yearCalls: number;
  avgCallDuration: number;
  totalCalls: number;
}

const Dashboard = () => {
  const [stats, setStats] = useState<Stats>({
    monthTotal: 0,
    monthEarnings: 0,
    monthCalls: 0,
    yearTotal: 0,
    yearEarnings: 0,
    yearCalls: 0,
    avgCallDuration: 0,
    totalCalls: 0,
  });
  const [recentCalls, setRecentCalls] = useState<any[]>([]);
  const [currency, setCurrency] = useState('USD');
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      loadDashboardData();
    }
  }, [user]);

  const loadDashboardData = async () => {
    if (!user) return;

    const { data, error } = await supabase.rpc('get_dashboard_stats');

    if (error) {
      console.error('Error fetching dashboard stats:', error);
      return;
    }

    if (data) {
      const { settings, month_stats, year_stats, all_time_stats, recent_calls } = data;

      if (settings) {
        setCurrency(settings.preferred_currency);
      }

      setStats({
        monthTotal: month_stats.totalDuration,
        monthEarnings: month_stats.totalEarnings,
        monthCalls: month_stats.callCount,
        yearTotal: year_stats.totalDuration,
        yearEarnings: year_stats.totalEarnings,
        yearCalls: year_stats.callCount,
        avgCallDuration: all_time_stats.avgDuration,
        totalCalls: all_time_stats.callCount,
      });

      setRecentCalls(recent_calls || []);
    }
  };

  const formatDuration = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours}h ${minutes}m`;
  };

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
    }).format(amount);
  };

  return (
    <ProtectedRoute>
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-4xl font-bold mb-8">Dashboard</h1>

          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
              <TabsTrigger value="platforms">Platforms</TabsTrigger>
              <TabsTrigger value="goals">Goals</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-8">{/* Existing dashboard content */}

        {/* Monthly & Yearly Totals */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">This Month</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(stats.monthEarnings)}</div>
              <p className="text-xs text-muted-foreground">
                {stats.monthCalls} calls • {formatDuration(stats.monthTotal)}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">This Year</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(stats.yearEarnings)}</div>
              <p className="text-xs text-muted-foreground">
                {stats.yearCalls} calls • {formatDuration(stats.yearTotal)}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Call Duration</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatDuration(stats.avgCallDuration)}</div>
              <p className="text-xs text-muted-foreground">Across all calls</p>
            </CardContent>
          </Card>

          <Card>
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
        <Card>
          <CardHeader>
            <CardTitle>Recent Calls</CardTitle>
            <CardDescription>Your latest interpretation sessions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentCalls.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">
                  No calls logged yet. Start tracking your calls to see them here.
                </p>
              ) : (
                recentCalls.map((call) => (
                  <div
                    key={call.id}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div className="flex-1">
                      <div className="font-medium">
                        {format(new Date(call.start_time), 'MMM dd, yyyy • hh:mm a')}
                      </div>
                      {call.notes && (
                        <div className="text-sm text-muted-foreground mt-1">{call.notes}</div>
                      )}
                    </div>
                    <div className="text-right">
                      <div className="font-semibold">{formatCurrency(parseFloat(call.earnings))}</div>
                      <div className="text-sm text-muted-foreground">
                        {formatDuration(call.duration_seconds)}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
            </TabsContent>

            <TabsContent value="settings">
              <SettingsPanel />
            </TabsContent>

            <TabsContent value="platforms">
              <PlatformRatesPanel />
            </TabsContent>

            <TabsContent value="goals">
              <GoalsPanel />
            </TabsContent>
          </Tabs>
        </div>
      </Layout>
    </ProtectedRoute>
  );
};

export default Dashboard;
