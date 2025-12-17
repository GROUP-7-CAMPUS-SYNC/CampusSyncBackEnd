# 🛣️ API Routes

The API is structured around resource-based routing. All routes are prefixed with `/api` in `index.js`.

## Route Modules

| Base Path | File | Description |
| :--- | :--- | :--- |
| `/api/auth` | `authRoutes.js` | User authentication: Login (`/login`), Register (`/register`), and Registration Requests. |
| `/api/events` | `eventRoutes.js` | CRUD operations for Event posts. |
| `/api/academic` | `academicRoutes.js` | CRUD operations for Academic/Lost & Found posts. |
| `/api/organizations` | `organizationRoutes.js` | Fetching organization details and members. |
| `/api/moderator` | `moderatorRoutes.js` | Administrative actions: Create Organization, Assign Head, Manage Users. |
| `/api/profile` | `profileRoutes.js` | User profile management and fetching user-specific posts. |
| `/api/dashboard` | `homeFeedController.js` | Aggregated data for the main home feed. |
| `/api/search` | `globalSearchRoutes.js` | Global search across multiple post types. |
| `/api/recentSearch` | `searchBarRoutes.js` | Manage user's recent search history. |
| `/api/saved` | `savedPostRoutes.js` | Add, remove, and list saved posts. |
| `/api/message` | `messageRoutes.js` | Send and retrieve messages for post-related chats. |
| `/api/notification` | `notificationRoutes.js` | Fetch user notifications. |
| `/api/upload` | `uploadRoutes.js` | Handle file uploads (images) to Cloudinary. |
| `/api/report_types` | `reportTypeRoutes.js` | Manage report categories. |

## Structure
Each route file typically:
1.  Imports `express`.
2.  Imports the corresponding **Controller**.
3.  Imports the `protect` middleware (if auth is required).
4.  Defines HTTP methods (`GET`, `POST`, `PUT`, `DELETE`) for specific paths.
