# Deployment Guide

## 🌍 Deploying to Render

This project is deployed on **Render** as a Web Service.

### Deployment Steps

1.  **Create New Web Service** on Render.
    *   Go to your Render Dashboard and select **New +** -> **Web Service**.
2.  **Connect Repo**:
    *   Select `CampusSyncBackEnd` (or the repository containing the backend code).
3.  **Configure Settings**:
    *   **Runtime**: Select **Node**.
    *   **Build Command**: `npm install`
    *   **Start Command**: `npm start`
    *   **Region**: Select a region close to your users (e.g., Singapore).
4.  **Environment Variables**:
    *   Find the "Environment Variables" section.
    *   Add the following keys (matching your `.env`):
        *   `MONGO_URI`: Your MongoDB connection string.
        *   `JWT_SECRET`: Your secure secret key for tokens.
        *   `CLOUDINARY_CLOUD_NAME`: Cloudinary cloud name.
        *   `CLOUDINARY_API_KEY`: Cloudinary API key.
        *   `CLOUDINARY_API_SECRET`: Cloudinary API secret.

### 🔄 CI/CD (Auto-Deploy)
Render automatically re-builds and deploys whenever you push changes to the `main` branch.

### 🔍 Troubleshooting
*   **Database Connection Error**: Ensure your IP is whitelisted in MongoDB Atlas (or set to allow access from anywhere `0.0.0.0/0` for Render).
*   **Runtime Errors**: Check the "Logs" tab in Render dashboard for error messages during startup.
*   **Cold Starts**: On the free tier, the service may spin down after inactivity. The first request might take 50+ seconds.
