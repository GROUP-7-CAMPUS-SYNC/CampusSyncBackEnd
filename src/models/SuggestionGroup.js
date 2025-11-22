import mongoose from "mongoose";

const suggestionGroupSchema = new mongoose.Schema({
    groupName: {
        type: String,
        required: true,
        trim: true
    },
    course: {
        type: String,
        required: true,
        enum: [
            "BS Civil Engineering", 
            "BS Information Technology", 
            "BS Computer Science", 
            "BS Food Technology"
        ]
    },
    description: {
        type: String,
        default: ""
    },
    members: {
        type: Number,
        default: 0
    },
    // We store WHO follows this group to dynamically calculate 'isFollowed'
    followers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }]
}, {
    timestamps: true
});

// Optional: Transform _id to id for frontend compatibility if needed
suggestionGroupSchema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: function (doc, ret) {
        delete ret._id;
    }
});

const SuggestionGroup = mongoose.model("SuggestionGroup", suggestionGroupSchema);

export default SuggestionGroup;