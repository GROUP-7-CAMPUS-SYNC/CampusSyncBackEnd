import ReportItem from "../models/reportType.js";

export const createReportItem = async (request, response) => {    
    try
    {
        const {
            reportType,
            itemName,
            description,
            turnOver,
            locationDetails,
            contactDetails,
            dateLostOrFound,
            image
        } = request.body;

        // 2. Security: Get User ID from Token (Never trust req.body for user ID)
        // Assuming your 'protect' middleware populates request.userRegistrationDetails
        const postedBy = request.userRegistrationDetails._id; 

        // 3. Validation
        // Check Required Fields (turnOver is excluded)
        if (!reportType || !itemName || !description || !locationDetails || !contactDetails || !dateLostOrFound || !image || !postedBy) {
            return response.status(400).json({ 
                message: "Missing required fields. Please fill in all mandatory details." 
            });
        }

        // Validate Enum
        if (!["Lost", "Found"].includes(reportType)) {
            return response.status(400).json({ message: "Invalid reportType. Must be 'Lost' or 'Found'." });
        }

        // Validate Date
        if (isNaN(new Date(dateLostOrFound).getTime())) {
            return response.status(400).json({ message: "Invalid Date format." });
        }
        
        const newReport  = await ReportItem.create({
            reportType,
            itemName,
            description,
            turnOver: turnOver || "",
            locationDetails,
            contactDetails,
            dateLostOrFound,
            image,
            postedBy
        })

        return response
            .status(201)
            .json(newReport)

    }catch(error)
    {
        console.error("Error creating report item (ReportItem Controllers) [createReportItem]: ", error);
        return response
            .status(500)
            .json({
                message: "Internal Server Error (ReportItem Controllers) [createReportItem]",
                error: error.message
            })
    }
}

export const getAllReportItems = async (request, response) => {
    try
    {
        const { search } = request.query;

        let query = {};

        if (search) {
            query = {
                $or: [
                    { itemName: { $regex: search, $options: 'i' } },
                    { description: { $regex: search, $options: 'i' } },
                    { locationDetails: { $regex: search, $options: 'i' } },
                    { reportType: { $regex: search, $options: 'i' } } 
                ]
            };
        }

        const allReportItems = await ReportItem.find(query)
            .sort({ createdAt: -1 })
            .populate("postedBy", "firstname lastname profileLink")
            .populate("comments.user", "firstname lastname profileLink");
        return response
            .status(200)
            .json(allReportItems)

    
    }catch(error)
    {
        console.error("Error getting all report items (ReportItem Controllers) [getAllReportItems]: ", error);
        return response
            .status(500)
            .json({
                message: "Internal Server Error (ReportItem Controllers) [getAllReportItems]",
                error: error.message
            })
    }
}

export const addCommentReportItem = async (request, response) => {
    try {
        const { id } = request.params;
        const { text } = request.body;
        const userId = request.userRegistrationDetails._id;

        if (!text) return response.status(400).json({ message: "Comment text is required" });

        const updatedReport = await ReportItem.findByIdAndUpdate(
            id,
            { $push: { comments: { user: userId, text } } },
            { new: true }
        ).populate("comments.user", "firstname lastname profileLink");

        if (!updatedReport) return response.status(404).json({ message: "Report not found" });

        return response.status(200).json(updatedReport.comments);
    } catch (error) {
        console.error("Error adding report comment:", error);
        return response.status(500).json({ message: "Internal Server Error" });
    }
};

export const editCommentReportItem = async (request, response) => {
    try {
        const { id, commentId } = request.params;
        const { text } = request.body;
        const userId = request.userRegistrationDetails._id;

        const report = await ReportItem.findById(id);
        if (!report) return response.status(404).json({ message: "Report not found" });

        const comment = report.comments.id(commentId);
        if (!comment) return response.status(404).json({ message: "Comment not found" });

        if (comment.user.toString() !== userId.toString()) {
            return response.status(403).json({ message: "Unauthorized" });
        }

        comment.text = text;
        await report.save();

        const updatedReport = await ReportItem.findById(id).populate("comments.user", "firstname lastname profileLink");
        return response.status(200).json(updatedReport.comments);
    } catch (error) {
        console.error("Error editing report comment:", error);
        return response.status(500).json({ message: "Internal Server Error" });
    }
};

export const deleteCommentReportItem = async (request, response) => {
    try {
        const { id, commentId } = request.params;
        const userId = request.userRegistrationDetails._id;

        const report = await ReportItem.findById(id);
        if (!report) return response.status(404).json({ message: "Report not found" });

        const comment = report.comments.id(commentId);
        if (!comment) return response.status(404).json({ message: "Comment not found" });

        if (comment.user.toString() !== userId.toString()) {
            return response.status(403).json({ message: "Unauthorized" });
        }

        report.comments.pull(commentId);
        await report.save();

        return response.status(200).json({ message: "Comment deleted", comments: report.comments });
    } catch (error) {
        console.error("Error deleting report comment:", error);
        return response.status(500).json({ message: "Internal Server Error" });
    }
};

export const getCommentsReportItem = async (request, response) => {
    try {
        const { id } = request.params;
        const report = await ReportItem.findById(id).populate("comments.user", "firstname lastname profileLink");
        if (!report) return response.status(404).json({ message: "Report not found" });
        return response.status(200).json(report.comments);
    } catch (error) {
        console.error("Error fetching report comments:", error);
        return response.status(500).json({ message: "Internal Server Error" });
    }
};