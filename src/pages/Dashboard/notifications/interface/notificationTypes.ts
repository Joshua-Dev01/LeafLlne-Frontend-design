export interface NotificationResponse {
    _id: string;
    userId: string;
    title: string;
    message: string;
    read: boolean;
    createdAt: string;
    updatedAt: string;
    icon?: string;
    isRead: boolean
}