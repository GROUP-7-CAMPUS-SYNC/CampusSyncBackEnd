# 🗄️ Database Models

The application uses **Mongoose** schemas to model data in MongoDB.

| Model | File | Description |
| :--- | :--- | :--- |
| **User** | `User.js` | Represents registered users (Students, Moderators, Organization Heads). Stores profiles, credentials, and roles. |
| **Organization** | `Organization.js` | Stores organization details, including name, description, and assigned heads. |
| **Event** | `Event.js` | Represents event posts created by organizations. |
| **Academic** | `Academic.js` | Represents academic-related posts (resources, lost & found). |
| **Message** | `Message.js` | Stores chat messages between users, typically linked to a post. |
| **Notification** | `Notification.js` | Stores system notifications for users (e.g., event reminders). |
| **EventSubscriber** | `EventSubscriber.js` | Tracks users who have opted in to receive notifications for specific events. |
| **SavedItem** | `SavedItem.js` | Stores posts (`Event` or `Academic`) saved by users for later access. |
| **SearchHistory** | `SearchHistory.js` | Logs recent search queries for individual users. |
| **ReportType** | `reportType.js` | Defines categories/types for user reports (if applicable). |
