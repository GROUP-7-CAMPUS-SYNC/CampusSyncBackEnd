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
        { "type": "ObjectId", "ref": "Organization" }
      ],
      "createdAt": "Date",
      "updatedAt": "Date"
    }
    ```

## 2. Organizations Collection
*   **Collection Name**: `organizations`
*   **Usage**: Represents the various student organizations within the campus. It holds details such as the organization's identity, the assigned head, and the moderator who approved it.
*   **Document Structure**:
    ```javascript
    {
      "_id": "ObjectId",
      "organizationName": "String (Required)",
      "description": "String",
      "profileLink": "String (URL to logo)",
      "course": "String (Enum of courses)",
      "members": "Number (Default: 0)",
      "organizationHeadID": "ObjectId (Ref: User, Required)",
      "moderators": "ObjectId (Ref: User, Required)"
    }
    ```

## 3. Events Collection
*   **Collection Name**: `events`
*   **Usage**: Stores posts specific to campus events (e.g., "General Assembly"). Key for broadcasting scheduled activities with specific dates and locations.
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
      "image": "String (URL to banner)",
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
*   **Usage**: Manages academic-related posts, such as resources or announcements. Distinct from events as it focuses on content dissemination rather than gatherings.
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

## 5. Report Items Collection
*   **Collection Name**: `reportitems`
*   **Usage**: Manages "Lost and Found" items. Tracks the status of items, where they were found/lost, and allows for witness verification.
*   **Document Structure**:
    ```javascript
    {
      "_id": "ObjectId",
      "reportType": "String (Enum: 'Lost', 'Found', Required)",
      "itemName": "String (Required)",
      "description": "String (Required)",
      "turnOver": "String (Default: '')",
      "locationDetails": "String (Required)",
      "contactDetails": "String (Required)",
      "dateLostOrFound": "Date (Required)",
      "image": "String (Required)",
      "postedBy": "ObjectId (Ref: User, Required)",
      "status": "String (Enum: 'active', 'claimed', 'recovered', Default: 'active')",
      "witnesses": [
        {
          "user": "ObjectId (Ref: User)",
          "vouchTime": "Date"
        }
      ],
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

## 6. Messages Collection
*   **Collection Name**: `messages`
*   **Usage**: Facilitates direct communication between users, primarily for inquiries regarding report item posts.
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

## 7. Notifications Collection
*   **Collection Name**: `notifications`
*   **Usage**: Tracks system alerts for users (new posts).
*   **Document Structure**:
    ```javascript
    {
      "_id": "ObjectId",
      "recipient": "ObjectId (Ref: User, Required)",
      "sender": "ObjectId (Ref: User)",
      "organization": "ObjectId (Ref: Organization)",
      "type": "String (Enum: 'NEW_POST', 'MENTION', 'SYSTEM')",
      "referenceId": "ObjectId (RefPath: referenceModel)",
      "referenceModel": "String (Enum: 'Event', 'Academic', 'ReportItem')",
      "message": "String (Required)",
      "isRead": "Boolean (Default: false)",
      "createdAt": "Date",
      "updatedAt": "Date"
    }
    ```

## 8. Event Subscribers Collection
*   **Collection Name**: `eventsubscribers`
*   **Usage**: Tracks users who have opted-in to receive specific reminders for an event. Ensures users don't subscribe to the same event twice.
*   **Document Structure**:
    ```javascript
    {
      "_id": "ObjectId",
      "event": "ObjectId (Ref: Event, Required)",
      "user": "ObjectId (Ref: User, Required)",
      "isNotified": "Boolean (Default: false)",
      "createdAt": "Date",
      "updatedAt": "Date"
    }
    ```

## 9. Saved Items Collection
*   **Collection Name**: `saveditems`
*   **Usage**: Stores references to posts that a user has bookmarked for later access. Supports polymorphic references to different post types.
*   **Document Structure**:
    ```javascript
    {
      "_id": "ObjectId",
      "user": "ObjectId (Ref: User, Required)",
      "post": "ObjectId (RefPath: postModel, Required)",
      "postModel": "String (Enum: 'Academic', 'Event', 'ReportItem', Required)",
      "createdAt": "Date",
      "updatedAt": "Date"
    }
    ```

## 10. Search History Collection
*   **Collection Name**: `searchhistories`
*   **Usage**: Logs recent search queries for individual users to provide "Recent Search" functionality.
*   **Document Structure**:
    ```javascript
    {
      "_id": "ObjectId",
      "user": "ObjectId (Ref: User, Required)",
      "queryText": "String (Required, Lowercase)",
      "searchContext": "String (Enum: 'global', 'event', 'academic', 'lostfound', Required)",
      "createdAt": "Date",
      "updatedAt": "Date"
    }
    ```
