import SavedItem from "../models/SavedItem.js";
import Academic from "../models/Academic.js";
import Event from "../models/Event.js";
import ReportItem from "../models/reportType.js";

export const toggleSavePost = async (request, response) => {
    try {
        const user = request.userRegistrationDetails;
        const { postId, type } = request.body;

        // 1. Validate Input
        if (!postId || !type) {
            return response.status(400).json({ message: "Post ID and Type are required." });
        }

        // 2. Validate Type against allowed models
        const allowedTypes = ['Academic', 'Event', 'ReportItem'];
        if (!allowedTypes.includes(type)) {
            return response.status(400).json({ message: "Invalid post type." });
        }

        // 3. Check if already saved
        const existingSave = await SavedItem.findOne({
            user: user._id,
            post: postId,
            postModel: type
        });

        if (existingSave) {
            // -- UNSAVE LOGIC --
            await SavedItem.findByIdAndDelete(existingSave._id);
            return response.status(200).json({
                message: "Post unsaved successfully",
                isSaved: false
            });
        } else {
            // -- SAVE LOGIC --
            // Optional: Verify the post actually exists in the DB before saving

            await SavedItem.create({
                user: user._id,
                post: postId,
                postModel: type
            });

            return response.status(201).json({
                message: "Post saved successfully",
                isSaved: true
            });
        }

    } catch (error) {
        console.error("Error toggling save (Saved Controller):", error);
        return response.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};

export const getSavedPosts = async (request, response) => {
    try {
        const userId = request.userRegistrationDetails._id;

        // 1. Get all Saved Items for this user first
        // We only need the 'post' ID and the 'postModel' type
        const savedItems = await SavedItem.find({ user: userId })
            .select("post postModel")
            .lean();

        if (!savedItems.length) {
            return response.status(200).json([]);
        }

        // 2. Separate the IDs into arrays based on their type
        const eventIds = [];
        const academicIds = [];
        const reportIds = [];

        savedItems.forEach(item => {
            if (item.postModel === 'Event') eventIds.push(item.post);
            else if (item.postModel === 'Academic') academicIds.push(item.post);
            else if (item.postModel === 'ReportItem') reportIds.push(item.post);
        });

        // 3. Fetch the actual Post Data in Parallel
        // NOTICE: We only populate 'organization' for Event and Academic, NOT for ReportItem
        const [reports, events, academics] = await Promise.all([
            ReportItem.find({ _id: { $in: reportIds } })
                .populate("postedBy", "firstname lastname profileLink")
                .populate("comments.user", "firstname lastname profileLink")
                .lean(),

            Event.find({ _id: { $in: eventIds } })
                .populate("postedBy", "firstname lastname")
                .populate({
                    path: "organization",
                    select: "organizationName profileLink",
                    populate: {
                        path: "organizationHeadID",
                        select: "email"
                    }
                }) // Safe here
                .populate("comments.user", "firstname lastname profileLink")
                .lean(),

            Academic.find({ _id: { $in: academicIds } })
                .populate("postedBy", "firstname lastname")
                .populate({
                    path: "organization",
                    select: "organizationName profileLink",
                    populate: {
                        path: "organizationHeadID",
                        select: "email"
                    }
                }) // Safe here
                .populate("comments.user", "firstname lastname profileLink")
                .lean()
        ]);

        // 4. Inject feedType for Frontend Rendering
        const taggedReports = reports.map(item => ({ ...item, feedType: "report" }));
        const taggedEvents = events.map(item => ({ ...item, feedType: "event" }));
        const taggedAcademics = academics.map(item => ({ ...item, feedType: "academic" }));

        // 5. Merge and Sort
        // This sorts by the POST creation date (Newest posts first)
        const combinedFeed = [...taggedReports, ...taggedEvents, ...taggedAcademics].sort((a, b) => {
            return new Date(b.createdAt) - new Date(a.createdAt);
        });

        return response.status(200).json(combinedFeed);

    } catch (error) {
        console.error("Error fetching saved posts (Saved Controller):", error);
        return response.status(500).json({
            message: "Internal Server Error",
            error: error.message
        });
    }
};

export const checkSavedStatus = async (request, response) => {
    try {
        const user = request.userRegistrationDetails;
        const { type, postId } = request.params;

        if (!postId || !type) {
            return response.status(400).json({ message: "Post ID and Type are required." });
        }

        // Check the database for an existing save entry
        const existingSave = await SavedItem.findOne({
            user: user._id,
            post: postId,
            postModel: type
        });

        // Return boolean status (!! converts object to true, null to false)
        return response.status(200).json({
            isSaved: !!existingSave
        });

    } catch (error) {
        console.error("Error checking save status:", error);
        return response.status(500).json({ message: "Internal Server Error" });
    }
};