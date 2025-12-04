import ReportItem from "../models/reportType.js";
import Event from "../models/Event.js";
import Academic from "../models/Academic.js";

export const getHomeFeed = async (request, response) => {
    try {
        // 1. Fetch from all three collections in parallel
        // We use .lean() to convert Mongoose documents to plain JS objects so we can modify them easily (add feedType)
        const [reports, events, academics] = await Promise.all([
            ReportItem.find()
                .populate("postedBy", "firstname lastname profileLink")
                .populate("comments.user", "firstname lastname profileLink")

                .sort({ createdAt: -1 })
                .lean(),
            
            Event.find()
                .populate("postedBy", "firstname lastname")
                .populate("organization", "organizationName profileLink")
                .populate("comments.user", "firstname lastname profileLink")

                .sort({ createdAt: -1 })
                .lean(),

            Academic.find()
                .populate("postedBy", "firstname lastname")
                .populate("organization", "organizationName profileLink")
                .populate("comments.user", "firstname lastname profileLink")

                .sort({ createdAt: -1 })
                .lean()
        ]);

        // 2. Tag the data so the frontend knows how to render it
        const taggedReports = reports.map(item => ({ ...item, feedType: "report" }));
        const taggedEvents = events.map(item => ({ ...item, feedType: "event" }));
        const taggedAcademics = academics.map(item => ({ ...item, feedType: "academic" }));

        // 3. Merge and Sort by Date (Newest First)
        const combinedFeed = [...taggedReports, ...taggedEvents, ...taggedAcademics].sort((a, b) => {
            return new Date(b.createdAt) - new Date(a.createdAt);
        });

        return response.status(200).json(combinedFeed);

    } catch (error) {
        console.error("Error fetching home feed:", error);
        return response.status(500).json({ 
            message: "Internal Server Error fetching Home Feed", 
            error: error.message 
        });
    }
};