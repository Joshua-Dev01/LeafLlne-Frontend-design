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
    <div className="flex items-center gap-7">
      {/* ... other navbar items ... */}

      {/* Notifications */}
      <Link to={"notifications"}>
        <Badge count={notifications.length} size="small">
          <Bell className="text-[24px] dark:!text-gray-700 bg-white p-1 shadow-2xl rounded-full !text-black cursor-pointer" />
        </Badge>
      </Link>

      {/* ... avatar dropdown ... */}
    </div>
  );
};
export default NotificationBall;