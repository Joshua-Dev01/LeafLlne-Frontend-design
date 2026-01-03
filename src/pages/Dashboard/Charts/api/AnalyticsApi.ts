import { apiGet } from "../../../../services/apiCall";
import type { EventAnalytics } from "../interface/analyticsTypes";

// fetch event analytics
export const getEventAnalyticsApi = async (): Promise<EventAnalytics> => {
    return await apiGet<EventAnalytics>("/analytics/event-analytics");
};
