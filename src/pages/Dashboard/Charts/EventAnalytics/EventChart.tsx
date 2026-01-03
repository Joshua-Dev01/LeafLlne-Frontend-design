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

const LoadingSkeleton: React.FC = () => (
  <div className="min-h-screen  p-6">
    <div className="max-w-6xl mx-auto">
      {/* Header Skeleton */}
      <div className="mb-8 space-y-3">
        <Skeleton className="h-9 w-[300px]" />
        <Skeleton className="h-5 w-[400px]" />
      </div>

      {/* Stats Cards Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="rounded-xl p-6 space-y-3"
          >
            <Skeleton className="h-4 w-[120px]" />
            <Skeleton className="h-10 w-[80px]" />
            <Skeleton className="h-3 w-[150px]" />
          </div>
        ))}
      </div>

      {/* Charts Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {[1, 2].map((i) => (
          <div
            key={i}
            className="rounded-xl p-6 space-y-4"
          >
            <Skeleton className="h-6 w-[180px]" />
            <Skeleton className="h-[280px] w-full rounded-lg" />
            <Skeleton className="h-3 w-full" />
          </div>
        ))}
      </div>
    </div>
  </div>
);

/* -------------------- ERROR STATE -------------------- */
const ErrorState: React.FC = () => (
  <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-6">
    <div className="text-center">
      <AlertCircle className="mx-auto text-red-500 mb-4" size={48} />
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
        Failed to load analytics
      </h3>
      <p className="text-gray-600 dark:text-gray-400">Please try again later</p>
    </div>
  </div>
);

/* -------------------- CUSTOM TOOLTIP -------------------- */
const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-gray-900 text-white p-3 rounded-lg shadow-lg border border-gray-700">
        <p className="font-semibold">{payload[0].name}</p>
        <p className="text-sm">{`Count: ${payload[0].value}`}</p>
      </div>
    );
  }
  return null;
};

/* -------------------- MAIN COMPONENT -------------------- */
const EventAnalytics: React.FC = () => {
  const { data, isLoading, error } = useQuery<EventAnalytics>({
    queryKey: ["eventAnalytics"],
    queryFn: getEventAnalyticsApi,
    staleTime: 1000 * 60 * 5,
  });

  if (isLoading) return <LoadingSkeleton />;
  if (error || !data) return <ErrorState />;

  // Log the raw API response for debugging
  console.log("📊 API Response:", data);

  const summary = data.summary || {
    totalEvents: 0,
    totalInterested: 0,
    totalGoing: 0,
    avgConversionRate: 0,
    upcomingEvents: 0,
    ongoingEvents: 0,
    endedEvents: 0,
  };

  console.log("📈 Summary:", summary);

  const topEvents = data.topPerformingEvents?.slice(0, 5) || [];
  const hasEvents = summary.totalEvents > 0;

  /* -------------------- CHART DATA -------------------- */
  // Pie Chart Data - Event Status
  const statusData = [
    { name: "Upcoming", value: summary.upcomingEvents, color: "#3b82f6" },
    { name: "Ongoing", value: summary.ongoingEvents, color: "#f59e0b" },
    { name: "Ended", value: summary.endedEvents, color: "#10b981" },
  ];

  // Check if status data has any values
  const hasStatusData = statusData.some((item) => item.value > 0);

  // Bar Chart Data - Top Events
  const barChartData = topEvents.map((event) => ({
    name: event.title,
    engagement: event.totalEngagement,
  }));

  // Check if theme is dark
  const isDark = document.documentElement.classList.contains("dark");
  const textColor = isDark ? "#9CA3AF" : "#4B5563";
  const gridColor = isDark ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.1)";

  // Debug log
  console.log("Status Data:", statusData);
  console.log("Has Status Data:", hasStatusData);

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

        {/* STATS - 3 Essential Metrics */}
        <div className=" grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
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
            subtitle={`${summary.avgConversionRate.toFixed(
              0
            )}% conversion rate`}
            color="#10b981"
          />
        </div>

        {!hasEvents ? (
          /* EMPTY STATE */
          <div className="">
            <EmptyState />
          </div>
        ) : (
          <>
            {/* CHARTS */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              {/* CHART 1: Event Status - PIE CHART */}
              <div className="bg-white dark:bg-gray-950 rounded-xl shadow-md p-6">
                <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
                  Event Status
                </h3>

                {hasStatusData ? (
                  <ResponsiveContainer width="100%" height={280}>
                    <PieChart>
                      <Pie
                        data={statusData}
                        cx="50%"
                        cy="50%"
                        labelLine={true}
                        label={(entry) => `${entry.name}: ${entry.value}`}
                        outerRadius={90}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {statusData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip content={<CustomTooltip />} />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-[280px] flex items-center justify-center">
                    <div className="text-center">
                      <p className="text-gray-400 dark:text-gray-500">
                        No event status data available
                      </p>
                      <p className="text-xs text-gray-400 dark:text-gray-600 mt-2">
                        Events need to have status: upcoming, ongoing, or ended
                      </p>
                    </div>
                  </div>
                )}

                <p className="text-xs text-gray-500 dark:text-gray-400 mt-4 text-center">
                  Distribution of your events by status
                </p>
              </div>

              {/* CHART 2: Most Popular Events - BAR CHART */}
              <div className="bg-white dark:bg-gray-950 rounded-xl shadow-md p-6">
                <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
                  Most Popular Events
                </h3>
                <ResponsiveContainer width="100%" height={280}>
                  <BarChart data={barChartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                    <XAxis
                      dataKey="name"
                      tick={{ fill: textColor, fontSize: 12 }}
                      angle={-15}
                      textAnchor="end"
                      height={60}
                    />
                    <YAxis tick={{ fill: textColor }} allowDecimals={false} />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar
                      dataKey="engagement"
                      fill="#8b5cf6"
                      radius={[8, 8, 0, 0]}
                      name="Total Engagement"
                    />
                  </BarChart>
                </ResponsiveContainer>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-4 text-center">
                  Events with highest engagement
                </p>
              </div>
            </div>

            {/* QUICK INSIGHTS BOX */}
            <div className="bg-gray-950 rounded-xl shadow-lg p-6 text-white">
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                <TrendingUp size={20} /> Quick Insights
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white dark:bg-gray-800 bg-opacity-20 backdrop-blur-sm rounded-lg p-4">
                  <p className="text-sm opacity-90 mb-1">
                    Avg. Attendance per Event
                  </p>
                  <p className="text-2xl font-bold">
                    {summary.totalEvents > 0
                      ? Math.round(summary.totalGoing / summary.totalEvents)
                      : 0}
                  </p>
                  <p className="text-xs opacity-75 mt-1">students</p>
                </div>

                <div className="bg-white dark:bg-gray-800 bg-opacity-20 backdrop-blur-sm rounded-lg p-4">
                  <p className="text-sm opacity-90 mb-1">Success Rate</p>
                  <p className="text-2xl font-bold">
                    {summary.avgConversionRate.toFixed(0)}%
                  </p>
                  <p className="text-xs opacity-75 mt-1">
                    interested → confirmed
                  </p>
                </div>

                <div className="bg-white dark:bg-gray-800 bg-opacity-20 backdrop-blur-sm rounded-lg p-4">
                  <p className="text-sm opacity-90 mb-1">Active Events</p>
                  <p className="text-2xl font-bold">
                    {summary.upcomingEvents + summary.ongoingEvents}
                  </p>
                  <p className="text-xs opacity-75 mt-1">happening soon</p>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default EventAnalytics;
