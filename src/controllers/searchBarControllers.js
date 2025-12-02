import SearchHistory from "../models/SearchHistory.js";
import Event from "../models/Event.js";       // Needed for population
import Academic from "../models/Academic.js"; // Needed for population
import ReportItem from "../models/reportType.js"; // Needed for population

// POST: When a user clicks a result, save it to history
export const logSearchInteraction = async (request, response) => {
    try {
        const userId = request.userRegistrationDetails._id;
        const { queryText, searchContext } = request.body;

        if (!queryText || !searchContext) {
            return response.status(400).json({ message: "Missing query text or context" });
        }

        // Find existing search text for this user in this context.
        // If found -> Update 'updatedAt' to bring it to the top.
        // If not found -> Create new entry.
        await SearchHistory.findOneAndUpdate(
            { 
                user: userId, 
                queryText: queryText.toLowerCase(), // Ensure matching logic
                searchContext: searchContext 
            },
            {
                user: userId,
                queryText: queryText.toLowerCase(),
                searchContext,
                updatedAt: new Date()
            },
            { upsert: true, new: true, setDefaultsOnInsert: true }
        );

        return response.status(200).json({ message: "Search logged" });

    } catch (error) {
        console.error("Error logging search:", error);
        return response.status(500).json({ message: "Internal Server Error" });
    }
};

// GET: Retrieve history based on context (Global gets everything)
export const getRecentSearches = async (request, response) => {
    try {
        const userId = request.userRegistrationDetails._id;
        const { context } = request.query; // e.g., ?context=event

        // 1. Base Query: Always match the user
        let query = { user: userId };

        // 2. Context Filter (Simplified)
        // We no longer map "event" -> "Event". We just check the string directly.
        if (context && context !== 'global') {
            query.searchContext = context; 
        }

        // 3. Fetch History (No populate needed)
        const history = await SearchHistory.find(query)
            .sort({ updatedAt: -1 }) // Newest first
            .limit(10);              // Limit to 10 items

        // 4. Map Results
        // We just need the text and the ID of the history item (for unique keys)
        const processedHistory = history.map(item => ({
            _id: item._id,
            queryText: item.queryText,
            searchContext: item.searchContext,
            createdAt: item.createdAt
        }));

        return response.status(200).json(processedHistory);

    } catch (error) {
        console.error("Error fetching recent searches:", error);
        return response.status(500).json({ message: "Internal Server Error" });
    }
};

// DELETE: Clear a specific history item (optional, for "X" button on frontend)
export const removeSearchHistoryItem = async (request, response) => {
    try {
        const { historyId } = request.params;
        await SearchHistory.findByIdAndDelete(historyId);
        return response.status(200).json({ message: "Removed from history" });
    } catch (error) {
        return response.status(500).json({ message: "Error deleting history item" ,
             error: error.message
        });
    }
};