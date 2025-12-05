import mongoose from "mongoose";

const eventSubcriberSchema = new mongoose.Schema({
    event: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Event",
        required: true
    },

    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    isNotified: {
        type: Boolean,
        default: false
    }
}, 
{
    timestamps: true
})

// COMPOUND INDEX: 
// Ensures a user can only subscribe to the same event once.
eventSubcriberSchema.index({ event: 1, user: 1 }, { unique: true });

const EventSubscriber = mongoose.model("EventSubscriber", eventSubcriberSchema);

export default EventSubscriber;