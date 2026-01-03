import { apiGet, apiPut, apiDelete } from "../../../../services/apiCall";
import type { NotificationResponse } from "../interface/notificationTypes";

// ✅ Get all user notifications
export const getNotifications = async (): Promise<NotificationResponse[]> => {
  return await apiGet<NotificationResponse[]>("/notifications");
};

export const markNotificationRead = async (id: string) => {
  return await apiPut(`/notifications/${id}/read`, {});
};

export const markAllNotificationsRead = async () => {
  return await apiPut(`/notifications/mark-all-read`, {});
};

// ✅ Delete a notification
export const deleteNotification = async (id: string): Promise<void> => {
  return await apiDelete(`/notifications/${id}`);
};
