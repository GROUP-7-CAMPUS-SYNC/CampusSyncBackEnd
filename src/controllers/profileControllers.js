import ReportItem from "../models/reportType.js";
import Event from "../models/Event.js";
import Academic from "../models/Academic.js";
import User from "../models/User.js";

export const getUserPosts = async (request, response) => {
    try {
        const userId = request.userRegistrationDetails._id;

        // 2. Fetch User-Specific Data in Parallel
        // We use .lean() for performance and to enable property injection
        const [reports, events, academics] = await Promise.all([
            ReportItem.find({ postedBy: userId })
                .populate("postedBy", "firstname lastname profileLink email")
                .populate("comments.user", "firstname lastname profileLink")
                .sort({ createdAt: -1 })
                .lean(),

            Event.find({ postedBy: userId })
                .populate("postedBy", "firstname lastname email")
                .populate({
                    path: "organization",
                    select: "organizationName profileLink",
                    populate: {
                        path: "organizationHeadID",
                        select: "email"
                    }
                })
                .populate("comments.user", "firstname lastname profileLink")

                .sort({ createdAt: -1 })
                .lean(),

            Academic.find({ postedBy: userId })
                .populate("postedBy", "firstname lastname email")
                .populate({
                    path: "organization",
                    select: "organizationName profileLink",
                    populate: {
                        path: "organizationHeadID",
                        select: "email"
                    }
                })
                .populate("comments.user", "firstname lastname profileLink")

                .sort({ createdAt: -1 })
                .lean()
        ]);

        // 3. Inject feedType for Frontend Rendering
        const taggedReports = reports.map(item => ({ ...item, feedType: "report" }));
        const taggedEvents = events.map(item => ({ ...item, feedType: "event" }));
        const taggedAcademics = academics.map(item => ({ ...item, feedType: "academic" }));

        // 4. Merge and Sort (Newest First)
        const userPosts = [...taggedReports, ...taggedEvents, ...taggedAcademics].sort((a, b) => {
            return new Date(b.createdAt) - new Date(a.createdAt);
        });

        return response.status(200).json(userPosts);

    } catch (error) {
        console.error("Error fetching user posts (Profile Controller):", error);
        return response.status(500).json({
            message: "Internal Server Error fetching user profile posts",
            error: error.message
        });
    }
};

export const updateProfilePicture = async (request, response) => {
    try {
        const userId = request.userRegistrationDetails._id;
        const { profileLink } = request.body;

        if (!profileLink) {
            return response.status(400).json({ message: "Profile link is required" });
        }

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { profileLink },
            { new: true }
        ).select("-password");

        if (!updatedUser) {
            return response.status(404).json({ message: "User not found" });
        }

        return response.status(200).json({
            message: "Profile picture updated successfully",
            user: updatedUser
        });

    } catch (error) {
        console.error("Error updating profile picture:", error);
        return response.status(500).json({
            message: "Internal Server Error updating profile picture",
            error: error.message
        });
    }
};