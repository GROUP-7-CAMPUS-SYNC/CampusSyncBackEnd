import jwt from "jsonwebtoken";
import User from "../../models/User.js"; 

// Helper (Keep this consistent with your register controller or move to utils)
const generateToken = (userId) => {
    return jwt.sign({ userId }, process.env.JWT_SECRET, {
        expiresIn: '30d'
    });
};

export const login = async (request, response) => {
    try {
        const { email, password } = request.body;

        // 1. Validate input presence
        if (!email || !password) {
            return response.status(400).json({ message: "Email and password are required" });
        }

        // 2. [NEW] Validate Email Domain
        if (!email.endsWith("@1.ustp.edu.ph")) {
            return response.status(403).json({ message: "Access restricted to @1ustp.edu.ph accounts only." });
        }

        // 3. Find user
        const user = await User.findOne({ email });
        if (!user) {
            return response.status(400).json({ message: "Invalid email or password" });
        }

        // 4. Verify password
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return response.status(400).json({ message: "Invalid email or password" });
        }

        // 5. Generate Token
        const token = generateToken(user._id);

        // 6. Return response
        return response.status(200).json({
            token,
            user: {
                _id: user._id,
                firstname: user.firstname,
                lastname: user.lastname,
                course: user.course,
                email: user.email,
                profileLink: user.profileLink,
                role: user.role
            },
            message: "Login successful"
        });

    } catch (error) {
        console.log("Error in login controller", error);
        return response.status(500).json({ message: "Internal Server Error" });
    }
};