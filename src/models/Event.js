import e from "cors";
import mongoose from "mongoose";

const eventSchema = new mongoose.Schema({
    type: {
        type: String,
        default: "event"
    },

    eventName: {
        type: String,
        required: true,
        trim: true
    },

    location: {
        type: String,
        required: true,
        trim: true
    },

    course:{
        type: String,
        required: true,
    },

    openTo:{
        type: String,
        required: true,
        trim: true
    },

    startDate: {
        type: Date,
        required: true
    },

    endDate: {
        type: Date,
        required: true
    },

    image: {
        type: String,
        required: true
    },

    postedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    organization: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Organization",
        required: true
    },

    comments: [{
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        text: {
            type: String,
            required: true
        },
        createdAt: {
            type: Date,
            default: Date.now
        }
    }]
}, {
    timestamps: true
})

const Event = mongoose.model("Event", eventSchema);

export default Event;