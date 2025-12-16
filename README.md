# CampusSync Backend

The backend service for the CampusSync application, built with Node.js, Express, and MongoDB. This API handles user authentication, data management for organizations/events/academic posts, and real-time features.

## 🚀 Technologies

*   **Runtime**: Node.js
*   **Framework**: Express.js
*   **Database**: MongoDB (via Mongoose)
*   **Authentication**: JSON Web Tokens (JWT) & bcryptjs
*   **File Storage**: Cloudinary
*   **Scheduling**: node-cron

## 🛠️ Installation & Setup

1.  **Clone the repository** (if you haven't already):
    ```bash
    git clone <repository-url>
    cd CampusSyncBackEnd
    ```

2.  **Install dependencies**:
    ```bash
    npm install
    ```

3.  **Environment Configuration**:
    Create a `.env` file in the root directory. Add the following variables (example):
    ```env
    PORT=3000
    MONGO_URI=your_mongodb_connection_string
    JWT_SECRET=your_jwt_secret_key
    CLOUDINARY_CLOUD_NAME=your_cloud_name
    CLOUDINARY_API_KEY=your_api_key
    CLOUDINARY_API_SECRET=your_api_secret
    ```

4.  **Run the application**:
    *   **Development** (with hot-reload):
        ```bash
        npm run dev
        ```
    *   **Production**:
        ```bash
        npm start
        ```

## 📂 Project Structure

```
src/
├── controllers/    # Request handlers (logic)
├── models/         # Database schemas (Mongoose)
├── routes/         # API route definitions
├── middleware/     # Auth and validation middleware
├── helper/         # Utility functions
├── lib/            # External library configurations
└── index.js        # Entry point
```

## 🐳 Docker Support

This service includes a `Dockerfile` for containerization.
To build and run with Docker:
```bash
docker build -t campussync-backend .
docker run -p 3000:3000 campussync-backend
```

## 📡 API Overview

*   **/auth**: Login, Register, Registration requests
*   **/events**: Create, Update, Delete, Get events
*   **/academic**: Academic posts management
*   **/organizations**: Organization details requests
*   **/moderator**: Moderator specific actions
*   **/notifications**: User notifications
