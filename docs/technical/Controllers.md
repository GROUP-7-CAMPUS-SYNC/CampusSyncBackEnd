# 🎮 Controllers

Controllers contain the business logic for the application. They handle incoming requests, interact with Models, and send responses.

## Key Controllers

### 🔐 Authentication
*   **`authControllers/`**: (Directory) Handles user registration, login, and token generation. Likely contains logic for hashing passwords and validating credentials.

### 📅 Content Management
*   **`eventControllers.js`**: Logic for creating, updating, deleting, and fetching events. Handles event-specific fields like dates and locations.
*   **`academicController.js`**: Manages academic and "Lost & Found" posts.
*   **`organizationalControllers.js`**: Handles organization data logic.

### 👮 Moderator / Admin
*   **`moderatorController.js`**: Logic restricted to moderators, such as creating new organizations or assigning heads.

### 👤 User Features
*   **`profileControllers.js`**: Fetches user profile data and their post history.
*   **`savedController.js`**: Logic for saving/unsaving posts.
*   **`searchBarControllers.js`**: Manages search history recording and retrieval.
*   **`globalSearchBar.js`**: helper for implementing the global search logic.

### 💬 Interaction
*   **`messageControllers.js`**: Handles messaging logic between users.
*   **`commentController.js`**: Manages comments on posts (if applicable).
*   **`notificationControllers.js`**: Logic for fetching notifications.
*   **`reportItemController.js`**: Handling user reports.

### 🏠 Dashboard
*   **`homeFeedController.js`**: Aggregates content for the user's home feed (e.g., latest events + lost and found).

### ☁️ Uploads
*   **`uploadController.js`**: Handles image upload requests, interfacing with Cloudinary.
