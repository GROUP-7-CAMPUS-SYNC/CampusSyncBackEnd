# 🏁 Entry Point (`index.js`)

The `index.js` file serves as the main entry point for the CampusSync Backend application. It initializes the Express server, connects to the database, sets up middleware, and defines the primary API routes.

## Core Responsibilities

1.  **Server Initialization**: Creates the Express application and listens on the specified `PORT`.
2.  **Database Connection**: Establishes a connection to MongoDB using `connectDB()` from `./lib/db.js`.
3.  **Middleware Setup**:
    *   `cors`: Enables Cross-Origin Resource Sharing to allow the frontend to communicate with the API.
    *   `body-parser`: Parses incoming request bodies (JSON).
4.  **Route Registration**: Maps API endpoints to their respective route handlers.
5.  **Scheduled Tasks**: Initializes cron jobs via `setupEventReminders()` for sending event notifications.

## Route Map

The following base routes are defined in `index.js`:

| Endpoint | Route File | Description |
| :--- | :--- | :--- |
| `/api/auth` | `authRoutes.js` | Authentication (Login, Register). |
| `/api/organizations` | `organizationRoutes.js` | Organization management. |
| `/api/report_types` | `reportTypeRoutes.js` | Report categorization. |
| `/api/academic` | `academicRoutes.js` | Academic posts and resources. |
| `/api/events` | `eventRoutes.js` | Event creation and management. |
| `/api/moderator` | `moderatorRoutes.js` | Admin/Moderator actions. |
| `/api/dashboard` | `homeFeedController.js` | Dashboard data aggregation. |
| `/api/profile` | `profileRoutes.js` | User profile data. |
| `/api/upload` | `uploadRoutes.js` | File upload handling. |
| `/api/notification` | `notificationRoutes.js` | User notifications. |
| `/api/recentSearch` | `searchBarRoutes.js` | Search history management. |
| `/api/search` | `globalSearchRoutes.js` | Global search functionality. |
| `/api/saved` | `savedPostRoutes.js` | Saved items management. |
| `/api/message` | `messageRoutes.js` | User-to-user messaging. |

## Startup Sequence

```javascript
// 1. Load Environment Variables
import "dotenv/config.js";

// 2. Initialize App
const app = express();

// 3. Apply Middleware
app.use(cors());
app.use(bodyParser.json());

// 4. Register Routes
app.use('/api/auth', authRoutes);
// ... other routes

// 5. Start Scheduler
setupEventReminders();

// 6. Start Server & Connect to DB
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    connectDB();
});
```
