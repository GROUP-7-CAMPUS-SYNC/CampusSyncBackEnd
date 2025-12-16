import Event from "../models/Event.js";
import Academic from "../models/Academic.js";
import ReportItem from "../models/reportType.js"; // Based on your provided imports

// --- HELPER FUNCTIONS (The Core Logic) ---

// Helper to Update a Comment
const updateCommentLogic = async (Model, postId, commentId, userId, newText, response) => {
    try {
        if (!newText) {
            return response.status(400).json({ message: "Comment text is required." });
        }

        // 1. Find the Parent Post
        const post = await Model.findById(postId);
        if (!post) {
            return response.status(404).json({ message: "Post not found." });
        }

        // 2. Find the specific comment within the array
        const comment = post.comments.id(commentId);
        if (!comment) {
            return response.status(404).json({ message: "Comment not found." });
        }

        // 3. SECURITY CHECK: Ensure the requester is the owner of the comment
        if (comment.user.toString() !== userId.toString()) {
            return response.status(403).json({ message: "Unauthorized. You can only edit your own comments." });
        }

        // 4. Update and Save
        comment.text = newText;
        await post.save();

        // Return the updated comments array (with populated user details for frontend update)
        // We need to re-fetch or populate the saved document to return clean data
        const updatedPost = await Model.findById(postId).populate("comments.user", "firstname lastname profileLink");
        
        return response.status(200).json({ 
            message: "Comment updated.", 
            comments: updatedPost.comments 
        });

    } catch (error) {
        console.error(`Error updating comment: ${error.message}`);
        return response.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};

// Helper to Delete a Comment
const deleteCommentLogic = async (Model, postId, commentId, userId, response) => {
    try {
        // 1. Find the Parent Post
        const post = await Model.findById(postId);
        if (!post) {
            return response.status(404).json({ message: "Post not found." });
        }

        // 2. Find the specific comment
        const comment = post.comments.id(commentId);
        if (!comment) {
            return response.status(404).json({ message: "Comment not found." });
        }

        // 3. SECURITY CHECK: Ensure the requester is the owner of the comment
        if (comment.user.toString() !== userId.toString()) {
            return response.status(403).json({ message: "Unauthorized. You can only delete your own comments." });
        }

        // 4. Remove the comment
        // Mongoose method to pull a subdocument from an array
        post.comments.pull(commentId);
        
        await post.save();

        // Return the updated comments array
        const updatedPost = await Model.findById(postId).populate("comments.user", "firstname lastname profileLink");

        return response.status(200).json({ 
            message: "Comment deleted.", 
            comments: updatedPost.comments 
        });

    } catch (error) {
        console.error(`Error deleting comment: ${error.message}`);
        return response.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};

// --- EXPORTED CONTROLLERS ---

// 1. EVENTS
export const updateEventComment = async (req, res) => {
    const { postId, commentId } = req.params;
    const { text } = req.body;
    const userId = req.userRegistrationDetails._id;
    return updateCommentLogic(Event, postId, commentId, userId, text, res);
};

export const deleteEventComment = async (req, res) => {
    const { postId, commentId } = req.params;
    const userId = req.userRegistrationDetails._id;
    return deleteCommentLogic(Event, postId, commentId, userId, res);
};

// 2. ACADEMIC
export const updateAcademicComment = async (req, res) => {
    const { postId, commentId } = req.params;
    const { text } = req.body;
    const userId = req.userRegistrationDetails._id;
    return updateCommentLogic(Academic, postId, commentId, userId, text, res);
};

export const deleteAcademicComment = async (req, res) => {
    const { postId, commentId } = req.params;
    const userId = req.userRegistrationDetails._id;
    return deleteCommentLogic(Academic, postId, commentId, userId, res);
};

// 3. REPORT ITEMS (Lost & Found)
export const updateReportComment = async (req, res) => {
    const { postId, commentId } = req.params;
    const { text } = req.body;
    const userId = req.userRegistrationDetails._id;
    return updateCommentLogic(ReportItem, postId, commentId, userId, text, res);
};

export const deleteReportComment = async (req, res) => {
    const { postId, commentId } = req.params;
    const userId = req.userRegistrationDetails._id;
    return deleteCommentLogic(ReportItem, postId, commentId, userId, res);
};