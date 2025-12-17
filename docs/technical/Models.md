# 🗄️ Database Collections & Document Structures

This section outlines the proposed MongoDB collections for the CampusSync backend. Each entry details the collection's purpose and its corresponding document structure, satisfying the system's requirements for data management.

## 1. Users Collection
*   **Collection Name**: `users`
*   **Usage**: Stores all registered user accounts, including Students, Moderators, and Organization Heads. It manages authentication credentials, profile information, and role-based access control.
*   **Document Structure**:
    ```javascript
    {
      "_id": "ObjectId",
      "firstname": "String (Required, 3-20 chars)",
      "lastname": "String (Required, 3-20 chars)",
      "course": "String (Enum: 'BS Civil Engineering', 'BS IT', 'BS CS', 'BS Food Tech')",
      "email": "String (Required, Unique, Lowercase)",
      "password": "String (Hashed)",
      "profileLink": "String (URL to profile image)",
      "role": "String (Enum: 'user', 'moderator', Default: 'user')",
      "following": [
        { "type": "ObjectId", "ref": "Organization" } // List of followed orgs
      ],
      "createdAt": "Date",
      "updatedAt": "Date"
    }
    ```

## 2. Organizations Collection
*   **Collection Name**: `organizations`
*   **Usage**: Represents the various student organizations within the campus. It holds details such as the organization's identity, the assigned head (who has posting privileges), and the moderator who approved it.
*   **Document Structure**:
    ```javascript
    {
      "_id": "ObjectId",
      "organizationName": "String (Required)",
      "description": "String",
      "profileLink": "String (URL to logo)",
      "course": "String (Enum of courses)",
      "members": "Number (Default: 0)",
      "organizationHeadID": "ObjectId (Ref: User, Required)", // The assigned head
      "moderators": "ObjectId (Ref: User, Required)" // The mod who created/approved
    }
    ```

## 3. Events Collection
*   **Collection Name**: `events`
*   **Usage**: Stores posts specific to campus events (e.g., "General Assembly", "Sports Fest"). These documents allow organizations to broadcast scheduled activities with specific dates and locations.
*   **Document Structure**:
    ```javascript
    {
      "_id": "ObjectId",
      "type": "String (Default: 'event')",
      "eventName": "String (Required)",
      "location": "String (Required)",
      "course": "String (Required)",
      "openTo": "String (Target audience)",
      "startDate": "Date (Required)",
      "endDate": "Date (Required)",
      "image": "String (URL to event banner)",
      "postedBy": "ObjectId (Ref: User, Required)",
      "organization": "ObjectId (Ref: Organization, Required)",
      "comments": [
        {
          "user": "ObjectId (Ref: User)",
          "text": "String",
          "createdAt": "Date"
        }
      ],
      "createdAt": "Date",
      "updatedAt": "Date"
    }
    ```

## 4. Academic Posts Collection
*   **Collection Name**: `academics`
*   **Usage**: Manages academic-related posts, such as resources, announcements, or "Lost & Found" items. It is distinct from events as it focuses on content dissemination rather than scheduled gatherings.
*   **Document Structure**:
    ```javascript
    {
      "_id": "ObjectId",
      "type": "String (Default: 'academic')",
      "title": "String (Required)",
      "content": "String (Required)",
      "image": "String (Required)",
      "postedBy": "ObjectId (Ref: User, Required)",
      "organization": "ObjectId (Ref: Organization, Required)",
      "comments": [
        {
          "user": "ObjectId (Ref: User)",
          "text": "String",
          "createdAt": "Date"
        }
      ],
      "createdAt": "Date",
      "updatedAt": "Date"
    }
    ```

## 5. Messages Collection
*   **Collection Name**: `messages`
*   **Usage**: Facilitates direct communication between users. This is primarily used for inquiries regarding posts (e.g., messaging a post owner about a lost item).
*   **Document Structure**:
    ```javascript
    {
      "_id": "ObjectId",
      "sender": "ObjectId (Ref: User, Required)",
      "receiver": "ObjectId (Ref: User, Required)",
      "messageText": "String (Required)",
      "isRead": "Boolean (Default: false)",
      "createdAt": "Date",
      "updatedAt": "Date"
    }
    ```

## 6. Notifications Collection
*   **Collection Name**: `notifications`
*   **Usage**: tracks system alerts for users. This includes notifications for new posts from followed organizations, mentions, or system-wide announcements.
*   **Document Structure**:
    ```javascript
    {
      "_id": "ObjectId",
      "recipient": "ObjectId (Ref: User, Required)",
      "sender": "ObjectId (Ref: User)",
      "organization": "ObjectId (Ref: Organization)",
      "type": "String (Enum: 'NEW_POST', 'MENTION', 'SYSTEM')",
      "referenceId": "ObjectId (Ref: 'Event' | 'Academic' | 'ReportItem')",
      "referenceModel": "String (Enum: 'Event', 'Academic', 'ReportItem')",
      "message": "String (Required)",
      "isRead": "Boolean (Default: false)",
      "createdAt": "Date",
      "updatedAt": "Date"
    }
    ```

## Utility Collections
These collections support specific features but represent smaller or derivative data sets.

*   **`eventsubscribers`**: Tracks users subscribed to specific event reminders.
*   **`saveditems`**: Stores references to posts (`Event` or `Academic`) that a user has bookmarked.
*   **`searchhistories`**: Logs recent search queries for user convenience.
*   **`reporttypes`**: Defines categories for reporting content.
