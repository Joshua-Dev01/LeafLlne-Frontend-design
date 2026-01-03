import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Bell, CheckCheck,  MoreHorizontal } from "lucide-react";
import { Card, CardContent } from "../../../components/ui/card";
import { Skeleton } from "../../../components/ui/skeleton";
import { Separator } from "../../../components/ui/separator";
import { Button } from "../../../components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "../../../components/ui/dropdown-menu";
import { cn } from "../../../lib/utils";
import {
  deleteNotification,
  getNotifications,
  markAllNotificationsRead,
  markNotificationRead,
} from "./api/api";
import type { NotificationResponse } from "./interface/notificationTypes";
import { EmptyState } from "../../../components/Empty/EmptyState";

export default function NotificationList() {
  const queryClient = useQueryClient();

  const { data: notifications, isLoading } = useQuery<NotificationResponse[]>({
    queryKey: ["notifications"],
    queryFn: getNotifications,
  });

  const markReadMutation = useMutation({
    mutationFn: markNotificationRead,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["notifications"] }),
  });

  const markAllReadMutation = useMutation({
    mutationFn: markAllNotificationsRead,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["notifications"] }),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteNotification,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["notifications"] }),
  });

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="w-full h-10 rounded-xl" />
        ))}
      </div>
    );
  }

  return (
    <div className="w-full  space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold flex items-center gap-1">
          Notifications <Bell className="h-4 w-4" />
          <span className="ml-1 text-sm text-muted-foreground">
            ({notifications?.length || 0})
          </span>
        </h2>

        <Button
          variant="outline"
          size="sm"
          disabled={notifications?.every((n) => n.isRead)}
          onClick={() => markAllReadMutation.mutate()}
          className="cursor-pointer"
        >
          Mark all
          <CheckCheck className="ml-1 h-4 w-4" />
        </Button>
      </div>

      <Separator />

      {notifications?.length === 0 ? (
        <p className="text-center text-muted-foreground py-4">
          <EmptyState />
        </p>
      ) : (
        notifications?.map((item) => (
          <Card
            key={item._id}
            className={cn(
              "cursor-pointer transition-all  hover:shadow-md bg-white",
              !item.isRead && "bg-white dark:bg-blue-900/30"
            )}
          >
            <CardContent className="flex justify-between items-center h-16 ">
              <div className="flex items-center gap-3">
                {/* Blue dot for unread */}
                {!item.isRead && (
                  <div className="h-3 w-3 rounded-full bg-blue-500" />
                )}

                {/* Icon */}
                <div className="text-xl">{item.icon || "🔔"}</div>

                <div>
                  <p className={cn("text-sm", !item.isRead && "font-semibold")}>
                    {item.title}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {item.message}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {new Date(item.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={(e) => e.stopPropagation()}
                    className="cursor-pointer"
                  >
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="cursor-pointer">
                  {!item.isRead && (
                    <DropdownMenuItem
                      onClick={() => markReadMutation.mutate(item._id)}
                      className="cursor-pointer"
                    >
                      Mark as read
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem
                    onClick={() => deleteMutation.mutate(item._id)}
                    className="cursor-pointer"
                  >
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
}
