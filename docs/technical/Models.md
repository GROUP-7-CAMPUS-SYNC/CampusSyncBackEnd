# 🗄️ Database Collections

## 1. Organizations Collection
* **Collection Name**: `organizations`
* **Usage**: Represents student organizations, including identity, head, and approving moderator.
* **Structure**:
```javascript
{
    organizationName: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        default: ""
    },
    profileLink: {
        type: String,
        default: ""
    },
    course: {
        type: String,
        required: true,
        enum:[ "BS Civil Engineering", "BS Information Technology", "BS Computer Science", "BS Food Technology"]
    },
    members: {
        type: Number,
        default: 0
    },
    // The one who can post on the organization authorized
    organizationHeadID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    //The one who approved the organization Head
    moderators: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    }
}
```

## 2. Events Collection
* **Collection Name**: `events`
* **Usage**: Stores campus event posts with scheduled dates and locations.
* **Structure**:
```javascript
{
    type: {
        type: String,
        default: "event"
    },
    eventName: {
        type: String,
        required: true,
        trim: true
    },
    location: {
        type: String,
        required: true,
        trim: true
    },
    course:{
        type: String,
        required: true,
    },
    openTo:{
        type: String,
        required: true,
        trim: true
    },
    startDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    postedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    organization: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Organization",
        required: true
    },
    comments: [{
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        text: {
            type: String,
            required: true
        },
        createdAt: {
            type: Date,
            default: Date.now
        }
    }]
}, {
    timestamps: true
}
```

## 3. Academic Posts Collection
* **Collection Name**: `academics`
* **Usage**: Manages academic resources/announcements. Focuses on content dissemination.
* **Structure**:
```javascript
{
    type: {
        type: String,
        default: "academic"
    },
    title: {
        type: String,
        required: true,
        trim: true
    },
    content: {
        type: String,
        required: true,
        trim: true
    },
    image: {
        type: String,
        required: true,
        trim: true
    },
    postedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    organization: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Organization",
        required: true
    },
    comments: [{
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        text: {
            type: String,
            required: true
        },
        createdAt: {
            type: Date,
            default: Date.now
        }
    }]
}, {
    timestamps: true
}
```

## 4. Report Items Collection
* **Collection Name**: `reportitems`
* **Usage**: Manages "Lost and Found" items. Tracks status, location, and witnesses.
* **Structure**:
```javascript
{
    reportType: {
        type: String,
        required: true,
        enum: ["Lost", "Found"]
    },
    itemName: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true,
    },
    turnOver: {
        type: String,
        default: ""
    },
    locationDetails: {
        type: String,
        required: true
    },
    contactDetails: {
        type: String,
        required: true
    },
    dateLostOrFound: {
        type: Date,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    postedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    status: {
        type: String,
        enum: ["active", "claimed", "recovered"],
        default: "active"
    },
    witnesses: [{
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        vouchTime: {
            type: Date,
            default: Date.now
        }
    }],
    comments: [{
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        text: {
            type: String,
            required: true
        },
        createdAt: {
            type: Date,
            default: Date.now
        }
    }]
},
{
    timestamps: true
}
```

## 5. Users Collection
* **Collection Name**: `users`
* **Usage**: Stores all registered user accounts (Students and  Moderators). Manages auth, profiles, and RBAC.
* **Structure**:
```javascript
{
    firstname: {
        type: String,
        required: true,
        trim: true,
        minlength: 3,
        maxlength: 20
    },
    lastname: {
        type: String,
        required: true,
        trim: true,
        minlength: 3,
        maxlength: 20
    },
    course: {
        type: String,
        required: true,
        trim: true,
        enum: [
            "BS Civil Engineering",
            "BS Information Technology",
            "BS Computer Science",
            "BS Food Technology"
        ]
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,    
    },
    password: {
        type: String,
        required: true,
        minlength: 6        
    },
    profileLink: {
        type: String,
        default: ""  
    },
    role: {
        type: String,
        enum: ["user", "moderator"],
        default: "user"
    },
    following:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Organization"
    }],
},
{
    timestamps: true
}
```

## 6. Messages Collection
* **Collection Name**: `messages`
* **Usage**: Direct user-to-user communication.
* **Structure**:
```javascript
{
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    receiver: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    messageText: {
        type: String,
        required: true
    },
    isRead: {
        type: Boolean,
        default: false
    }
},
{
    timestamps: true
}
```

## 7. Notifications Collection
* **Collection Name**: `notifications`
* **Usage**: Tracks system alerts (new posts, event reminder).
* **Structure**:
```javascript
{
    // The user receiving the notification
    recipient: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    // The entity triggering the notification (User or Org)
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    // Optional: If the notification comes from an Organization (for "New Post" types)
    organization: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Organization"
    },
    type: {
        type: String,
        enum: ["NEW_POST", "MENTION", "SYSTEM"],
        required: true
    },
    referenceId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        refPath: 'referenceModel'
    },
    referenceModel: {
        type: String,
        required: true,
        enum: ["Event", "Academic", "ReportItem"]
    },
    message: {
        type: String,
        required: true
    },
    isRead: {
        type: Boolean,
        default: false
    }
},
{
    timestamps: true
}
```

## 8. Event Subscribers Collection
* **Collection Name**: `eventsubscribers`
* **Usage**: Tracks users subscribed to event reminders.
* **Structure**:
```javascript
{
    event: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Event",
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    isNotified: {
        type: Boolean,
        default: false
    }
},
{
    timestamps: true
}
```

## 9. Saved Items Collection
* **Collection Name**: `saveditems`
* **Usage**: Stores user bookmarks via polymorphic references.
* **Structure**:
```javascript
{
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    post: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        refPath: 'postModel'
    },
    postModel: {
        type: String,
        required: true,
        enum: ['Academic', 'Event', 'ReportItem']
    }
}, {
    timestamps: true
}
```

## 10. Search History Collection
* **Collection Name**: `searchhistories`
* **Usage**: Logs recent user search queries.
* **Structure**:
```javascript
{
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    queryText: {
        type: String,
        required: true,
        trim: true,
        lowercase: true // Store lowercase to prevent "React" and "react" duplicates
    },
    // Keeps track of WHERE they searched
    searchContext: {
        type: String,
        enum: ["global", "event", "academic", "lostfound"],
        required: true
    }
},
{
    timestamps: true
}
```
