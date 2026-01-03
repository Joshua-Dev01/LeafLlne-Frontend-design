export interface EventAnalytics {
    // Summary stats
    summary: {
        totalEvents: number;
        totalInterested: number;
        totalGoing: number;
        totalUniqueEngagements: number;
        avgInterestedPerEvent: number;
        avgGoingPerEvent: number;
        avgConversionRate: number;
        upcomingEvents: number;
        ongoingEvents: number;
        endedEvents: number;
    };

    // Top performing events used across charts
    topPerformingEvents: {
        id: string;
        title: string;
        interestedCount: number;
        goingCount: number;
        totalEngagement: number;
        conversionRate: number; // percentage 0-100
    }[];

    // Optionally include a list of all events (lightweight)
    allEvents?: {
        id: string;
        title: string;
        date?: string;
    }[];
}
