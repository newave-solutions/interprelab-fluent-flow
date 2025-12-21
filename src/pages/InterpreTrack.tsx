import { useState, useEffect } from 'react';
import StatsCards from '@/components/dashboard/stats-cards';
import WeeklyChart from '@/components/dashboard/weekly-chart';
import AIInsights from '@/components/dashboard/ai-insights';
import RecentCalls from '@/components/dashboard/recent-calls';
import CallTypeChart from '@/components/dashboard/call-type-chart';
import ManualLog from '@/components/dashboard/manual-log';
import { getAggregatedStats, getWeeklyData, getCallTypeStats } from '@/lib/data';

export default function InterpreTrack() {
  const [refreshKey, setRefreshKey] = useState(0);
  
  // Recompute stats when refreshKey changes
  const [stats, setStats] = useState(() => getAggregatedStats());
  const [weeklyData, setWeeklyData] = useState(() => getWeeklyData());
  const [callTypeData, setCallTypeData] = useState(() => getCallTypeStats());
  
  const aiStats = "Here are some AI stats"; // TODO: Replace with real API data
  const aiError = false;

  useEffect(() => {
    setStats(getAggregatedStats());
    setWeeklyData(getWeeklyData());
    setCallTypeData(getCallTypeStats());
  }, [refreshKey]);

  const handleCallLogged = () => {
    setRefreshKey(prev => prev + 1);
  };

  return (
    <div className="p-4 md:p-8 space-y-6">
      <header>
        <h1 className="text-3xl font-bold tracking-tight">InterpreTrack Dashboard</h1>
        <p className="text-muted-foreground">Welcome back, Interpreter!</p>
      </header>

      <StatsCards stats={stats} />

      <div className="grid gap-6 lg:grid-cols-5">
        <div className="lg:col-span-3 space-y-6">
           <ManualLog onCallLogged={handleCallLogged} />
           <WeeklyChart data={weeklyData} />
        </div>
        <div className="lg:col-span-2 grid gap-6">
          <CallTypeChart data={callTypeData} />
          <AIInsights stats={aiStats} error={aiError} />
        </div>
      </div>

      <RecentCalls key={refreshKey} />

    </div>
  );
}
