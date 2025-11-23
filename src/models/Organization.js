import mongoose from "mongoose";

const organizationSchema = new mongoose.Schema({
    
    organizationName: {
        type: String,
        required: true,
        trim: true
    },

    description: {
        type: String,
        default: ""
    },

    profileLink: {
        type: String,
        default: ""
    },

    course: {
        type: String,
        required: true,
        enum:[ "BS Civil Engineering", "BS Information Technology", "BS Computer Science", "BS Food Technology"]
    },

    members: {
        type: Number,
        default: 0
    },

    organizationHeadID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    moderators: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    }
})

const Organization = mongoose.model("Organization", organizationSchema);

export default Organization;