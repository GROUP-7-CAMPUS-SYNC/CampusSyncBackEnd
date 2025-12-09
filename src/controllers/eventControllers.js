import Event from "../models/Event.js";
import Organization from "../models/Organization.js";
import { notifyOrganizationFollowers } from "../helper/notificationHelper.js"; 
import EventSubscriber from "../models/EventSubscriber.js";
import Notification from "../models/Notification.js";
import SavedItem from "../models/SavedItem.js";

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

        // TRIGGER NOTIFICATION (Fire and Forget)
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
            .populate("organization", "organizationName profileLink")
            .populate("comments.user", "firstname lastname profileLink");

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

export const addCommentEvent = async (request, response) => {
    try {
        const { id } = request.params;
        const { text } = request.body;
        const userId = request.userRegistrationDetails._id;

        if (!text) return response.status(400).json({ message: "Comment text is required" });

        const updatedPost = await Event.findByIdAndUpdate(
            id,
            { $push: { comments: { user: userId, text } } },
            { new: true }
        ).populate("comments.user", "firstname lastname profileLink");

        if (!updatedPost) return response.status(404).json({ message: "Event not found" });

        return response.status(200).json(updatedPost.comments);
    } catch (error) {
        console.error("Error adding event comment:", error);
        return response.status(500).json({ message: "Internal Server Error" });
    }
};

export const toggleNotifyEvent = async (request, response) => {
    try {
        const { id } = request.params;
        const userId = request.userRegistrationDetails._id;

        // 1. Verify Event Exists
        const eventExist = await Event.findById(id);
        if (!eventExist) {
            return response.status(404).json({ message: "Event not found" });
        }

        // [NEW LOGIC] Check if event has already started
        const currentTime = new Date();
        const eventStartTime = new Date(eventExist.startDate);

        if (currentTime >= eventStartTime) {
            return response.status(400).json({ 
                message: "Cannot set reminder: This event has already started or ended." 
            });
        }

        // 2. Check if the user is ALREADY subscribed
        const existingSubscription = await EventSubscriber.findOne({
            event: id,
            user: userId
        });

        if (existingSubscription) {
            // UNSUBSCRIBE
            await EventSubscriber.findByIdAndDelete(existingSubscription._id);
            return response.status(200).json({
                message: "Reminder removed",
                isSubscribed: false
            });
        } else {
            // SUBSCRIBE
            await EventSubscriber.create({
                event: id,
                user: userId
            });
            return response.status(200).json({ 
                message: "Reminder set! You will be notified 1 hour before the event.", 
                isSubscribed: true 
            });
        }
    } catch (error) {
        console.error("Error toggling notify (Event Controllers): ", error);
        return response.status(500).json({ message: "Internal Server Error" });
    }
}

export const getEventSubscribers = async (request, response) => {
    try
    {
        const { id } = request.params;
        const userId = request.userRegistrationDetails._id;

        const subscription = await EventSubscriber.findOne({
            event: id,
            user: userId
        });

        const isSubscribed = subscription !== null;

        return response
            .status(200)
            .json({
                isSubscribed : isSubscribed
            })
    }
    catch(error)
    {
        console.error("Error getting event subscribers (Event Controllers) [getEventSubscribers]: ", error);
        return response.status(500).json({ message: "Internal Server Error" });
    }
}

export const deleteEvent = async (request, response) => {
    try {
        const { id } = request.params;
        const userId = request.userRegistrationDetails._id;

        // 1. Find the Event
        const event = await Event.findById(id);

        if (!event) {
            return response.status(404).json({ message: "Event not found." });
        }

        // 2. Authorization Check: Is the user the Organization Head?
        // We need to fetch the organization attached to the event to check its head ID
        const organization = await Organization.findById(event.organization);

        if (!organization) {
            // Edge case: Org was deleted but event remained?
            // Allow deletion if the user is the one who 'postedBy' the event as a fallback, 
            // or strictly fail. Here we assume strict org head check.
            return response.status(404).json({ message: "Organization record not found." });
        }

        if (organization.organizationHeadID.toString() !== userId.toString()) {
            return response.status(403).json({ 
                message: "Unauthorized. Only the Organization Head can delete this event." 
            });
        }

        // 3. Cascade Delete: Remove Subscriptions (EventSubscriber)
        await EventSubscriber.deleteMany({ event: id });

        // 4. Cascade Delete: Remove Notifications related to this event
        await Notification.deleteMany({ 
            referenceId: id,
            referenceModel: "Event"
        });

        // 5. Cascade Delete: Remove Saved Items
        await SavedItem.deleteMany({ 
            post: id, 
            postModel: "Event" 
        });

        // 6. Delete the Event itself
        await Event.findByIdAndDelete(id);

        return response.status(200).json({ 
            message: "Event and all associated data deleted successfully." 
        });

    } catch (error) {
        console.error("Error deleting event:", error);
        return response.status(500).json({ message: "Internal Server Error" });
    }
};