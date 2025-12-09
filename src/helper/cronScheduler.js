import cron from "node-cron";
import Event from "../models/Event.js";
import EventSubscriber from "../models/EventSubscriber.js"; // The new model you created
import Notification from "../models/Notification.js";

const setupEventReminders = () => {
    // Run every minute
    cron.schedule('* * * * *', async () => {
        try {

            console.log("1 minute")
            const now = new Date();
            const oneHourLater = new Date(now);
            oneHourLater.setHours(now.getHours() + 1);

            // Window: 1 hour from now (+1 minute tolerance)
            const startWindow = new Date(oneHourLater);
            const endWindow = new Date(oneHourLater);
            endWindow.setMinutes(endWindow.getMinutes() + 1);

            // 1. FIND EVENTS STARTING SOON
            const startingEvents = await Event.find({
                startDate: {
                    $gte: startWindow,
                    $lt: endWindow
                }
            }).select("_id eventName location postedBy organization");

            console.log("sadsad")

            if (startingEvents.length === 0) return;

            console.log(startingEvents.length)
            console.log("asd")

            // 2. CHECK FOR SUBSCRIBERS FOR THESE EVENTS
            for (const event of startingEvents) {
                

                console.log("qwe1qwe")
                // Query the SEPARATE model
                const subscribers = await EventSubscriber.find({
                    event: event._id,
                    isNotified: false // This flag exists in EventSubscriber, not Event
                });

                if (subscribers.length === 0) continue;

                console.log(`[Cron Job] Sending ${subscribers.length} reminders for: ${event.eventName}`);

                // 3. PREPARE NOTIFICATIONS
                const notifications = subscribers.map(sub => ({
                    recipient: sub.user,
                    sender: event.postedBy, 
                    organization: event.organization,
                    type: "SYSTEM", 
                    referenceId: event._id,
                    referenceModel: "Event",
                    message: `Reminder: "${event.eventName}" starts in 1 hour at ${event.location}.`,
                    isRead: false
                }));

                // 4. SEND NOTIFICATIONS
                if (notifications.length > 0) {
                    await Notification.insertMany(notifications);
                }

                // 5. MARK SUBSCRIBERS AS NOTIFIED
                // We update the separate model, leaving your Event model untouched.
                const subscriberIds = subscribers.map(sub => sub._id);
                await EventSubscriber.updateMany(
                    { _id: { $in: subscriberIds } },
                    { $set: { isNotified: true } }
                );
                console.log("qwe2qwe")
            }

        } catch (error) {
            console.error("[Cron Job] Error processing event reminders:", error);
        }
    });

    console.log("[System] Event Reminder Cron Job Initialized.");
};

export default setupEventReminders;