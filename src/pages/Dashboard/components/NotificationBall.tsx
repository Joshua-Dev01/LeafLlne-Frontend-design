import { useEffect, useState } from "react";
import { Badge } from "antd";import type { NotificationResponse } from "../notifications/interface/notificationTypes";
import { getNotifications } from "../notifications/api/api";
import { Link } from "react-router-dom";
import { Bell } from "lucide-react";


const NotificationBall = () => {
  const [notifications, setNotifications] = useState<NotificationResponse[]>(
    []
  );

  // Fetch notifications for badge count
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await getNotifications();
        setNotifications(res || []);
      } catch (err) {
        console.error("Failed to fetch notifications", err);
        setNotifications([]);
      }
    };
    fetchNotifications();

    // Optional: poll every 30 seconds
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Link to={"notifications"}>
      <Badge dot={notifications.length > 0} color="#7C3AED" offset={[-4, 4]}>
        <div className="w-9 h-9 flex items-center justify-center rounded-full text-gray-500 hover:bg-violet-50 hover:text-[#2E1065] dark:text-gray-400 dark:hover:bg-[#1b1b1b] transition cursor-pointer">
          <Bell className="w-5 h-5" />
        </div>
      </Badge>
    </Link>
  );
};
export default NotificationBall;