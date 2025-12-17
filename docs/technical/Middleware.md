# 🛡️ Middleware

Middleware functions run during the request-response cycle to handle cross-cutting concerns like authentication and validation.

## Authentication Middleware

### `protect`
*   **File**: `middleware/authMiddleWare.js`
*   **Purpose**: Protects private routes by verifying the JSON Web Token (JWT) sent in the `Authorization` header.
*   **Behavior**:
    1.  Checks for a Bearer token in the `Authorization` header.
    2.  Verifies the token using `JWT_SECRET`.
    3.  If valid, fetches the user from the database (excluding the password) and attaches it to `request.userRegistrationDetails`.
    4.  If invalid or missing, returns a `401 Unauthorized` response.

**Usage Example**:
```javascript
import { protect } from "../middleware/authMiddleWare.js";
import express from "express";

const router = express.Router();

// This route is now protected
router.get("/profile", protect, getUserProfile);
```
