import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema({
    // The user receiving the notification
    recipient: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "User", 
        required: true 
    },

    // The entity triggering the notification (User or Org)
    sender: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "User" 
    }, 
    
    // Optional: If the notification comes from an Organization (for "New Post" types)
    organization: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Organization"
    },

    type: { 
        type: String, 
        enum: ["NEW_POST", "MENTION", "SYSTEM"], 
        required: true 
    },

    referenceId: { 
        type: mongoose.Schema.Types.ObjectId, 
        required: true,
        refPath: 'referenceModel' 
    },
    
    referenceModel: {
        type: String,
        required: true,
        enum: ["Event", "Academic", "ReportItem"] 
    },

    message: { 
        type: String, 
        required: true 
    },

    isRead: { 
        type: Boolean, 
        default: false 
    }
}, 
{ 
    timestamps: true 
});

// Optimization: Index for faster retrieval of a user's notifications
notificationSchema.index({ recipient: 1, createdAt: -1 });

const Notification = mongoose.model("Notification", notificationSchema);

export default Notification;