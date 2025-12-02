import Notification from "../models/Notification.js";
import User from "../models/User.js";

export const notifyOrganizationFollowers = async (organizationId, senderId, referenceId, referenceModel, message) =>
{
    try
    {

        const followers = await User.find({
            following: organizationId
        }).select("_id");

        if(!followers || followers.length === 0){
            console.log("[Notification Helper]No followers found")
        }


        const notification = followers
            .filter(user => user._id.toString() !== senderId.toString())
            .map(user => ({
                recipient: user._id,
                sender: senderId,           // Who clicked the button (Admin/Head)
                organization: organizationId, // The Organization entity
                type: "NEW_POST",
                referenceId: referenceId,   // ID of Event/Academic/Report
                referenceModel: referenceModel, // String: "Event", "Academic", "ReportItem"
                message: message,
                isRead: false
            }));

        if (notification.length === 0) return;

        await Notification.insertMany(notification);
    }
    catch(error)
    {
        console.error("Error notifying followers (Notification Helper) [notifyOrganizationFollowers]: ", error);
        return response
            .status(500)
            .json({
                message: "Internal Server Error (Notification Helper) [notifyOrganizationFollowers]",
                error: error.message
            })
    }
}

export const notifyUser = async (userId, senderId, referenceId, referenceModel, message) => {
    
    try
    {
        if(senderId.toString() === userId.toString()) return;

        await Notification.create({
            recipient: recipientId,
            sender: senderId,
            // organization: null, // (Optional: explicit null if strictly user-to-user)
            type: "MENTION",
            referenceId: referenceId,
            referenceModel: referenceModel,
            message: message,
            isRead: false
        });
        
        console.log(`[Notification System] Notification sent to user ${recipientId}`);
    }
    catch(error)
    {
        console.log("Error notifying user (Notification Helper) [notifyUser]: ", error);
        return response
            .status(500)
            .json({
                message: "Internal Server Error (Notification Helper) [notifyUser]",
                error: error.message
        })
    }
}