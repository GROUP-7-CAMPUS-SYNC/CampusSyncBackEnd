# Project Overview

## 🌟 Introduction
**CampusSync** is a centralized communication platform designed specifically for the **USTP community**. It unifies students, faculty, and organizations under one trusted digital ecosystem, streamlining access to essential campus information.

## 🎯 The Problem
Before CampusSync, campus communication was fragmented:
- Announcements were scattered across various social media channels (Facebook, Messenger, etc.).
- "Lost & Found" items were difficult to track and verify.
- Event information was often missed or unverified.
- Dependence on third-party platforms led to information overload and security concerns.

## 💡 The Solution
CampusSync provides a dedicated platform for:
1.  **Verified Announcements**: Only authorized Organization Heads can post official announcements.
2.  **Centralized Events**: A feed for event announcements for the organization.
3.  **Lost & Found**: A structured system for reporting and claiming lost items, featuring a "Witness" system for added legitimacy.
4.  **Secure Access**: Exclusive to users with `@1.ustp.edu.ph` institutional emails.

## 👥 Target Audience
*   **Students**: To stay updated on events, find lost items, and receive verified news.
*   **Organization Heads**: To manage posts and announcements for their specific organizations.
*   **Moderators**: Manage organizations.

---

# 📚 Documentation Navigation

This folder contains detailed documentation for the backend structure and logic.

## ⚙️ Technical Implementation

*   **[Entry Point & Server](./technical/Entry.md)**: Overview of `index.js` and server initialization.
*   **[Controllers & Logic](./technical/Controllers.md)**: Explanation of business logic and request handling.
*   **[Routes & API](./technical/Routes.md)**: Detailed breakdown of API endpoints and groups.
*   **[Database Models](./technical/Models.md)**: Documentation of Mongoose schemas and data relationships.
*   **[Middleware & Security](./technical/Middleware.md)**: Details on authentication (JWT) and validation middleware.

## 🚀 Configuration & Deployment

*   **[Environment Variables](./Environment.md)**: Guide to configuring `.env` variables.
*   **[Deployment Guide](./technical/Deployment.md)**: Step-by-step instructions for deploying the backend to Render.
