import { useQuery } from "@tanstack/react-query";
import { Bell, FileText, Folder } from "lucide-react";
import { Skeleton } from "../../../../components/ui/skeleton";
import { Card } from "../../../../components/ui/card";
import { FaEvernote } from "react-icons/fa";
import { getOverviewStats } from "../api/overViewApi";

interface OverviewStats {
  events: number;
  projects: number;
  uploads: number;
  notifications: number;
  library: number;
}

interface DashboardMainHomeProps {
  userName: string;
}

export default function DashboardMainHome({
  userName,
}: DashboardMainHomeProps) {
  const { data, isLoading } = useQuery<OverviewStats>({
    queryKey: ["overviewStats"],
    queryFn: getOverviewStats,
  });

  const cards = [
    {
      title: "Events",
      icon: <FaEvernote className="h-6 w-6 text-white" />,
      count: data?.events,
      gradient: "from-blue-500 to-blue-600",
      link: "/events",
    },
    {
      title: "Projects",
      icon: <Folder className="h-6 w-6 text-white" />,
      count: data?.projects,
      gradient: "from-green-500 to-green-600",
      link: "/projects",
    },
    {
      title: "Uploads",
      icon: <FileText className="h-6 w-6 text-white" />,
      count: data?.uploads,
      gradient: "from-purple-500 to-purple-600",
      link: "/uploads",
    },
    {
      title: "Notifications",
      icon: <Bell className="h-6 w-6 text-white" />,
      count: data?.notifications,
      gradient: "from-red-500 to-red-600",
      link: "/notifications",
    },
    {
      title: "Library",
      icon: <Folder className="h-6 w-6 text-white" />,
      count: data?.library,
      gradient: "from-yellow-400 to-yellow-500",
      link: "/library",
    },
  ];

  return (
    <div className="w-full space-y-6">
      {/* Personalized Header */}
      <div className="space-y-1">
        <h1 className="text-3xl font-bold text-gray-900">
          Good day, {userName}! 👋
        </h1>
        <p className="text-sm text-muted-foreground max-w-xl">
          What are you working on today? Here's a quick glance at your LeafLine
          dashboard.
        </p>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
        {isLoading
          ? Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-28 rounded-xl" />
            ))
          : cards.map((card, index) => (
              <Card
                key={index}
                className="cursor-pointer hover:scale-105 hover:shadow-xl transition-transform duration-200 rounded-xl p-4 flex flex-col items-start justify-between"
                onClick={() => (window.location.href = card.link)}
              >
                {/* Top row: Icon with gradient */}
                <div
                  className={`w-12 h-12 flex items-center justify-center rounded-full bg-gradient-to-tr ${card.gradient} shadow-md mb-3`}
                >
                  {card.icon}
                </div>

                {/* Middle row: Count */}
                <p className="text-2xl font-bold text-gray-900">{card.count}</p>

                {/* Bottom row: Title */}
                <p className="text-sm font-medium text-muted-foreground">
                  {card.title}
                </p>
              </Card>
            ))}
      </div>
    </div>
  );
}
