import mongoose from "mongoose";

const lostFoundItemSchema = new mongoose.Schema({
    reportType: {
        type: String,
        required: true,
        enum: ["Lost", "Found"]
    },

    itemName: {
        type: String,
        required: true,
        trim: true
    },

    description: {
        type: String,
        required: true,
    },

    turnOver: {
        type: String,
        default: ""
    },

    locationDetails: {
        type: String,
        required: true
    },

    contactDetails: {
        type: String,
        required: true
    },

    dateLostOrFound: {
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

    status: {
        type: String,
        enum: ["active", "claimed", "recovered"],
        default: "active"
    },

    witnesses: [{
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        vouchTime: {
            type: Date,
            default: Date.now
        }
    }],

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
}, 
{
    timestamps: true
})

const ReportItem = mongoose.model("ReportItem", lostFoundItemSchema);

export default ReportItem