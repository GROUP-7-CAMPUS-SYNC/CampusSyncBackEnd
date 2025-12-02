import Notification from "../models/Notification.js";


export const getNotification = async (request, response) => {
    try
    {
        const userId = request.userRegistrationDetails._id;

        const notifications = await Notification.find({
            recipient: userId
        })
            .sort({ createdAt: -1 })
            .populate("sender", "firstname lastname profileLink")
            .populate("organization", "organizationName profileLink")
            .populate("referenceId")
        
        return response
            .status(200)
            .json(notifications)
    }
    catch(error)
    {
        console.error("Error fetching notifications (Notification Controllers) [getNotification]: ", error);
        return response
            .status(500)
            .json({
                message: "Internal Server Error (Notification Controllers) [getNotification]",
                error: error.message
            })
    }
}

export const markAsRead = async (request, response) => {
    try {
        const { notificationId } = request.params;

        const notification = await Notification.findByIdAndUpdate(
            notificationId,
            { isRead: true },
            { new: true }
        );

        if (!notification) {
            return response.status(404).json({ message: "Notification not found" });
        }

        response.status(200).json({ message: "Marked as read", notification });

    } catch (error) {
        console.error("Error fetching notifications (Notification Controllers) [markAsRead]: ", error);
        return response
            .status(500)
            .json({
                message: "Internal Server Error (Notification Controllers) [markAsRead]",
                error: error.message
        })
    }
};

export const markAllAsRead = async (request, response) => {
    try {
        const userId = request.userRegistrationDetails._id;

        await Notification.updateMany(
            { recipient: userId, isRead: false },
            { isRead: true }
        );

        response.status(200).json({ message: "All notifications marked as read" });
    } catch (error) {
        console.error("Error fetching notifications (Notification Controllers) [markAllAsRead]: ", error);
        return response
            .status(500)
            .json({
                message: "Internal Server Error (Notification Controllers) [markAllAsRead]",
                error: error.message
            })
    }
};