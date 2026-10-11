import { Badge } from "antd";
import { Link } from "react-router-dom";
import { Bell } from "lucide-react";
import { useNotificationSummary } from "../notifications/hooks/useNotifications";

const NotificationBall = () => {
  const { data } = useNotificationSummary();
  const unread = data?.unread ?? 0;

  return (
    <Link to={"notifications"} aria-label={`Notifications${unread ? `, ${unread} unread` : ""}`}>
      <Badge dot={unread > 0} color="#7C3AED" offset={[-4, 4]}>
        <div className="w-9 h-9 flex items-center justify-center rounded-full text-gray-500 hover:bg-violet-50 hover:text-[#2E1065] dark:text-gray-400 dark:hover:bg-[#1b1b1b] transition cursor-pointer">
          <Bell className="w-5 h-5" />
        </div>
      </Badge>
    </Link>
  );
};
export default NotificationBall;
