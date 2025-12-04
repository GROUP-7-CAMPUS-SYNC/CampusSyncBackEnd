import mongoose from "mongoose";

const savedItemSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    post: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        refPath: 'postModel' 
    },
    postModel: {
        type: String,
        required: true,
        enum: ['Academic', 'Event', 'ReportItem'] 
    }
}, {
    timestamps: true
});

savedItemSchema.index({ user: 1, post: 1, postModel: 1 }, { unique: true });

const SavedItem = mongoose.model("SavedItem", savedItemSchema);

export default SavedItem;