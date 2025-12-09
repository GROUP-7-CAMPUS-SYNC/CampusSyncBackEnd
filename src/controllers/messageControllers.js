import Message from "../models/Message.js";
import User from "../models/User.js";
import mongoose from "mongoose";

// 1. Send Message
export const sendMessage = async (request, response) => {
    try {
        const { messageText } = request.body;
        const senderId = request.userRegistrationDetails._id;
        const receiverId = request.params.id; 

        if (!messageText) {
            return response.status(400).json({ message: "Message text is required" });
        }

        // Prevent chatting with self
        if (senderId.toString() === receiverId.toString()) {
            return response.status(400).json({ message: "You cannot send a message to yourself" });
        }

        const newMessage = await Message.create({
            sender: senderId,
            receiver: receiverId, 
            messageText
        });

        const populatedMessage = await newMessage.populate("sender", "firstname lastname profileLink");

        return response.status(201).json(populatedMessage); // 201 for Created
    } catch (error) {
        console.error("Error in sendMessage:", error);
        return response.status(500).json({ message: "Internal Server Error" });
    }
};

// 2. Get Conversation
export const getConversation = async (request, response) => {
    try {
        const { id: userToChatId } = request.params;
        const userId = request.userRegistrationDetails._id;

        // FIXED SPELLING in query
        const messages = await Message.find({
            $or: [
                { sender: userId, receiver: userToChatId },
                { sender: userToChatId, receiver: userId }
            ]
        })
        .sort({ createdAt: 1 })
        .populate("sender", "firstname lastname profileLink")
        .populate("receiver", "firstname lastname profileLink"); 

        return response.status(200).json(messages);
    } catch (error) {
        console.error("Error in getConversation:", error);
        return response.status(500).json({ message: "Internal Server Error" });
    }
};

export const getChatPartners = async (request, response) => {
    try {
        const currentUserId = request.userRegistrationDetails._id.toString();

        // 1. Fetch messages logic (Keep your existing logic here to find sorted IDs)
        const messages = await Message.find({
            $or: [{ sender: currentUserId }, { receiver: currentUserId }]
        }).sort({ createdAt: -1 }).select("sender receiver");

        const partnerIds = new Set();
        messages.forEach(msg => {
            const otherUserId = msg.sender.toString() === currentUserId 
                ? msg.receiver.toString() 
                : msg.sender.toString();
            partnerIds.add(otherUserId);
        });
        const partnerIdsArray = Array.from(partnerIds);

        // 2. Fetch User Details (Keep existing logic)
        const unsortedPartners = await User.find({
            _id: { $in: partnerIdsArray }
        }).select("firstname lastname profileLink");

        // 3. [NEW] Calculate Unread Counts using Aggregation
        // This counts messages where Receiver = Me AND Sender = Them AND isRead = false
        const unreadStats = await Message.aggregate([
            {
                $match: {
                    receiver: new mongoose.Types.ObjectId(currentUserId), // Messages sent TO me
                    sender: { $in: partnerIdsArray.map(id => new mongoose.Types.ObjectId(id)) }, // From these people
                    isRead: false // That are not read
                }
            },
            {
                $group: {
                    _id: "$sender", // Group by the person who sent it
                    count: { $sum: 1 } // Count them
                }
            }
        ]);

        // Helper function to find count from the aggregation result
        const getUnreadCount = (userId) => {
            const stat = unreadStats.find(s => s._id.toString() === userId.toString());
            return stat ? stat.count : 0;
        };

        // 4. Map and Sort (Include the new unreadCount field)
        const sortedPartners = partnerIdsArray.map(id => {
            const user = unsortedPartners.find(u => u._id.toString() === id);
            if (!user) return null;

            // Convert Mongoose document to plain object and add count
            return {
                ...user.toObject(),
                unreadCount: getUnreadCount(id) 
            };
        }).filter(user => user !== null);

        return response.status(200).json(sortedPartners);

    } catch (error) {
        console.error("Error in getChatPartners:", error);
        return response.status(500).json({ message: "Internal Server Error" });
    }
};

export const markMessagesAsRead = async (req, res) => {
    try {
        const currentUserId = req.userRegistrationDetails._id;
        const senderId = req.params.id; // The person we are talking to

        await Message.updateMany(
            { sender: senderId, receiver: currentUserId, isRead: false },
            { $set: { isRead: true } }
        );
        res.status(200).json({ success: true });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}