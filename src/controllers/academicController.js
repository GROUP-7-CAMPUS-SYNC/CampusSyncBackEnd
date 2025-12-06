import Academic from "../models/Academic.js";
import Organization from "../models/Organization.js";
import { notifyOrganizationFollowers } from "../helper/notificationHelper.js";

export const getManagedOrganization = async (request, response) => {
    try
    {
        const user = request.userRegistrationDetails;

        const managedOrganization = await Organization.find({
            organizationHeadID: user._id
        })

        if(managedOrganization.length > 0)
        {
            return response
                .status(200)
                .json({
                    isHead: true,
                    organization: managedOrganization
                })
        }
        else
        {
            return response
                .status(200)
                .json({
                    isHead: false,
                    organization: null
                })
        }
    } 
    catch(error)
    {
        console.error("Error getting managed organization (Academic Controllers) [getManagedOrganization]: ", error);
        return response
            .status(500)
            .json({
                message: "Internal Server Error (Academic Controllers) [getManagedOrganization]",
                error: error.message
            })
    }
}

export const createPostAcademic = async (request, response) => {
    try {
        // 1. Get User Info from Middleware
        const user = request.userRegistrationDetails;
        
        // 2. Get Data from Body
        const { title, content, image, organizationId } = request.body;

        // 3. Basic Validation
        if (!title || !content || !image || !organizationId) {
            return response.status(400).json({ 
                message: "Missing required fields: title, content, image, or organizationId." 
            });
        }

        // 4. Find the Organization
        const targetOrg = await Organization.findById(organizationId);

        if (!targetOrg) {
            return response.status(404).json({ message: "Organization not found." });
        }

        // 5. SECURITY CHECK: Is this user the head of THIS organization?
        // We compare the ID stored in the Org document vs the ID of the requester
        if (targetOrg.organizationHeadID.toString() !== user._id.toString()) {
            return response.status(403).json({ 
                message: "Forbidden: You are not the head of this organization." 
            });
        }

        // 6. Create the Post
        const newPost = new Academic({
            title,
            content,
            image,
            organization: organizationId,
            postedBy: user._id,
            type: "academic" // Explicitly setting type, though default exists
        });

        // 7. Save to Database
        const savedPost = await newPost.save();

        notifyOrganizationFollowers(
            organizationId,                // Organization ID
            user._id,                      // Sender ID
            savedPost._id,                 // Reference ID (The Academic Post)
            "Academic",                    // Reference Model Name
            `New Academic Post: ${title}`  // The Message
        );

        // 8. Return Success
        return response.status(201).json({
            message: "Academic post created successfully",
            post: savedPost
        });

    } catch (error) {
        console.error("Error creating academic post (Academic Controllers) [createPostAcademic]:", error);
        return response.status(500).json({
            message: "Internal Server Error (Academic Controllers) [createPostAcademic]",
            error: error.message
        });
    }
};

export const getAllAcademicPosts = async (request, response) => {
    try {

        const { search } = request.query;
        let query = {};

        if (search) {
            query = {
                $or: [
                    { title: { $regex: search, $options: 'i' } },
                    { content: { $regex: search, $options: 'i' }}                ]
            }
        }
        // Fetch all posts, sorted by newest first
        const posts = await Academic.find(query)
            .sort({ createdAt: -1 }) // Descending order
            .populate("postedBy", "firstname lastname") // Get author name
            .populate("organization", "organizationName profileLink") // Get org details
            .populate("comments.user", "firstname lastname profileLink");

        return response.status(200).json(posts);

    } catch (error) {
        console.error("Error fetching academic posts (Academic Controllers) [getAllAcademicPosts]:", error);
        return response.status(500).json({
            message: "Internal Server Error (Academic Controllers) [getAllAcademicPosts]",
            error: error.message
        });
    }
};

// POST: Add a comment
export const addCommentAcademic = async (request, response) => {
    try {
        const { id } = request.params; // Post ID
        const { text } = request.body;
        const userId = request.userRegistrationDetails._id;

        if (!text) return response.status(400).json({ message: "Comment text is required" });

        const updatedPost = await Academic.findByIdAndUpdate(
            id,
            { 
                $push: { 
                    comments: { 
                        user: userId, 
                        text: text 
                    } 
                } 
            },
            { new: true } // Return updated doc
        ).populate("comments.user", "firstname lastname profileLink");

        if (!updatedPost) return response.status(404).json({ message: "Post not found" });

        return response.status(200).json(updatedPost.comments);
    } catch (error) {
        console.error("Error adding academic comment:", error);
        return response.status(500).json({ message: "Internal Server Error" });
    }
};