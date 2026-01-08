import React from "react";
import {
  PieChart,
  Pie,
  BarChart,
  Bar,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useQuery } from "@tanstack/react-query";
import CountUp from "react-countup";
import { Calendar, Users, Target, AlertCircle, TrendingUp } from "lucide-react";

import { getEventAnalyticsApi } from "../api/AnalyticsApi";
import type { EventAnalytics } from "../interface/analyticsTypes";
import { Skeleton } from "../../../../components/ui/skeleton";
import { EmptyState } from "../../../../components/Empty/EmptyState";

/* -------------------- STAT CARD -------------------- */
interface StatCardProps {
  icon: React.ElementType;
  title: string;
  value: number;
  subtitle?: string;
  color: string;
}

const StatCard: React.FC<StatCardProps> = ({
  icon: Icon,
  title,
  value,
  subtitle,
  color,
}) => (
  <div
    className="bg-white dark:bg-gray-900 rounded-xl shadow-md hover:shadow-lg transition-shadow p-6 border-l-4"
    style={{ borderColor: color }}
  >
    <div className="flex items-start justify-between">
      <div className="flex-1">
        <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
          {title}
        </p>
        <h3 className="text-3xl font-bold mt-2" style={{ color }}>
          <CountUp end={value} duration={1.2} />
        </h3>
        {subtitle && (
          <p className="text-xs mt-1 text-gray-500 dark:text-gray-400">
            {subtitle}
          </p>
        )}
      </div>
      <div
        className="p-3 rounded-full"
        style={{ backgroundColor: `${color}20` }}
      >
        <Icon size={22} style={{ color }} />
      </div>
    </div>
  </div>
);

/* -------------------- LOADING -------------------- */
const LoadingSkeleton = () => (
  <div className="min-h-screen p-6">
    <Skeleton className="h-9 w-[300px] mb-3" />
    <Skeleton className="h-5 w-[400px] mb-8" />

    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      {[1, 2, 3].map((i) => (
        <Skeleton key={i} className="h-[120px] rounded-xl" />
      ))}
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {[1, 2].map((i) => (
        <Skeleton key={i} className="h-[320px] rounded-xl" />
      ))}
    </div>
  </div>
);

/* -------------------- ERROR -------------------- */
const ErrorState = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="text-center">
      <AlertCircle size={48} className="mx-auto text-red-500 mb-4" />
      <h3 className="text-lg font-semibold">Failed to load analytics</h3>
      <p className="text-gray-500">Please try again later</p>
    </div>
  </div>
);

/* -------------------- TOOLTIP -------------------- */
const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload?.length) {
    return (
      <div className="bg-gray-900 text-white p-3 rounded-lg shadow">
        <p className="font-semibold">{payload[0].name}</p>
        <p className="text-sm">Count: {payload[0].value}</p>
      </div>
    );
  }
  return null;
};

/* -------------------- MAIN -------------------- */
const EventAnalyticsChart: React.FC = () => {
  const { data, isLoading, error } = useQuery<EventAnalytics>({
    queryKey: ["eventAnalytics"],
    queryFn: getEventAnalyticsApi,
    staleTime: 1000 * 60 * 5,
  });

  if (isLoading) return <LoadingSkeleton />;
  if (error || !data) return <ErrorState />;

  /* ---------- SAFE SUMMARY (NO CRASH) ---------- */
  const summary = {
    totalEvents: data.summary?.totalEvents ?? 0,
    totalInterested: data.summary?.totalInterested ?? 0,
    totalGoing: data.summary?.totalGoing ?? 0,
    upcomingEvents: data.summary?.upcomingEvents ?? 0,
    ongoingEvents: data.summary?.ongoingEvents ?? 0,
    endedEvents: data.summary?.endedEvents ?? 0,
  };

  const avgConversionRate =
    summary.totalInterested > 0
      ? (summary.totalGoing / summary.totalInterested) * 100
      : 0;

  const hasEvents = summary.totalEvents > 0;

  /* -------------------- CHART DATA -------------------- */
  const statusData = [
    { name: "Upcoming", value: summary.upcomingEvents, color: "#3b82f6" },
    { name: "Ongoing", value: summary.ongoingEvents, color: "#f59e0b" },
    { name: "Ended", value: summary.endedEvents, color: "#10b981" },
  ];

  const hasStatusData = statusData.some((s) => s.value > 0);

  const barChartData =
    data.topPerformingEvents?.slice(0, 5).map((event) => ({
      name: event.title,
      engagement: event.totalEngagement,
    })) || [];

  const isDark = document.documentElement.classList.contains("dark");
  const textColor = isDark ? "#9CA3AF" : "#4B5563";
  const gridColor = isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)";

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-6xl mx-auto">
        {/* HEADER */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Your Events Overview
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Track study groups, meetings, and campus events
          </p>
        </div>

        {/* STATS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatCard
            icon={Calendar}
            title="Events Created"
            value={summary.totalEvents}
            color="#3b82f6"
          />
          <StatCard
            icon={Users}
            title="People Interested"
            value={summary.totalInterested}
            subtitle="Across all events"
            color="#8b5cf6"
          />
          <StatCard
            icon={Target}
            title="Confirmed Attendees"
            value={summary.totalGoing}
            subtitle={`${avgConversionRate.toFixed(0)}% conversion rate`}
            color="#10b981"
          />
        </div>

        {!hasEvents ? (
          <EmptyState />
        ) : (
          <>
            {/* CHARTS */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              {/* PIE */}
              <div className="bg-white dark:bg-gray-950 rounded-xl shadow-md p-6">
                <h3 className="text-lg font-semibold mb-4">Event Status</h3>

                {hasStatusData ? (
                  <ResponsiveContainer width="100%" height={280}>
                    <PieChart>
                      <Pie
                        data={statusData}
                        dataKey="value"
                        cx="50%"
                        cy="50%"
                        outerRadius={90}
                        label={(e) => `${e.name}: ${e.value}`}
                      >
                        {statusData.map((e, i) => (
                          <Cell key={i} fill={e.color} />
                        ))}
                      </Pie>
                      <Tooltip content={<CustomTooltip />} />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <p className="text-center text-gray-400">
                    No event status data available
                  </p>
                )}
              </div>

              {/* BAR */}
              <div className="bg-white dark:bg-gray-950 rounded-xl shadow-md p-6">
                <h3 className="text-lg font-semibold mb-4">
                  Most Popular Events
                </h3>

                <ResponsiveContainer width="100%" height={280}>
                  <BarChart data={barChartData}>
                    <CartesianGrid stroke={gridColor} strokeDasharray="3 3" />
                    <XAxis
                      dataKey="name"
                      tick={{ fill: textColor, fontSize: 12 }}
                      angle={-15}
                      textAnchor="end"
                      height={60}
                    />
                    <YAxis allowDecimals={false} />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar
                      dataKey="engagement"
                      fill="#8b5cf6"
                      radius={[8, 8, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* QUICK INSIGHTS */}
            <div className="bg-blue-200 dark:bg-gray-950 rounded-xl shadow-lg p-6 ">
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                <TrendingUp size={20} /> Quick Insights
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                <div className="bg-white dark:!bg-blue-950 shadow-md p-6 ">
                  <p className="text-sm">Avg Attendance</p>
                  <p className="text-2xl font-bold">
                    {summary.totalEvents
                      ? Math.round(summary.totalGoing / summary.totalEvents)
                      : 0}
                  </p>
                </div>

                <div className="bg-white dark:!bg-blue-950 shadow-md p-6">
                  <p className="text-sm">Success Rate</p>
                  <p className="text-2xl font-bold">
                    {avgConversionRate.toFixed(0)}%
                  </p>
                </div>

                <div className="bg-white dark:!bg-blue-950 shadow-md p-6">
                  <p className="text-sm">Active Events</p>
                  <p className="text-2xl font-bold">
                    {summary.upcomingEvents + summary.ongoingEvents}
                  </p>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default EventAnalyticsChart;
