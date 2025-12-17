# CampusSync Backend

The backend service for the CampusSync application, built with Node.js, Express, and MongoDB. This API handles user authentication, data management for organizations/events/academic posts, and real-time features.

## 📚 Documentation

We have prepared comprehensive documentation for the backend structure and logic:

*   **[Entry Point & Server Setup](./docs/technical/Entry.md)**: Overview of `index.js`.
*   **[Environment Variables](./docs/Environment.md)**: Configuration guide.
*   **[Deployment Guide](./docs/technical/Deployment.md)**: Instructions for deploying to Render.
*   **[API Routes](./docs/technical/Routes.md)**: Detailed list of API endpoints.
*   **[Controllers](./docs/technical/Controllers.md)**: Business logic explanation.
*   **[Database Models](./docs/technical/Models.md)**: Mongoose schemas and data structures.
*   **[Middleware](./docs/technical/Middleware.md)**: Authentication and validation.

## 🚀 Technologies

*   **Runtime**: Node.js
*   **Framework**: Express.js
*   **Database**: MongoDB (via Mongoose)
*   **Authentication**: JSON Web Tokens (JWT) & bcryptjs
*   **File Storage**: Cloudinary
*   **Scheduling**: node-cron

## 🛠️ Installation & Setup

1.  **Navigate to the directory**:
    ```bash
    cd CampusSyncBackEnd
    ```

2.  **Install dependencies**:
    ```bash
    npm install
    ```

3.  **Environment Configuration**:
    Create a `.env` file in the root directory (see **[Environment Docs](./docs/Environment.md)**).
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
backend/
├── docs/               # 📚 Comprehensive Project Documentation
│   ├── technical/      # Systems, Architecture, & Component docs
│   ├── Environment.md  # Configuration Guide
│   └── ...
├── src/
│   ├── controllers/    # 🎮 Business logic (Request handlers)
│   ├── helper/         # �️ Utility functions (Cron jobs, etc.)
│   ├── lib/            # � External configurations (DB, Cloudinary)
│   ├── middleware/     # 🛡️ Auth and validation middleware
│   ├── models/         # 🗄️ Database schemas (Mongoose)
│   ├── routes/         # �️ API route definitions
│   └── index.js        # 🏁 Application Entry Point
├── .env                # Environment variables
├── Dockerfile          # 🐳 Docker configuration
├── package.json        # Dependencies & Scripts
└── ...
```

## 🐳 Docker Support

This service includes a `Dockerfile` for containerization.

### Build and Run
```bash
docker build -t campussync-backend .
docker run -p 3000:3000 campussync-backend
```

## 📡 API Overview

For a detailed breakdown, see [Routes](./docs/technical/Routes.md).

*   **/auth**: Login, Register, Registration requests
*   **/events**: Create, Update, Delete, Get events
*   **/academic**: Academic posts management
*   **/organizations**: Organization details requests
*   **/moderator**: Moderator specific actions
*   **/notifications**: User notifications
