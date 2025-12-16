import Event from "../models/Event.js";
import Academic from "../models/Academic.js";
import ReportItem from "../models/reportType.js";

export const performGlobalSearch = async (request, response) => {
    try {
        const { search } = request.query;

        if (!search) {
            return response.status(400).json({ message: "Search term is required" });
        }

        const regex = { $regex: search, $options: "i" };

        // Run queries in parallel
        // We use .lean() to convert Mongoose documents to plain JS objects
        // This allows us to modify them (add 'feedType') easily and improves performance.
        const [events, academics, reports] = await Promise.all([
            // 1. Search Events
            Event.find({
                $or: [
                    { eventName: regex },
                    { location: regex },
                    { course: regex }
                ]
            })
                .sort({ createdAt: -1 })
                .populate("postedBy", "firstname lastname profileLink email")
                .populate({
                    path: "organization",
                    select: "organizationName profileLink",
                    populate: {
                        path: "organizationHeadID",
                        select: "email"
                    }
                })
                .populate("comments.user", "firstname lastname profileLink")
                .lean(),

            // 2. Search Academic
            Academic.find({
                $or: [
                    { title: regex },
                    { content: regex }
                ]
            })
                .sort({ createdAt: -1 })
                .populate("postedBy", "firstname lastname profileLink email")
                .populate({
                    path: "organization",
                    select: "organizationName profileLink",
                    populate: {
                        path: "organizationHeadID",
                        select: "email"
                    }
                })
                .populate("comments.user", "firstname lastname profileLink")

                .lean(),

            // 3. Search Report Items (Lost & Found)
            ReportItem.find({
                $or: [
                    { itemName: regex },
                    { description: regex },
                    { locationDetails: regex }
                ]
            })
                .sort({ createdAt: -1 })
                .populate("postedBy", "firstname lastname profileLink email")
                .populate("comments.user", "firstname lastname profileLink")
                .lean()
        ]);

        // Add 'feedType' identifier to each item so the frontend knows which component to render
        const formattedEvents = events.map(item => ({ ...item, feedType: "event" }));
        const formattedAcademics = academics.map(item => ({ ...item, feedType: "academic" }));
        const formattedReports = reports.map(item => ({ ...item, feedType: "report" }));

        // Combine all results into a single flat array
        const combinedResults = [
            ...formattedEvents,
            ...formattedAcademics,
            ...formattedReports
        ];

        // Sort combined results by date (Newest First)
        combinedResults.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

        return response.status(200).json(combinedResults);

    } catch (error) {
        console.error("Error performing global search:", error);
        return response.status(500).json({ message: "Internal Server Error" });
    }
};