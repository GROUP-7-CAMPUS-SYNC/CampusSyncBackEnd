import mongoose from "mongoose";

const searchHistorySchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    queryText: {
        type: String,
        required: true, 
        trim: true,
        lowercase: true // Store lowercase to prevent "React" and "react" duplicates
    },

    // Keeps track of WHERE they searched
    searchContext: {
        type: String,
        enum: ["global", "event", "academic", "lostfound"], 
        required: true
    }
}, 
{ 
    timestamps: true 
});

// Ensures a user only has ONE entry for "Javascript" inside the "event" context.
searchHistorySchema.index({ user: 1, queryText: 1, searchContext: 1 }, { unique: true });

const SearchHistory = mongoose.model("SearchHistory", searchHistorySchema);

export default SearchHistory;