import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({

    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    receiver: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    messageText: {
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

messageSchema.index({ sender: 1, reciever: 1, createdAt: -1 });
messageSchema.index({ reciever: 1, isRead: 1 });


const Message = mongoose.model("Message", messageSchema);

export default Message;