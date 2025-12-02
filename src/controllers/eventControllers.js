import Event from "../models/Event.js";
import Organization from "../models/Organization.js";
import { notifyOrganizationFollowers } from "../helper/notificationHelper.js"; 

export const getManagedOrganization = async (request, response) => {
    try {
        const user = request.userRegistrationDetails;

        const managedOrganization = await Organization.find({
            organizationHeadID: user._id
        });

        if (managedOrganization.length > 0) {
            return response.status(200).json({
                isHead: true,
                organization: managedOrganization
            });
        } else {
            return response.status(200).json({
                isHead: false,
                organization: null
            });
        }
    } catch (error) {
        console.error("Error getting managed organization (Event Controllers) [getManagedOrganization]: ", error);
        return response.status(500).json({
            message: "Internal Server Error (Event Controllers) [getManagedOrganization]",
            error: error.message
        });
    }
};

export const createPostEvent = async (request, response) => {
    try {
        const user = request.userRegistrationDetails;

        const {
            eventName,
            location,
            course,
            openTo,
            startDate,
            endDate,
            image,
            organizationId
        } = request.body;

        if (!eventName || !location || !course || !openTo || !startDate || !endDate || !image || !organizationId) {
            return response.status(400).json({ message: "Missing required fields" });
        }

        const targetOrg = await Organization.findById(organizationId);

        if (!targetOrg) {
            return response.status(404).json({ message: "Organization not found" });
        }

        if (targetOrg.organizationHeadID.toString() !== user._id.toString()) {
            return response.status(403).json({ message: "Forbidden: You are not the head of this organization" });
        }

        const newPost = new Event({
            eventName,
            location,
            course,
            openTo,
            startDate,
            endDate,
            image,
            organization: organizationId,
            postedBy: user._id
        });

        const savePost = await newPost.save();

        // ✅ TRIGGER NOTIFICATION (Fire and Forget)
        // We do not await this, so the UI updates immediately for the user.
        notifyOrganizationFollowers(
            organizationId,                // Organization ID
            user._id,                      // Sender ID (Head)
            savePost._id,                  // Reference ID (The Event)
            "Event",                       // Reference Model Name
            `New Event: ${eventName}`      // The Message
        );

        return response.status(201).json({
            message: "Event post created successfully",
            post: savePost
        });

    } catch (error) {
        console.error("Error creating event post (Event Controllers) [createPostEvent]: ", error);
        return response.status(500).json({
            message: "Internal Server Error (Event Controllers) [createPostEvent]",
            error: error.message
        });
    }
};

export const getAllEventPosts = async (request, response) => {
    try {
        
        const { search } = request.query;
        let query = {};

        if(search)
        {
            // If a search term exists, filter by eventName OR location OR course
            // $regex with option 'i' makes it case-insensitive

            query = {
                $or: [
                    { eventName: { $regex: search, $options: 'i' } },
                    // { location: { $regex: search, $options: 'i' } },
                    // { course: { $regex: search, $options: 'i' } },
                    // { openTo: { $regex: search, $options: 'i' } }
                ]
            }
        }

        const post = await Event.find(query)
            .sort({ createdAt: -1 })
            .populate("postedBy", "firstname lastname")
            .populate("organization", "organizationName profileLink");

        if(post.length !== 0){
            return response.status(200).json(post);

        }

        return response.status(404).json({ message: "No posts found" });
    } catch (error) {
        console.error("Error fetching event posts (Event Controllers) [getAllEventPosts]: ", error);
        return response.status(500).json({
            message: "Internal Server Error (Event Controllers) [getAllEventPosts]",
            error: error.message
        });
    }
};