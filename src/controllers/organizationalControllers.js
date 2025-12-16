import Organization from "../models/Organization.js"; // Organization Model
import User from "../models/User.js";
import mongoose from "mongoose";


// DATA TO SEED
const ORGANIZATION_DATA = [
    // BS Civil Engineering
    {
        organizationName: "Structural Innovators",
        course: "BS Civil Engineering",
        description: "Premier organization for structural analysis and design enthusiasts.",
        // Head: Emilio Aguinaldo
        organizationHeadID: "6922d0a91e4076e8453c5698",
        // Moderator: Gabriela Silang
        moderators: "6922d08d1e4076e8453c5695"
    },
    // BS Civil Engineering
    {
        organizationName: "Building Innovators",
        course: "BS Civil Engineering",
        description: "Premier organization for structural analysis and design enthusiasts.",
        // Head: Emilio Aguinaldo
        organizationHeadID: "6922d0a91e4076e8453c5698",
        // Moderator: Gabriela Silang
        moderators: "6922d08d1e4076e8453c5695"
    },


    // BS Information Technology
    {
        organizationName: "NetAdmin Squad",
        course: "BS Information Technology",
        description: "Network administration, security, and cloud infrastructure.",
        // Head: Juan DelaCruz
        organizationHeadID: "6922d00f1e4076e8453c5689",
        // Moderator: Gabriela Silang
        moderators: "6922d08d1e4076e8453c5695"
    },

    // BS Computer Science
    {
        organizationName: "Algorithm Aces",
        course: "BS Computer Science",
        description: "Deep dive into data structures, algorithms, and AI.",
        // Head: Jose Rizal
        organizationHeadID: "6922d0431e4076e8453c568f",
        // Moderator: Gabriela Silang
        moderators: "6922d08d1e4076e8453c5695"
    },

    // BS Food Technology
    {
        organizationName: "Food Safety Net",
        course: "BS Food Technology",
        description: "Ensuring quality and safety in food production.",
        // Head: Andres Bonifacio
        organizationHeadID: "6922d07a1e4076e8453c5692",
        // Moderator: Gabriela Silang
        moderators: "6922d08d1e4076e8453c5695"
    }
];

// SEED Controller
export const seedOrganizations = async (req, res) => {
    try {
        // 1. Clear existing organizations
        await Organization.deleteMany({});

        // 2. Insert new data (Batch Insert)
        const createdOrgs = await Organization.insertMany(ORGANIZATION_DATA);

        // 3. Update User Roles (Side Effects)
        // We iterate through the static data to assign 'moderator' roles to Heads and Moderators
        const roleUpdates = ORGANIZATION_DATA.map(async (org) => {
            // Update Head
            if (org.organizationHeadID) {
                await User.findByIdAndUpdate(org.organizationHeadID, { role: "moderator" });
            }
            // Update Moderators
            if (org.moderators && org.moderators.length > 0) {
                await User.updateMany(
                    { _id: { $in: org.moderators } },
                    { role: "moderator" }
                );
            }
        });

        // Execute all role updates in parallel for performance
        await Promise.all(roleUpdates);

        return res.status(201).json({
            message: "✅ Organizations seeded and User roles updated successfully.",
            data: createdOrgs
        });

    } catch (error) {
        console.error("Error seeding organizations:", error);
        return res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};

export const getOrganizations = async (request, response) => {
    try {
        const user = request.userRegistrationDetails;

        if (!user || !user.course) {
            return response.status(400).json({ message: "User not found or has no course assigned" });
        }

        const userCourse = user.course;
        const userId = user._id

        const organizations = await Organization.find({ course: userCourse })
            .populate("organizationHeadID", "firstname lastname")
            .populate("moderators", "firstname lastname");


        const currentUser = await User.findById(userId).select("following");

        const followedOrgIds = currentUser.following.map(org => org.toString());

        const formattedOrganizations = organizations.map(org => {
            const isFollowed = followedOrgIds.includes(org._id.toString())

            return {
                id: org._id,
                organizationName: org.organizationName,
                members: org.members,
                description: org.description,
                profileLink: org.profileLink,
                course: org.course,
                head: org.organizationHeadID,
                moderators: org.moderators,
                isFollowed: isFollowed // ✅ Boolean result
            };
        });

        return response
            .status(200)
            .json(formattedOrganizations)

    }
    catch (error) {
        console.error("Error fetching suggestions (Organization Controllers) [getOrganizations]: ", error);
        return response
            .status(500)
            .json({ message: "Internal Server Error (Organization Controllers) [getOrganizations]" });
    }
}

export const toggleFollowOrganization = async (request, response) => {
    try {
        const { organizationID } = request.params;
        const userId = request.userRegistrationDetails._id;

        // Validate ID format to prevent crashes
        if (!mongoose.Types.ObjectId.isValid(organizationID)) {
            return response
                .status(400)
                .json({ message: "Invalid organization ID" });
        }

        const orgObjectId = new mongoose.Types.ObjectId(organizationID);
        const user = await User.findById(userId); // Check if user is currently following

        // MongoDB ObjectIDs usually need casting to string for comparison, 
        // but Mongoose .includes() often handles it. converting to string is safer.
        const isFollowing = user.following.some(id => id.toString() === organizationID);

        // 2. Toggle
        let updateOrg

        if (isFollowing) {
            // Unfollow logic 
            // Remove org ID from user's following list 
            await User.findByIdAndUpdate(userId, {
                // Explicitly pull the ObjectId to match Schema type
                $pull: { following: orgObjectId }
            })

            // Decrement member count in Organization
            updateOrg = await Organization.findByIdAndUpdate(organizationID, {
                $inc: { members: -1 }
            }, { new: true })

            return response
                .status(200)
                .json({
                    message: "Unfollow successfully",
                    isFollowed: false,
                    members: updateOrg.members
                })

        }
        else {
            // Follow Logic 
            // Add org ID to user's following list (addToSet prevent duplicates)
            await User.findByIdAndUpdate(userId, {
                $addToSet: { following: orgObjectId }
            })

            // Increment
            updateOrg = await Organization.findByIdAndUpdate(organizationID, {
                $inc: { members: 1 }
            }, { new: true })

            return response
                .status(200)
                .json({
                    message: "Follow successfully",
                    isFollowed: true,
                    members: updateOrg.members
                })
        }
    }
    catch (error) {
        console.error("Error toggling follow (Organization Controllers) [toggleFollowOrganization]: ", error);
        return response
            .status(500)
            .json({
                message: "Internal Server Error (Organization Controllers) [toggleFollowOrganization]",
                error: error.message
            })
    }
}


export const updateOrganizationProfilePicture = async (req, res) => {
    try {
        const { organizationId, profileLink } = req.body;

        if (!organizationId || !profileLink) {
            return res.status(400).json({ message: "Organization ID and profile link are required." });
        }

        const updatedOrg = await Organization.findByIdAndUpdate(
            organizationId,
            { profileLink },
            { new: true }
        );

        if (!updatedOrg) {
            return res.status(404).json({ message: "Organization not found." });
        }

        return res.status(200).json({
            message: "Organization profile picture updated successfully",
            data: updatedOrg
        });

    } catch (error) {
        console.error("Error updating organization profile picture:", error);
        return res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};