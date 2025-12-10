import ReportItem from "../models/reportType.js";
import SavedItem from "../models/SavedItem.js"; 

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
    try {
        const { search } = request.query;
        // 1. Get current User ID
        const currentUserId = request.userRegistrationDetails._id.toString();

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

        // 2. Fetch data (use .lean() for performance)
        const allReportItems = await ReportItem.find(query)
            .sort({ createdAt: -1 })
            .populate("postedBy", "firstname lastname profileLink email")
            .populate("comments.user", "firstname lastname profileLink")
            .lean(); 

        // 3. Inject 'isWitnessed' boolean
        const reportsWithStatus = allReportItems.map((report) => {
            const isWitnessed = report.witnesses && report.witnesses.some(
                (witness) => witness.user.toString() === currentUserId
            );

            return {
                ...report,
                isWitnessed, 
                witnessCount: report.witnesses ? report.witnesses.length : 0
            };
        });

        return response.status(200).json(reportsWithStatus);

    } catch (error) {
        console.error("Error getting all report items: ", error);
        return response.status(500).json({ message: "Server Error", error: error.message });
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

export const addWitness = async (request, response) => {
    try {
        const { id } = request.params;
        const userId = request.userRegistrationDetails._id;

        const report = await ReportItem.findById(id);

        if (!report) {
            return response.status(404).json({ message: "Report item not found." });
        }

        if (report.postedBy.toString() === userId.toString()) {
            return response.status(400).json({ 
                message: "You cannot witness your own report." 
            });
        }

        // Check if user is already a witness
        const isAlreadyWitness = report.witnesses.some(
            (witness) => witness.user.toString() === userId.toString()
        );

        if (isAlreadyWitness) {
            return response.status(400).json({ 
                message: "Action cannot be undone. You have already witnessed this item." 
            });
        }

        // Add Witness
        report.witnesses.push({ user: userId });
        await report.save();

        return response.status(200).json({ 
            message: "Witness added successfully.", 
            witnesses: report.witnesses 
        });

    } catch (error) {
        console.error("Error adding witness (ReportItem Controllers) [addWitness]: ", error);
        return response.status(500).json({
            message: "Internal Server Error (ReportItem Controllers) [addWitness]",
            error: error.message
        });
    }
}

export const isUserIsWitness = async (request, response) => {
    try {
        const { id } = request.params;
        
        // 1. Get User ID from the authenticated token
        // Ensure your auth middleware names this 'userRegistrationDetails'
        const userId = request.userRegistrationDetails._id; 

        // 2. Find the Report
        const report = await ReportItem.findById(id);

        if (!report) {
            return response.status(404).json({ message: "Report item not found." });
        }

        // 3. Compare User ID with Witnesses Array
        const isAlreadyWitness = report.witnesses.some(
            (witness) => witness.user.toString() === userId.toString()
        );

        // 4. Return Boolean Result
        return response.status(200).json({ isWitness: isAlreadyWitness });

    } catch(error) {
        console.error("Error checking witness status:", error);
        return response.status(500).json({ message: "Server Error" });
    }
}

export const getWitnessList = async (request, response) => {
    try {
        const { id } = request.params;

        // Find report, but ONLY select the witnesses field and populate the user details inside it
        const report = await ReportItem.findById(id)
            .select("witnesses") // Optimization: Don't fetch the whole report, just witnesses
            .populate({
                path: "witnesses.user",
                select: "firstname lastname profileLink" // Only get necessary user fields
            });

        if (!report) {
            return response.status(404).json({ message: "Report not found" });
        }

        return response.status(200).json(report.witnesses);

    } catch (error) {
        console.error("Error fetching witness list:", error);
        return response.status(500).json({ message: "Server Error" });
    }
};

export const deleteReportItem = async (request, response) => {
    try {
        const { id } = request.params;
        const userId = request.userRegistrationDetails._id;

        // 1. Find the report
        const report = await ReportItem.findById(id);

        if (!report) {
            return response.status(404).json({ message: "Report item not found." });
        }

        // 2. Check Ownership (Security)
        if (report.postedBy.toString() !== userId.toString()) {
            return response.status(403).json({ 
                message: "Unauthorized. You can only delete your own posts." 
            });
        }

        // 3. Cascade Delete: Remove this post from everyone's Saved Items
        await SavedItem.deleteMany({ 
            post: id, 
            postModel: "ReportItem" 
        });

        // 4. Delete the Report itself
        await ReportItem.findByIdAndDelete(id);

        return response.status(200).json({ message: "Post deleted successfully." });

    } catch (error) {
        console.error("Error deleting report item:", error);
        return response.status(500).json({ message: "Internal Server Error" });
    }
};

export const updateReportItem = async (request, response) => {
    try {
        const { id } = request.params;
        const userId = request.userRegistrationDetails._id;
        
        // 1. Destructure potential updates
        const {
            reportType,
            itemName,
            description,
            turnOver,
            locationDetails,
            contactDetails,
            dateLostOrFound,
            image // This might be the old URL string or a new URL string from Cloudinary
        } = request.body;

        // 2. Find the existing report
        const report = await ReportItem.findById(id);

        if (!report) {
            return response.status(404).json({ message: "Report item not found." });
        }

        // 3. Check Ownership
        if (report.postedBy.toString() !== userId.toString()) {
            return response.status(403).json({ 
                message: "Unauthorized. You can only update your own posts." 
            });
        }

        // 4. Update Fields (Only if provided in body, otherwise keep old value)
        // Note: For turnOver, we check undefined because empty string is a valid update
        if(reportType) report.reportType = reportType;
        if(itemName) report.itemName = itemName;
        if(description) report.description = description;
        if(turnOver !== undefined) report.turnOver = turnOver;
        if(locationDetails) report.locationDetails = locationDetails;
        if(contactDetails) report.contactDetails = contactDetails;
        if(dateLostOrFound) report.dateLostOrFound = dateLostOrFound;
        if(image) report.image = image;

        const updatedReport = await report.save();

        return response.status(200).json({
            message: "Report updated successfully.",
            data: updatedReport
        });

    } catch (error) {
        console.error("Error updating report item:", error);
        return response.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};